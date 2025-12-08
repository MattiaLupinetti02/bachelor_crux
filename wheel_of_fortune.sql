-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Creato il: Dic 08, 2025 alle 21:58
-- Versione del server: 10.4.32-MariaDB
-- Versione PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `wheel_of_fortune`
--

-- --------------------------------------------------------

--
-- Struttura della tabella `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `type` enum('book','penance') DEFAULT 'book',
  `description` text DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `categories`
--

INSERT INTO `categories` (`id`, `name`, `type`, `description`, `is_active`) VALUES
(1, 'Libri', 'book', 'Domande sui libri della lista', 1),
(2, 'Penitenze', 'penance', 'Compiti divertenti da eseguire', 1);

-- --------------------------------------------------------

--
-- Struttura della tabella `spin_results`
--

CREATE TABLE `spin_results` (
  `id` int(11) NOT NULL,
  `item_id` int(11) DEFAULT NULL,
  `category_type` enum('book','penance') DEFAULT NULL,
  `spin_date` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `spin_results`
--

INSERT INTO `spin_results` (`id`, `item_id`, `category_type`, `spin_date`) VALUES
(1, 27, 'book', '2025-12-08 20:54:58'),
(2, 44, 'penance', '2025-12-08 20:55:44');

-- --------------------------------------------------------

--
-- Struttura della tabella `wheel_items`
--

CREATE TABLE `wheel_items` (
  `id` int(11) NOT NULL,
  `category_id` int(11) DEFAULT NULL,
  `title` varchar(200) NOT NULL,
  `content` text NOT NULL,
  `item_type` enum('question','penance') DEFAULT 'question',
  `book_title` varchar(200) DEFAULT NULL,
  `color` varchar(7) DEFAULT '#3498db',
  `is_active` tinyint(1) DEFAULT 1,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dump dei dati per la tabella `wheel_items`
--

INSERT INTO `wheel_items` (`id`, `category_id`, `title`, `content`, `item_type`, `book_title`, `color`, `is_active`, `created_at`) VALUES
(1, 1, 'Il Giovane Torless', 'Analizza il tema della crudeltà e del potere nel romanzo.', 'question', 'Il Giovane Torless', '#FF6B6B', 1, '2025-12-08 20:48:12'),
(2, 1, 'Furore', 'Descrivi la condizione dei migranti durante la Grande Depressione.', 'question', 'Furore', '#4ECDC4', 1, '2025-12-08 20:48:12'),
(3, 1, 'Ipnocrazia', 'Come vengono analizzate le strategie di manipolazione mediatica?', 'question', 'Ipnocrazia. Trump, Mask e la nuova architettura della realtà', '#FFD166', 1, '2025-12-08 20:48:12'),
(4, 1, 'Elogio dell\'ignoranza', 'Perché secondo l\'autore l\'ignoranza può essere un valore?', 'question', 'Elogio dell\'ignoranza e dell\'errore', '#06D6A0', 1, '2025-12-08 20:48:12'),
(5, 1, 'Lo Sbilico', 'Quali sono le caratteristiche principali dello stile narrativo?', 'question', 'Lo sbilico', '#118AB2', 1, '2025-12-08 20:48:12'),
(6, 1, 'Il Vampiro', 'Come viene modernizzata la figura del vampiro?', 'question', 'Il vampiro', '#EF476F', 1, '2025-12-08 20:48:12'),
(7, 1, 'Quando il mondo dorme', 'Quali storie palestinesi vengono raccontate?', 'question', 'Quando il mondo dorme. Storie, parole e ferite della palestina', '#7209B7', 1, '2025-12-08 20:48:12'),
(8, 1, 'Camera con vista', 'Analizza il conflitto tra convenzioni sociali e desideri personali.', 'question', 'Camera con vista', '#3A86FF', 1, '2025-12-08 20:48:12'),
(9, 1, 'L\'amore è un fiume', 'Come viene sviluppata la metafora dell\'amore come fiume?', 'question', 'l\'amore è un fiume', '#FF6B6B', 1, '2025-12-08 20:48:12'),
(10, 1, 'Sogno di una notte di mezz\'estate', 'Quali sono i piani di realtà presenti nella commedia?', 'question', 'sogno di una notte di mezz\'estate', '#4ECDC4', 1, '2025-12-08 20:48:12'),
(11, 1, 'Solo è il coraggio', 'Come viene descritto il coraggio di Falcone?', 'question', 'solo è il coraggio. giovanni falcone, il romanzo', '#FFD166', 1, '2025-12-08 20:48:12'),
(12, 1, 'Ogni maledetto lunedì su due', 'Cosa rappresenta la routine nel libro?', 'question', 'ogni maledetto lunedì su due', '#06D6A0', 1, '2025-12-08 20:48:12'),
(13, 1, 'Le parole sono sciami d\'api', 'Come viene affrontato il tema della violenza di genere?', 'question', 'le parole sono sciami d\'api: la violenza contro le donne: una questione culturale', '#118AB2', 1, '2025-12-08 20:48:12'),
(14, 1, 'Il cuore scoperto', 'Quali sono le strategie per \"rifare l\'amore\"?', 'question', 'il cuore scoperto. per ri fare l\'amore', '#EF476F', 1, '2025-12-08 20:48:12'),
(15, 1, 'Questa notte non sarà breve', 'Qual è l\'atmosfera predominante del libro?', 'question', 'questa notte non sarà breve', '#7209B7', 1, '2025-12-08 20:48:12'),
(16, 1, 'Brancaccio', 'Come viene raccontata la mafia quotidiana?', 'question', 'brancaccio, Storie di mafia quotidiana', '#3A86FF', 1, '2025-12-08 20:48:12'),
(17, 1, 'Niente di nuovo sul fronte di rebibbia', 'Cosa emerge dalla vita carceraria?', 'question', 'niente di nuovo sul fronte di rebibbia', '#FF6B6B', 1, '2025-12-08 20:48:12'),
(18, 1, 'Le signore della scrittura', 'Quali autrici vengono celebrate e perché?', 'question', 'le signore della scrittura', '#4ECDC4', 1, '2025-12-08 20:48:12'),
(19, 1, 'Erotica dei sentimenti', 'In cosa consiste la nuova educazione sentimentale proposta?', 'question', 'erotica dei sentimenti: per una nuova educazione sentimentale', '#FFD166', 1, '2025-12-08 20:48:12'),
(20, 1, 'L\'anniversario', 'Qual è il significato simbolico dell\'anniversario?', 'question', 'l\'anniversario', '#06D6A0', 1, '2025-12-08 20:48:12'),
(21, 1, 'La scuola è politica', 'Perché secondo il libro la scuola non può essere neutrale?', 'question', 'la scuola è politica. Abbecedario laico, popolare e democratico', '#118AB2', 1, '2025-12-08 20:48:12'),
(22, 1, 'Son qui: m\'ammazzi', 'Come vengono analizzati i personaggi maschili nella letteratura italiana?', 'question', 'son qui: m\'ammazzi: i personaggi maschili nella lettaratura italiana', '#EF476F', 1, '2025-12-08 20:48:12'),
(23, 1, 'Genie la talla', 'Qual è il tema centrale dell\'opera?', 'question', 'genie la talla', '#7209B7', 1, '2025-12-08 20:48:12'),
(24, 1, 'Addio, bella crudeltà', 'Cosa significa il distacco dalla crudeltà?', 'question', 'addio, bella crudeltà', '#3A86FF', 1, '2025-12-08 20:48:12'),
(25, 1, 'Massime spirituali', 'Qual è lo scopo delle massime presentate?', 'question', 'massime spirituali', '#FF6B6B', 1, '2025-12-08 20:48:12'),
(26, 1, 'La bambina di kabul', 'Qual è la storia della protagonista?', 'question', 'la bambina di kabul', '#4ECDC4', 1, '2025-12-08 20:48:12'),
(27, 1, 'Camerette', 'Come vengono analizzati i giovani attraverso le loro stanze?', 'question', 'camerette: un racconto sulla giovinezza, dalle pareti delle nostre stanze ai social media', '#FFD166', 1, '2025-12-08 20:48:12'),
(28, 1, 'Grammamanti', 'Qual è il potere delle parole nel costruire futuri?', 'question', 'grammamanti:immaginare futuri con le parole', '#06D6A0', 1, '2025-12-08 20:48:12'),
(29, 1, 'Una donna spezzata', 'Quali sono le cause della \"rottura\" della protagonista?', 'question', 'Una donna spezzata', '#118AB2', 1, '2025-12-08 20:48:12'),
(30, 1, 'Una donna', 'Cosa rende questa autobiografia significativa?', 'question', 'Una donna', '#EF476F', 1, '2025-12-08 20:48:12'),
(31, 1, 'Palestina (Nour Abduzaid)', 'Quale prospettiva viene offerta sul conflitto?', 'question', 'palestina (nour abduzaid)', '#7209B7', 1, '2025-12-08 20:48:12'),
(32, 1, 'Menodramma', 'In cosa consiste il \"menodramma\" come genere?', 'question', 'menodramma', '#3A86FF', 1, '2025-12-08 20:48:12'),
(33, 1, 'Noi due ci apparteniamo', 'Come vengono analizzati sesso, amore e tradimento?', 'question', 'noi due ci apparteniamo: Sesso , amore, violenza, tradimento nella vita dei voss', '#FF6B6B', 1, '2025-12-08 20:48:12'),
(34, 1, 'La campana di vetro', 'Analizza il tema della depressione e dell\'isolamento.', 'question', 'la campana di vetro', '#4ECDC4', 1, '2025-12-08 20:48:12'),
(35, 2, 'Penitenza Creativa', 'Inventa una breve poesia (4 versi) su uno dei libri estratti.', 'penance', NULL, '#9B59B6', 1, '2025-12-08 20:48:12'),
(36, 2, 'Penitenza Teatrale', 'Recita a memoria un dialogo di 30 secondi di un libro a tua scelta.', 'penance', NULL, '#E74C3C', 1, '2025-12-08 20:48:12'),
(37, 2, 'Penitenza Fisica', 'Fai 10 piegamenti sulle gambe mentre dici il titolo di un libro ad ogni piegamento.', 'penance', NULL, '#1ABC9C', 1, '2025-12-08 20:48:12'),
(38, 2, 'Penitenza Musicale', 'Canta l\'inizio di una canzone che ti ricorda uno dei libri della lista.', 'penance', NULL, '#F39C12', 1, '2025-12-08 20:48:12'),
(39, 2, 'Penitenza Artistica', 'Disegna in 1 minuto la copertina del libro che preferisci.', 'penance', NULL, '#3498DB', 1, '2025-12-08 20:48:12'),
(40, 2, 'Penitenza Memoristica', 'Ripeti a memoria i titoli di 5 libri della lista in ordine alfabetico.', 'penance', NULL, '#E67E22', 1, '2025-12-08 20:48:12'),
(41, 2, 'Penitenza Espressiva', 'Imita per 1 minuto il protagonista di un libro a tua scelta.', 'penance', NULL, '#2ECC71', 1, '2025-12-08 20:48:12'),
(42, 2, 'Penitenza Riflessiva', 'Condividi una lezione di vita che hai imparato da un libro.', 'penance', NULL, '#95A5A6', 1, '2025-12-08 20:48:12'),
(43, 2, 'Penitenza Social', 'Chiama un amico e raccontagli in 2 minuti la trama di un libro.', 'penance', NULL, '#9B59B6', 1, '2025-12-08 20:48:12'),
(44, 2, 'Penitenza Scrittura', 'Scrivi un tweet (280 caratteri) che promuova un libro della lista.', 'penance', NULL, '#E74C3C', 1, '2025-12-08 20:48:12');

--
-- Indici per le tabelle scaricate
--

--
-- Indici per le tabelle `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`);

--
-- Indici per le tabelle `spin_results`
--
ALTER TABLE `spin_results`
  ADD PRIMARY KEY (`id`),
  ADD KEY `item_id` (`item_id`);

--
-- Indici per le tabelle `wheel_items`
--
ALTER TABLE `wheel_items`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`);

--
-- AUTO_INCREMENT per le tabelle scaricate
--

--
-- AUTO_INCREMENT per la tabella `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT per la tabella `spin_results`
--
ALTER TABLE `spin_results`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT per la tabella `wheel_items`
--
ALTER TABLE `wheel_items`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=45;

--
-- Limiti per le tabelle scaricate
--

--
-- Limiti per la tabella `spin_results`
--
ALTER TABLE `spin_results`
  ADD CONSTRAINT `spin_results_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `wheel_items` (`id`);

--
-- Limiti per la tabella `wheel_items`
--
ALTER TABLE `wheel_items`
  ADD CONSTRAINT `wheel_items_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
