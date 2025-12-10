<?php
include ("../includes/config.php");
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$servername = DB_HOST;
$username = DB_USER;
$password = DB_PASS;
$dbname = DB_NAME;

try {
    $conn = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
//    $difficolta = $_GET['difficolta'] ?? 'facile';
    $limit = $_GET['limit'] ?? 20;
    
    $stmt = $conn->prepare("
        SELECT id, difficolta, definizione, soluzione, libro 
        FROM definizioni_cruciverba 
        ORDER BY RAND() 
        LIMIT :limit
    ");
    
    //$stmt->bindParam(':difficolta', $difficolta);
    $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    $stmt->execute();
    
    $definizioni = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'data' => $definizioni,
        'count' => count($definizioni)
    ]);
    
} catch(PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => 'Errore: ' . $e->getMessage()
    ]);
}

$conn = null;
?>