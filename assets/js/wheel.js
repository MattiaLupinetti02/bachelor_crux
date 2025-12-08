// assets/js/wheel.js
$(document).ready(function() {
    // Variabili globali
    let canvas, ctx;
    let items = [];
    let spinning = false;
    let currentRotation = 0;
    let selectedItem = null;
    let currentWheelType = 'book'; // 'book' o 'penance'
    const currentPage = window.location.pathname.includes('penance.php') ? 'penance' : 'book';
    
    // Inizializzazione
    function init() {
        canvas = document.getElementById('wheelCanvas');
        ctx = canvas.getContext('2d');
        
        // Imposta il tipo in base alla pagina
        currentWheelType = currentPage;
        
        // Carica gli item dal database
        loadItems(currentWheelType);
        
        // Imposta event listeners
        $('#spinButton').click(spinWheel);
        $('#resetButton').click(resetWheel);
        $('#playAgainButton').click(playAgain);
        $('.close-modal').click(closeModal);
        $('#shareButton').click(shareResult);
        
        // Setup switcher buttons
        if (currentWheelType === 'book') {
            $('#switchToPenance').click(function() {
                window.location.href = 'penance.php';
            });
            $('#switchToBooks').hide();
        } else {
            $('#switchToBooks').click(function() {
                window.location.href = 'index.php';
            });
            $('#switchToPenance').hide();
        }
        
        // Chiudi modal cliccando fuori
        $(window).click(function(event) {
            if ($(event.target).hasClass('modal')) {
                closeModal();
            }
        });
        
        // Chiudi con ESC
        $(document).keyup(function(e) {
            if (e.key === "Escape") {
                closeModal();
            }
        });
    }
    
    // Carica gli item dal database
    function loadItems(type = 'book') {
        currentWheelType = type;
        $.ajax({
            url: 'api/get_items.php',
            type: 'GET',
            data: { type: type },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    items = response.items;
                    drawWheel();
                    updateUIForType(type);
                    populateItemsGrid(items, type);
                } else {
                    showError('Errore nel caricamento degli item');
                }
            },
            error: function() {
                showError('Errore di connessione al server');
            }
        });
    }
    
    // Disegna la ruota
    function drawWheel() {
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;
        
        // Sfondo della ruota
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        if (items.length === 0) {
            // Messaggio se nessun item
            ctx.font = 'bold 24px Poppins';
            ctx.fillStyle = '#666';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('Nessun item disponibile', centerX, centerY);
            return;
        }
        
        // Disegna ogni settore
        let startAngle = currentRotation;
        const arcPerItem = (2 * Math.PI) / items.length;
        
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            const endAngle = startAngle + arcPerItem;
            
            // Disegna il settore
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.arc(centerX, centerY, radius, startAngle, endAngle);
            ctx.closePath();
            
            // Colore del settore
            ctx.fillStyle = item.color || getColorForIndex(i);
            ctx.fill();
            
            // Bordo del settore
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 3;
            ctx.stroke();
            
            // Testo del settore (troncato se troppo lungo)
            ctx.save();
            ctx.translate(centerX, centerY);
            ctx.rotate(startAngle + arcPerItem / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = 'white';
            ctx.font = 'bold 14px Poppins';
            
            // Tronca il testo se troppo lungo
            let text = item.title;
            const maxTextLength = 20;
            if (text.length > maxTextLength) {
                text = text.substring(0, maxTextLength - 3) + '...';
            }
            
            ctx.fillText(text, radius - 25, 5);
            ctx.restore();
            
            startAngle = endAngle;
        }
        
        // Disegna il centro della ruota
        ctx.beginPath();
        ctx.arc(centerX, centerY, 50, 0, 2 * Math.PI);
        ctx.fillStyle = 'white';
        ctx.fill();
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 5;
        ctx.stroke();
    }
    
    // Popola la griglia degli item
    function populateItemsGrid(items, type) {
        const grid = $('#prizesGrid');
        grid.empty();
        
        if (items.length === 0) {
            grid.html('<p class="no-items">Nessun ' + (type === 'book' ? 'libro' : 'penitenza') + ' disponibile</p>');
            return;
        }
        
        items.forEach(item => {
            const isBook = type === 'book';
            const tagClass = isBook ? 'book-tag' : 'penance-tag';
            const tagText = isBook ? 'Libro' : 'Penitenza';
            const cardClass = isBook ? 'book' : 'penance';
            
            const card = $(`
                <div class="prize-card ${cardClass}">
                    <span class="${tagClass}">${tagText}</span>
                    <h3>${item.title}</h3>
                    <p>${isBook ? item.content.substring(0, 80) + '...' : item.content}</p>
                    ${isBook ? `<small><strong>Libro:</strong> ${item.book_title}</small>` : ''}
                </div>
            `);
            
            grid.append(card);
        });
    }
    
    // Aggiorna UI in base al tipo
    function updateUIForType(type) {
        if (type === 'book') {
            $('h1 i').removeClass('fa-theater-masks').addClass('fa-book');
            $('h1').html('<i class="fas fa-book"></i> RUOTA DEI LIBRI');
            $('.subtitle').text('Clicca sulla ruota per estrarre una domanda su uno dei libri!');
            $('#prizesPanel h2 i').removeClass('fa-theater-masks').addClass('fa-book');
            $('#prizesPanel h2').html('<i class="fas fa-book"></i> Libri Disponibili');
        } else {
            $('h1 i').removeClass('fa-book').addClass('fa-theater-masks');
            $('h1').html('<i class="fas fa-theater-masks"></i> RUOTA DELLE PENITENZE');
            $('.subtitle').text('Clicca sulla ruota per estrarre una penitenza divertente!');
            $('#prizesPanel h2 i').removeClass('fa-book').addClass('fa-theater-masks');
            $('#prizesPanel h2').html('<i class="fas fa-theater-masks"></i> Penitenze Disponibili');
        }
    }
    
    // Fa girare la ruota
    function spinWheel() {
        if (spinning || items.length === 0) return;
        
        spinning = true;
        
        // Disabilita il pulsante
        $('#spinButton').css('opacity', '0.7').css('cursor', 'not-allowed');
        
        // Animazione del pulsante
        $('#spinButton').css('transform', 'scale(0.95)');
        
        // Calcola un angolo casuale per la rotazione
        const spins = 5 + Math.random() * 3; // 5-8 giri
        const randomAngle = Math.random() * 2 * Math.PI;
        const totalRotation = spins * 2 * Math.PI + randomAngle;
        
        // Animazione
        const duration = 4000; // 4 secondi
        const startTime = Date.now();
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Funzione di easing per effetto realistico
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            currentRotation = easeOut * totalRotation;
            drawWheel();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                // La ruota si è fermata, determina l'item
                finishSpin(totalRotation % (2 * Math.PI));
            }
        }
        
        animate();
    }
    
    // Determina l'item selezionato
    function finishSpin(finalAngle) {
        // Normalizza l'angolo
        let normalizedAngle = (2 * Math.PI - (finalAngle % (2 * Math.PI))) % (2 * Math.PI);
        
        // Trova l'item in base all'angolo
        const arcPerItem = (2 * Math.PI) / items.length;
        const itemIndex = Math.floor(normalizedAngle / arcPerItem);
        
        // Assicurati che l'indice sia valido
        const safeIndex = Math.min(itemIndex, items.length - 1);
        selectedItem = items[safeIndex];
        
        // Salva il risultato nel database
        saveSpinResult(selectedItem.id, currentWheelType);
        
        // Mostra il risultato dopo una breve pausa
        setTimeout(() => {
            showResult(selectedItem);
            spinning = false;
            $('#spinButton').css({
                'opacity': '1',
                'cursor': 'pointer',
                'transform': 'scale(1)'
            });
        }, 800);
    }
    
    // Salva il risultato nel database
    function saveSpinResult(itemId, type) {
        $.ajax({
            url: 'spin.php',
            type: 'POST',
            data: {
                item_id: itemId,
                type: type
            },
            success: function(response) {
                console.log('Risultato salvato:', response);
            },
            error: function() {
                console.log('Errore nel salvataggio del risultato');
            }
        });
    }
    
    // Mostra il risultato nel modal
    function showResult(item) {
        const isBook = currentWheelType === 'book';
        const title = isBook ? `Domanda su: ${item.book_title}` : 'Penitenza!';
        const icon = isBook ? 'fa-book' : 'fa-theater-masks';
        
        const content = $(`
            <div class="result-content">
                <div class="result-header">
                    <i class="fas ${icon}"></i>
                    <h3>${title}</h3>
                    <button class="close-banner">&times;</button>
                </div>
                <div class="result-body">
                    ${isBook ? `
                        <div class="book-info">
                            <h4>${item.book_title}</h4>
                            <p class="question">${item.content}</p>
                            <p class="item-note"><small><i class="fas fa-info-circle"></i> Domanda estratta dalla ruota</small></p>
                        </div>
                    ` : `
                        <div class="penance-info">
                            <h4>${item.title}</h4>
                            <p class="penance-text">${item.content}</p>
                            <div class="penance-actions">
                                <button class="btn-complete"><i class="fas fa-check"></i> Completata</button>
                                <button class="btn-skip"><i class="fas fa-forward"></i> Salta</button>
                            </div>
                        </div>
                    `}
                </div>
            </div>
        `);
        
        // Chiudi banner con la X
        content.find('.close-banner').click(function() {
            $('#resultModal').fadeOut();
        });
        
        // Azioni per le penitenze
        if (!isBook) {
            content.find('.btn-complete').click(function() {
                alert('🎉 Penitenza completata! Bravo!');
                $('#resultModal').fadeOut();
            });
            
            content.find('.btn-skip').click(function() {
                if (confirm('Sei sicuro di voler saltare questa penitenza?\nPotrai riprovare in seguito.')) {
                    $('#resultModal').fadeOut();
                }
            });
        }
        
        $('#resultContent').html(content);
        $('#resultModal').fadeIn();
    }
    
    // Chiude il modal
    function closeModal() {
        $('#resultModal').fadeOut();
    }
    
    // Gioca ancora (resetta e chiudi modal)
    function playAgain() {
        closeModal();
        // Opzionale: resetta la ruota
        // currentRotation = 0;
        // drawWheel();
    }
    
    // Condivide il risultato
    function shareResult() {
        if (!selectedItem) return;
        
        const isBook = currentWheelType === 'book';
        const text = isBook 
            ? `Ho estratto una domanda su "${selectedItem.book_title}": ${selectedItem.content.substring(0, 100)}...` 
            : `Ho estratto una penitenza: "${selectedItem.content}"`;
        
        if (navigator.share) {
            navigator.share({
                title: isBook ? 'Ruota dei Libri' : 'Ruota delle Penitenze',
                text: text,
                url: window.location.href
            });
        } else {
            // Fallback per browser che non supportano Web Share API
            navigator.clipboard.writeText(text).then(() => {
                alert('Testo copiato negli appunti! Puoi incollarlo per condividerlo.');
            }).catch(() => {
                prompt('Condividi questo testo:', text);
            });
        }
    }
    
    // Resetta la ruota
    function resetWheel() {
        currentRotation = 0;
        selectedItem = null;
        drawWheel();
        closeModal();
    }
    
    // Mostra errore
    function showError(message) {
        alert('Errore: ' + message);
    }
    
    // Genera un colore in base all'indice
    function getColorForIndex(index) {
        const colors = [
            '#FF6B6B', '#4ECDC4', '#FFD166', '#06D6A0',
            '#118AB2', '#EF476F', '#7209B7', '#3A86FF',
            '#9B59B6', '#E74C3C', '#1ABC9C', '#F39C12',
            '#3498DB', '#E67E22', '#2ECC71', '#95A5A6'
        ];
        return colors[index % colors.length];
    }
    
    // Inizializza l'applicazione
    init();
});