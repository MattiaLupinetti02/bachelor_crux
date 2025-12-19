<?php
// api/get_images.php

// Cartella delle immagini penitenza
$cartella = '../assets/img/penitenza/';
$immagini = [];

// Controlla se la cartella esiste
if (is_dir($cartella)) {
    // Scansiona la cartella
    $files = scandir($cartella);
    
    // Filtra solo file immagine
    foreach ($files as $file) {
        if ($file !== '.' && $file !== '..') {
            // Controlla estensione immagine
            $estensione = strtolower(pathinfo($file, PATHINFO_EXTENSION));
            $estensioni_valide = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
            
            if (in_array($estensione, $estensioni_valide)) {
                $immagini[] = $file;
            }
        }
    }
}

// Restituisce come JSON
header('Content-Type: application/json');
echo json_encode($immagini);
?>