<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

function tableExists(PDO $pdo, string $tableName): bool {
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = DATABASE() AND table_name = ?');
    $stmt->execute([$tableName]);
    return (int)$stmt->fetchColumn() > 0;
}

function resolveCategoryTable(PDO $pdo): string {
    if (tableExists($pdo, 'kategoria')) {
        return 'kategoria';
    }
    if (tableExists($pdo, 'categories')) {
        return 'categories';
    }
    throw new RuntimeException('Nem talalhato kategoria tabla (kategoria vagy categories).');
}

function hasIdColumn(PDO $pdo, string $tableName): bool {
    $stmt = $pdo->prepare('SELECT COUNT(*) FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = ? AND column_name = ?');
    $stmt->execute([$tableName, 'id']);
    return (int)$stmt->fetchColumn() > 0;
}

try {
    $pdo = getPdo();
    $method = $_SERVER['REQUEST_METHOD'];
    $tableName = resolveCategoryTable($pdo);
    $hasId = hasIdColumn($pdo, $tableName);

    if ($method === 'GET') {
        $sql = $hasId
            ? "SELECT id, nev, ar FROM {$tableName} ORDER BY id ASC"
            : "SELECT nev AS id, nev, ar FROM {$tableName} ORDER BY nev ASC";
        $stmt = $pdo->query($sql);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC), JSON_UNESCAPED_UNICODE);
        exit;
    }

    $input = json_decode(file_get_contents('php://input'), true) ?? [];

    if ($method === 'POST') {
        $stmt = $pdo->prepare("INSERT INTO {$tableName} (nev, ar) VALUES (?, ?)");
        $stmt->execute([
            $input['nev'] ?? '',
            (int)($input['ar'] ?? 0)
        ]);

        $newId = $hasId ? (int)$pdo->lastInsertId() : ($input['nev'] ?? '');
        echo json_encode(['id' => $newId], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($method === 'PUT') {
        if ($hasId) {
            $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            $stmt = $pdo->prepare("UPDATE {$tableName} SET nev = ?, ar = ? WHERE id = ?");
            $stmt->execute([
                $input['nev'] ?? '',
                (int)($input['ar'] ?? 0),
                $id
            ]);
        } else {
            $oldNev = $_GET['nev'] ?? ($_GET['id'] ?? '');
            $stmt = $pdo->prepare("UPDATE {$tableName} SET nev = ?, ar = ? WHERE nev = ?");
            $stmt->execute([
                $input['nev'] ?? '',
                (int)($input['ar'] ?? 0),
                $oldNev
            ]);
        }

        echo json_encode(['updated' => $stmt->rowCount()], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($method === 'DELETE') {
        if ($hasId) {
            $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
            $stmt = $pdo->prepare("DELETE FROM {$tableName} WHERE id = ?");
            $stmt->execute([$id]);
        } else {
            $nev = $_GET['nev'] ?? ($_GET['id'] ?? '');
            $stmt = $pdo->prepare("DELETE FROM {$tableName} WHERE nev = ?");
            $stmt->execute([$nev]);
        }

        echo json_encode(['deleted' => $stmt->rowCount()], JSON_UNESCAPED_UNICODE);
        exit;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
