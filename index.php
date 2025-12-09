<?php
// index.php
require_once 'includes/database.php';
?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ruota dei Libri - Gioco Letterario</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap" rel="stylesheet">  
    <link rel="stylesheet" href="assets/css/crossword.css">
</head>
<body>
    <div class="container">
        <header class="header">
            <div class="wheel-switcher">
                <button id="switchToPenance" class="switch-btn">
                    <i class="fas fa-exchange-alt"></i> Vai alle Penitenze
                </button>
                <button id="switchToCrossword" class="switch-btn">
                    <i class="fas fa-puzzle-piece"></i> Cruciverba
                </button>
            </div>
            <h1><i class="fas fa-book"></i> RUOTA DEI LIBRI</h1>
            <p class="subtitle">Clicca sulla ruota per estrarre una domanda su uno dei libri!</p>
        </header>
        
        <main class="main-content">
            <div class="controls">
                <label for="difficulty-select">Difficoltà:</label>
                <select id="difficulty-select">
                    <option value="facile">Facile</option>
                    <option value="medio">Medio</option>
                    <option value="difficile">Difficile</option>
                </select>
                
                <button id="generate-crossword">Genera Nuovo Cruciverba</button>
                
                <button id="check-solution">Controlla Soluzione</button>
                <button id="reveal-solution">Mostra Soluzione</button>
            </div>
        
            <div class="stats" id="stats">
                Parole piazzate: <span id="placed-count">0</span> | 
                Dimensioni: <span id="dimensions">15x15</span>
            </div>
            
            <div class="crossword-container">
                <div id="crossword-grid">
                    <!-- La griglia verrà generata qui -->
                </div>
                
                <div class="clues-container">
                    <h2>Definizioni</h2>
                    <div id="crossword-clues">
                        <!-- Le definizioni verranno generate qui -->
                    </div>
                </div>
            </div>
        </main>
        
        <!-- Modal per il risultato -->
        <div id="resultModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-star"></i> Risultato Estratto</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div id="resultContent">
                        <!-- Il contenuto sarà inserito qui -->
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="shareButton" class="btn-share">
                        <i class="fas fa-share-alt"></i> Condividi
                    </button>
                    <button id="playAgainButton" class="btn-primary">
                        <i class="fas fa-redo"></i> Gioca Ancora
                    </button>
                </div>
            </div>
        </div>
        
        <footer class="footer">
            <p>Ruota dei Libri &copy; <?php echo date('Y'); ?> - Gioco letterario educativo</p>
            <p><small>Totalmente personalizzabile - Database MySQL - PHP/JS/CSS</small></p>
        </footer>
    </div>
    
    <!-- Scripts -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <!--<script src="assets/js/wheel.js"></script>-->
    <script src="assets/js/crossword.js"></script>

    <script>
        // Aggiungi gestione del pulsante Cruciverba
        $(document).ready(function() {
            $('#switchToCrossword').click(function() {
                window.location.href = 'crossword.php';
            });
            
            $('#switchToPenance').click(function() {
                window.location.href = 'penance.php';
            });
        });
    </script>
</body>
</html>