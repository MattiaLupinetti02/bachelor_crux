<?php
// populate_books.php
require_once 'includes/database.php';

$database = new Database();

echo "<h1>Popolamento Database Ruota dei Libri</h1>";
echo "<p>Questo script popola il database con tutte le domande sui libri.</p>";
echo "<hr>";

// Verifica se le domande esistono già
$checkSql = "SELECT COUNT(*) as count FROM wheel_items WHERE category_id = 1";
$result = $database->query($checkSql);
$row = $result->fetch_assoc();

if ($row['count'] > 0) {
    echo "<p style='color: orange;'>Il database contiene già delle domande.</p>";
    echo "<p>Vuoi svuotare la tabella e reinserire tutte le domande?</p>";
    echo "<form method='POST'>";
    echo "<input type='submit' name='reset' value='Sì, resetta e reinserisci'> ";
    echo "<input type='submit' name='cancel' value='No, esci'>";
    echo "</form>";
    
    if (isset($_POST['reset'])) {
        // Svuota la tabella
        $database->query("DELETE FROM wheel_items WHERE category_id = 1");
        echo "<p style='color: green;'>Tabella svuotata. Inserimento nuovi dati...</p>";
    } elseif (isset($_POST['cancel'])) {
        exit();
    }
}

// Lista completa dei libri con domande
$books = [
    'Il Giovane Torless' => 'Analizza il tema della crudeltà e del potere nel romanzo.',
    'Furore' => 'Descrivi la condizione dei migranti durante la Grande Depressione.',
    'Ipnocrazia. Trump, Mask e la nuova architettura della realtà' => 'Come vengono analizzate le strategie di manipolazione mediatica?',
    'Elogio dell\'ignoranza e dell\'errore' => 'Perché secondo l\'autore l\'ignoranza può essere un valore?',
    'Lo sbilico' => 'Quali sono le caratteristiche principali dello stile narrativo?',
    'Il vampiro' => 'Come viene modernizzata la figura del vampiro?',
    'Quando il mondo dorme. Storie, parole e ferite della palestina' => 'Quali storie palestinesi vengono raccontate?',
    'Camera con vista' => 'Analizza il conflitto tra convenzioni sociali e desideri personali.',
    'L\'amore è un fiume' => 'Come viene sviluppata la metafora dell\'amore come fiume?',
    'Sogno di una notte di mezz\'estate' => 'Quali sono i piani di realtà presenti nella commedia?',
    'Solo è il coraggio. Giovanni Falcone, il romanzo' => 'Come viene descritto il coraggio di Falcone?',
    'Ogni maledetto lunedì su due' => 'Cosa rappresenta la routine nel libro?',
    'Le parole sono sciami d\'api: la violenza contro le donne: una questione culturale' => 'Come viene affrontato il tema della violenza di genere?',
    'Il cuore scoperto. Per ri fare l\'amore' => 'Quali sono le strategie per "rifare l\'amore"?',
    'Questa notte non sarà breve' => 'Qual è l\'atmosfera predominante del libro?',
    'Brancaccio, Storie di mafia quotidiana' => 'Come viene raccontata la mafia quotidiana?',
    'Niente di nuovo sul fronte di rebibbia' => 'Cosa emerge dalla vita carceraria?',
    'Le signore della scrittura' => 'Quali autrici vengono celebrate e perché?',
    'Erotica dei sentimenti: per una nuova educazione sentimentale' => 'In cosa consiste la nuova educazione sentimentale proposta?',
    'L\'anniversario' => 'Qual è il significato simbolico dell\'anniversario?',
    'La scuola è politica. Abbecedario laico, popolare e democratico' => 'Perché secondo il libro la scuola non può essere neutrale?',
    'Son qui: m\'ammazzi: i personaggi maschili nella letteratura italiana' => 'Come vengono analizzati i personaggi maschili nella letteratura italiana?',
    'Genie la talla' => 'Qual è il tema centrale dell\'opera?',
    'Addio, bella crudeltà' => 'Cosa significa il distacco dalla crudeltà?',
    'Massime spirituali' => 'Qual è lo scopo delle massime presentate?',
    'La bambina di Kabul' => 'Qual è la storia della protagonista?',
    'Camerette: un racconto sulla giovinezza, dalle pareti delle nostre stanze ai social media' => 'Come vengono analizzati i giovani attraverso le loro stanze?',
    'Grammamanti: immaginare futuri con le parole' => 'Qual è il potere delle parole nel costruire futuri?',
    'Una donna spezzata' => 'Quali sono le cause della "rottura" della protagonista?',
    'Una donna' => 'Cosa rende questa autobiografia significativa?',
    'Palestina (Nour Abduzaid)' => 'Quale prospettiva viene offerta sul conflitto?',
    'Menodramma' => 'In cosa consiste il "menodramma" come genere?',
    'Noi due ci apparteniamo: Sesso, amore, violenza, tradimento nella vita di coppia' => 'Come vengono analizzati sesso, amore e tradimento?',
    'La campana di vetro' => 'Analizza il tema della depressione e dell\'isolamento.'
];

// Colori per i settori della ruota
$colors = ['#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0', '#118AB2', '#EF476F', '#7209B7', '#3A86FF', '#9B59B6', '#E74C3C'];

echo "<ul>";
$count = 0;
foreach ($books as $bookTitle => $question) {
    $color = $colors[$count % count($colors)];
    $sql = "INSERT INTO wheel_items (category_id, title, content, item_type, book_title, color) 
            VALUES (1, 
            '{$database->escape($bookTitle)}', 
            '{$database->escape($question)}', 
            'question', 
            '{$database->escape($bookTitle)}', 
            '$color')";
    
    if ($database->query($sql)) {
        echo "<li style='color: green;'>✓ Inserito: <strong>$bookTitle</strong></li>";
        $count++;
    } else {
        echo "<li style='color: red;'>✗ Errore: $bookTitle</li>";
    }
}

echo "</ul>";
echo "<hr>";
echo "<h3>Database popolato con successo!</h3>";
echo "<p>Inseriti $count libri con le relative domande.</p>";
echo "<p><a href='index.php'>Vai alla Ruota dei Libri</a></p>";
echo "<p><a href='penance.php'>Vai alla Ruota delle Penitenze</a></p>";
?>