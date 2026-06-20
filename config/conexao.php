<?php
// ============================================================
//  config/conexao.php — Conexão PDO com MySQL/MariaDB
//  Galera Tech
// ============================================================

define('DB_HOST', '127.0.0.1');
define('DB_NAME', 'galeratech');
define('DB_USER', 'root');       // ← altere se necessário
define('DB_PASS', '');           // ← altere se necessário
define('DB_CHARSET', 'utf8mb4');

$dsn = "mysql:host=" . DB_HOST . ";dbname=" . DB_NAME . ";charset=" . DB_CHARSET;

$opcoes = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

try {
    $pdo = new PDO($dsn, DB_USER, DB_PASS, $opcoes);
} catch (PDOException $e) {
    http_response_code(500);
    header('Content-Type: application/json');
    echo json_encode(['erro' => 'Falha na conexão com o banco de dados.']);
    exit;
}