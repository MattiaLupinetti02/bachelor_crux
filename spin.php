<?php
// spin.php
require_once 'includes/database.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $database = new Database();
    
    $item_id = isset($_POST['item_id']) ? intval($_POST['item_id']) : 0;
    $type = isset($_POST['type']) ? $_POST['type'] : 'book';
    
    if ($item_id > 0) {
        $result = $database->saveSpinResult($item_id, $type);
        
        if ($result) {
            echo json_encode(['success' => true, 'message' => 'Spin saved successfully', 'type' => $type]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Error saving spin']);
        }
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid item ID']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
?>