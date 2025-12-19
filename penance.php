<?php
// penance.php
require_once 'includes/database.php';
?>
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Ruota delle Penitenze - Gioco Divertente</title>
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;600;700;800&display=swap" rel="stylesheet">
</head>
<body>
    <div class="container">
        <header class="header">
            <div class="wheel-switcher">
                <button id="switchToBooks" class="switch-btn">
                    <i class="fas fa-exchange-alt"></i> Torna ai Libri
                </button>
            </div>
            <h1><i class="fas fa-theater-masks"></i> RUOTA DELLE PENITENZE</h1>
            <p class="subtitle">Clicca sulla ruota per estrarre una penitenza divertente!</p>
        </header>
        
        <main class="main-content">
            <div class="wheel-container">
                <div class="wheel-wrapper">
                    <canvas id="wheelCanvas" width="600" height="600"></canvas>
                    <div class="wheel-center">
                        <div class="spin-button" id="spinButton">
                            <i class="fas fa-play"></i>
                            <span>GIRA!</span>
                        </div>
                    </div>
                    <div class="pointer"></div>
                </div>
                
                <!--<div class="controls">
                    <div class="player-input">
                        <label for="playerName"><i class="fas fa-user"></i> Giocatore:</label>
                        <input type="text" id="playerName" placeholder="Il tuo nome" value="Giocatore">
                    </div>
                    <button id="resetButton" class="btn-secondary">
                        <i class="fas fa-redo"></i> Reset Ruota
                    </button>
                </div>-->
            </div>
            
            <div class="prizes-panel">
                <h2><i class="fas fa-theater-masks"></i> Penitenze Disponibili</h2>
                <div class="prizes-grid" id="prizesGrid">
                    <!-- Le penitenze saranno caricati dinamicamente -->
                    <p class="no-items">Caricamento penitenze in corso...</p>
                </div>
            </div>
        </main>
        
        <!-- Modal per il risultato -->
        <div id="resultModal" class="modal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2><i class="fas fa-star"></i> Penitenza Estratta</h2>
                    <button class="close-modal">&times;</button>
                </div>
                <div class="modal-body">
                    <div id="resultContent">
                        <!-- Il contenuto sarà inserito qui -->
                    </div>
                </div>
                <div class="modal-footer">
                    <button id="playAgainButton" class="btn-primary">
                        <i class="fas fa-redo"></i> Chiudi
                    </button>
                </div>
            </div>
        </div>
        
        <footer class="footer">
            <p>Ruota delle Penitenze &copy; <?php echo date('Y'); ?> - Cruciverba letterario</p>
            <p><small>Se vuoi consigli devi pagare</small></p>
        </footer>
    </div>
    
    <!-- Scripts -->
    <script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
    <script src="assets/js/wheel.js"></script>
    <!--<script src="assets/js/crossword-game.js"></script>-->
</body>
</html>