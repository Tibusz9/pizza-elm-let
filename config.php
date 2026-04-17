<?php
header('Content-Type: application/json; charset=utf-8');

function readEnvValue(string $key, string $default = ''): string {
    $envPath = __DIR__ . '/../.env';
    if (!file_exists($envPath)) {
        return $default;
    }

    $lines = file($envPath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        $line = trim($line);
        if ($line === '' || str_starts_with($line, '#')) continue;
        [$k, $v] = array_pad(explode('=', $line, 2), 2, '');
        if (trim($k) === $key) {
            return trim($v);
        }
    }

    return $default;
}

function getPdo(): PDO {
    $host = readEnvValue('DB_HOST', 'localhost');
    $db = readEnvValue('DB_NAME', 'adatb');
    $user = readEnvValue('DB_USER', '');
    $pass = readEnvValue('DB_PASS', '');

    if ($user === '' || $pass === '') {
        throw new RuntimeException('A DB_USER es DB_PASS kotelezo a .env fajlban.');
    }

    return new PDO(
        "mysql:host=$host;dbname=$db;charset=utf8mb4",
        $user,
        $pass,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
}
