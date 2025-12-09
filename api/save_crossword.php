<?php
include ("../includes/config.php");
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASS;
$dbname = DB_NAME;

$data = json_decode(file_get_contents('php://input'), true);

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // Crea tabella per salvare i cruciverba generati (se non esiste)
    $sql = "CREATE TABLE IF NOT EXISTS cruciverba_salvati (
        id INT PRIMARY KEY AUTO_INCREMENT,
        data_creazione TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        difficolta VARCHAR(20),
        griglia TEXT,
        parole JSON,
        dimensioni VARCHAR(10),
        tempo_completamento INT DEFAULT 0
    )";
    
    $conn->exec($sql);
    
    $stmt = $conn->prepare("
        INSERT INTO cruciverba_salvati 
        (difficolta, griglia, parole, dimensioni) 
        VALUES (:difficolta, :griglia, :parole, :dimensioni)
    ");
    
    $stmt->execute([
        ':difficolta' => $data['difficolta'],
        ':griglia' => json_encode($data['grid']),
        ':parole' => json_encode($data['words']),
        ':dimensioni' => $data['dimensions']
    ]);
    
    $lastId = $conn->lastInsertId();
    
    echo json_encode([
        'success' => true,
        'message' => 'Cruciverba salvato con ID: ' . $lastId,
        'id' => $lastId
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Errore: ' . $e->getMessage()
    ]);
}
?>