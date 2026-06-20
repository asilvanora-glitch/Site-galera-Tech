<?php
// ============================================================
//  api/depoimentos.php — Retorna depoimentos aleatórios
//  Galera Tech
// ============================================================

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate');

require_once __DIR__ . '/../config/conexao.php';

try {
    // Busca todos os depoimentos ativos, ordenados aleatoriamente
    $stmt = $pdo->query("
        SELECT id, nome, cargo, empresa, texto, foto, tipo
        FROM depoimentos
        WHERE ativo = 1
        ORDER BY RAND()
        LIMIT 4
    ");

    $depoimentos = $stmt->fetchAll(PDO::FETCH_ASSOC);

    if (empty($depoimentos)) {
        echo json_encode(['principal' => null, 'laterais' => []]);
        exit;
    }

    // O primeiro (aleatório) vira o principal, os demais ficam nas laterais
    $principal = $depoimentos[0];
    $laterais  = array_slice($depoimentos, 1);

    echo json_encode([
        'principal' => $principal,
        'laterais'  => $laterais
    ]);

} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['erro' => 'Erro ao buscar depoimentos.']);
}