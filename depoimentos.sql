-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 02/06/2026 às 21:10
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12
 
SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
 
 
/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
 
--
-- Banco de dados: `galeratech`
--
 
-- --------------------------------------------------------
 
--
-- Estrutura para tabela `depoimentos`
--
 
CREATE TABLE `depoimentos` (
  `id` int(11) NOT NULL,
  `nome` varchar(120) NOT NULL,
  `cargo` varchar(150) DEFAULT NULL,
  `empresa` varchar(150) DEFAULT NULL,
  `texto` text NOT NULL,
  `foto` varchar(255) DEFAULT NULL,
  `tipo` enum('aluno','padrinho','mentor','parceiro') DEFAULT 'aluno',
  `destaque` tinyint(1) DEFAULT 0,
  `ordem` int(11) DEFAULT 0,
  `ativo` tinyint(1) DEFAULT 1,
  `criado_em` timestamp NOT NULL DEFAULT current_timestamp(),
  `atualizado_em` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
 
--
-- Despejando dados para a tabela `depoimentos`
--
 
INSERT INTO `depoimentos` (`id`, `nome`, `cargo`, `empresa`, `texto`, `foto`, `tipo`, `destaque`, `ordem`, `ativo`, `criado_em`, `atualizado_em`) VALUES
(1, 'Nome do aluno', 'Participante Galera Tech', NULL, 'O Galera Tech me mostrou que tecnologia também é para mim. Aprendi programação, conheci pessoas incríveis e comecei a enxergar novas possibilidades para o meu futuro.', 'uploads/depoimentos/depoimento-aluno.jpg', 'aluno', 1, 1, 1, '2026-05-28 19:47:25', '2026-05-28 19:47:25'),
(2, 'Nome do padrinho', 'Empresa apoiadora', NULL, 'Apoiar o Galera Tech é investir em jovens talentos e no futuro da tecnologia em Rio Preto.', NULL, 'padrinho', 0, 2, 1, '2026-05-28 19:47:25', '2026-05-28 19:47:25'),
(3, 'Nome do mentor', 'Profissional de tecnologia', NULL, 'O projeto aproxima os alunos da realidade do mercado e cria oportunidades concretas.', NULL, 'mentor', 0, 3, 1, '2026-05-28 19:47:25', '2026-05-28 19:47:25'),
(4, 'Nome do participante', 'Aluno Galera Tech', NULL, 'Foi uma experiência que mudou minha visão sobre carreira, estudo e futuro.', NULL, 'aluno', 0, 4, 1, '2026-05-28 19:47:25', '2026-05-28 19:47:25');
 
--
-- Índices para tabelas despejadas
--
 
--
-- Índices de tabela `depoimentos`
--
ALTER TABLE `depoimentos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_depoimentos_ativo_destaque` (`ativo`,`destaque`);
 
--
-- AUTO_INCREMENT para tabelas despejadas
--
 
--
-- AUTO_INCREMENT de tabela `depoimentos`
--
ALTER TABLE `depoimentos`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;
COMMIT;
 
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
 