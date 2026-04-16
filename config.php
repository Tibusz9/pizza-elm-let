<?php
header('Content-Type: application/json; charset=utf-8');

function readEnvValue(string $key, string $default = ''): string {
    $envPath = __DIR__ . '/../.env';
    if (!file_exists($envPath)) {
        return $default;
    }
