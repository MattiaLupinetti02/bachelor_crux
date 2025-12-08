<?php
// api/get_items.php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

require_once '../includes/database.php';

$type = isset($_GET['type']) ? $_GET['type'] : 'book';
$database = new Database();
$items = $database->getItemsByType($type);

// Calcola angoli per la ruota
$totalItems = count($items);
$arcPerItem = 360 / $totalItems;
$currentAngle = 0;

foreach ($items as &$item) {
    $item['angle'] = $currentAngle;
    $item['arc'] = $arcPerItem;
    $currentAngle += $arcPerItem;
}

echo json_encode([
    'success' => true,
    'type' => $type,
    'items' => $items,
    'totalItems' => $totalItems
]);
?>