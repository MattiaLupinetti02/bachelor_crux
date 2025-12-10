<?php
// api/save_crossword.php
header('Content-Type: application/json');
require_once '../includes/database.php';

$database = new Database();
$conn = $database->getConnection();

$data = json_decode(file_get_contents('php://input'), true);

if (!$data) {
    echo json_encode(['success' => false, 'message' => 'Nessun dato ricevuto']);
    exit;
}

// Salva il cruciverba nel database
$grid_json = json_encode($data['grid']);
$words_json = json_encode($data['words']);
$stats_json = json_encode($data['stats']);

$query = "INSERT INTO cruciverba_generati 
          (griglia, parole, statistiche, timestamp) 
          VALUES (?, ?, ?, NOW())";
          
$stmt = $conn->prepare($query);
$stmt->bind_param('sss', $grid_json, $words_json, $stats_json);

if ($stmt->execute()) {
    echo json_encode([
        'success' => true, 
        'id' => $stmt->insert_id,
        'message' => 'Cruciverba salvato con successo'
    ]);
} else {
    echo json_encode(['success' => false, 'message' => $conn->error]);
}

$stmt->close();
?>