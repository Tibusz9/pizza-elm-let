<?php
require_once __DIR__ . '/../config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

try {
    $pdo = getPdo();
    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        $stmt = $pdo->query('SELECT id, nev, kategorianev, vegetarianus FROM pizzas ORDER BY id DESC');
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC), JSON_UNESCAPED_UNICODE);
        exit;
    }
     $input = json_decode(file_get_contents('php://input'), true) ?? [];

    if ($method === 'POST') {
        $stmt = $pdo->prepare('INSERT INTO pizzas (nev, kategorianev, vegetarianus) VALUES (?, ?, ?)');
        $stmt->execute([
            $input['nev'] ?? '',
            $input['kategorianev'] ?? '',
            (int)($input['vegetarianus'] ?? 0)
        ]);
        echo json_encode(['id' => (int)$pdo->lastInsertId()], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($method === 'PUT') {
        $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
        $stmt = $pdo->prepare('UPDATE pizzas SET nev = ?, kategorianev = ?, vegetarianus = ? WHERE id = ?');
        $stmt->execute([
            $input['nev'] ?? '',
            $input['kategorianev'] ?? '',
            (int)($input['vegetarianus'] ?? 0),
            $id
        ]);
        echo json_encode(['updated' => $stmt->rowCount()], JSON_UNESCAPED_UNICODE);
        exit;
    }

    if ($method === 'DELETE') {
        $id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
        $stmt = $pdo->prepare('DELETE FROM pizzas WHERE id = ?');
        $stmt->execute([$id]);
        echo json_encode(['deleted' => $stmt->rowCount()], JSON_UNESCAPED_UNICODE);
        exit;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()], JSON_UNESCAPED_UNICODE);
}

