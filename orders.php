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

function resolveOrderTable(PDO $pdo): string {
    if (tableExists($pdo, 'rendeles')) {
        return 'rendeles';
    }
    if (tableExists($pdo, 'orders')) {
        return 'orders';
    }
    throw new RuntimeException('Nem talalhato rendeles tabla (rendeles vagy orders).');
}

try {
    $pdo = getPdo();
    $method = $_SERVER['REQUEST_METHOD'];
    $tableName = resolveOrderTable($pdo);

    if ($method === 'GET') {
        $stmt = $pdo->query("SELECT pizzanev, darab, felvetel, kiszallitas FROM {$tableName} ORDER BY felvetel DESC");
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC), JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true) ?? [];
        $stmt = $pdo->prepare("INSERT INTO {$tableName} (pizzanev, darab, felvetel, kiszallitas) VALUES (?, ?, ?, ?)");
        $stmt->execute([
            $input['pizzanev'] ?? '',
            (int)($input['darab'] ?? 1),
            $input['felvetel'] ?? null,
            $input['kiszallitas'] ?? null
        ]);
        echo json_encode(['created' => 1], JSON_UNESCAPED_UNICODE);
        exit;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}
