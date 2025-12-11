// assets/js/crossword.js
class CrosswordGenerator {
    constructor(width = 25, height = 25) {
        this.width = width;
        this.height = height;
        this.grid = [];
        this.words = [];
        this.placedWords = [];
        this.directions = [
            { x: 1, y: 0, name: 'horizontal' },
            { x: 0, y: 1, name: 'vertical' }
        ];
        this.initializeGrid();
    }

    initializeGrid() {
        this.grid = Array(this.height).fill().map(() => 
            Array(this.width).fill({ 
                letter: '', 
                wordId: null, 
                isStart: false,
                isBlack: true 
            })
        );
    }

    async loadDefinitions(difficulty = 'facile', limit = 40) {
        try {
            const response = await fetch(`api/get_definitions.php?limit=${limit}`);
            const data = await response.json();
            
            if (data.success) {
                this.words = data.data.map((def, index) => ({
                    id: index,
                    word: def.soluzione.toUpperCase().replace(/\s/g, ''),
                    definition: def.definizione,
                    difficulty: def.difficolta,
                    book: def.libro,
                    length: def.soluzione.length,
                    placed: false,
                    direction: null,
                    x: null,
                    y: null
                }));
                
                // Ordina per lunghezza (decrescente)
                this.words.sort((a, b) => b.length - a.length);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Errore nel caricamento definizioni:', error);
            return false;
        }
    }

    calculateWordScore(word) {
        const commonLetters = ['A', 'E', 'I', 'O', 'R', 'S', 'T', 'L', 'N', 'C'];
        const rareLetters = ['Q', 'X', 'Y', 'Z', 'J', 'K', 'W'];
        
        let score = 0;
        for (let letter of word) {
            if (commonLetters.includes(letter)) score += 2;
            else if (rareLetters.includes(letter)) score -= 1;
            else score += 1;
        }
        
        const vowels = (word.match(/[AEIOU]/g) || []).length;
        score += vowels * 0.5;
        
        return score;
    }

    countIntersections(word, x, y, direction) {
        const dx = direction === 'horizontal' ? 1 : 0;
        const dy = direction === 'vertical' ? 1 : 0;
        let intersections = 0;
        
        for (let i = 0; i < word.length; i++) {
            const posX = x + (dx * i);
            const posY = y + (dy * i);
            
            if (posY >= 0 && posY < this.height && posX >= 0 && posX < this.width) {
                if (this.grid[posY][posX].letter !== '') {
                    intersections++;
                }
            }
        }
        
        return intersections;
    }

    generate() {
        if (this.words.length === 0) {
            console.error('Nessuna parola caricata');
            return false;
        }

        console.log(`Inizio generazione per ${this.words.length} parole su griglia ${this.width}x${this.height}`);
        
        // Filtra parole troppo lunghe per la griglia
        const maxWordLength = Math.min(this.width, this.height);
        const validWords = this.words.filter(word => word.length <= maxWordLength);
        
        if (validWords.length === 0) {
            console.error('Nessuna parola adatta per la griglia');
            return false;
        }
        
        console.log(`${validWords.length} parole adatte per la griglia`);
        
        // Piazza la prima parola (più lunga) al centro
        const firstWord = validWords[0];
        const startX = Math.floor((this.width - firstWord.length) / 2);
        const startY = Math.floor(this.height / 2);
        
        console.log(`Prima parola: "${firstWord.word}" (${firstWord.length} lettere) in [${startX},${startY}]`);
        
        if (!this.placeWord(firstWord, startX, startY, 'horizontal')) {
            console.error('Impossibile piazzare la prima parola');
            return false;
        }
        
        firstWord.placed = true;
        this.placedWords.push(firstWord);

        // Ordina le parole rimanenti per facilità di piazzamento
        const remainingWords = validWords.slice(1);
        
        remainingWords.sort((a, b) => {
            if (b.length !== a.length) return b.length - a.length;
            const aScore = this.calculateWordScore(a.word);
            const bScore = this.calculateWordScore(b.word);
            return bScore - aScore;
        });

        console.log(`Tentativo piazzamento per ${remainingWords.length} parole rimanenti`);
        
        // Prova a piazzare le altre parole
        let placedCount = 0;
        for (let i = 0; i < remainingWords.length; i++) {
            const word = remainingWords[i];
            
            if (this.tryPlaceWord(word)) {
                placedCount++;
                
                if (placedCount % 10 === 0) {
                    console.log(`Piazzate ${placedCount}/${remainingWords.length} parole`);
                }
            }
            
            if (this.placedWords.length >= 40) {
                console.log(`Raggiunte 40 parole piazzate, interruzione anticipata`);
                break;
            }
        }

        // Aggiorna le celle nere
        this.updateBlackCells();
        
        // Aggiorna le statistiche
        this.updateStats();
        
        console.log(`Generazione completata: ${this.placedWords.length}/${validWords.length} parole piazzate`);
        
        return this.grid;
    }

    placeWord(word, x, y, direction) {
        // Controlla che le coordinate siano valide
        if (x < 0 || y < 0) {
            console.warn(`Coordinate negative per "${word.word}": [${x},${y}]`);
            return false;
        }
        
        if (direction === 'horizontal' && x + word.length > this.width) {
            console.warn(`Fuori dai bordi orizzontali per "${word.word}": x=${x}, lunghezza=${word.length}`);
            return false;
        }
        
        if (direction === 'vertical' && y + word.length > this.height) {
            console.warn(`Fuori dai bordi verticali per "${word.word}": y=${y}, lunghezza=${word.length}`);
            return false;
        }
        
        // Controlla se può essere piazzata
        if (!this.canPlaceWord(word.word, x, y, direction)) {
            return false;
        }
        
        word.x = x;
        word.y = y;
        word.direction = direction;
        
        const dx = direction === 'horizontal' ? 1 : 0;
        const dy = direction === 'vertical' ? 1 : 0;

        for (let i = 0; i < word.word.length; i++) {
            const posX = x + (dx * i);
            const posY = y + (dy * i);
            
            // Controlla di nuovo i bordi per sicurezza
            if (posY >= this.height || posX >= this.width) {
                console.error(`Errore: tentativo di accesso a cella fuori limiti [${posX},${posY}]`);
                return false;
            }
            
            const currentCell = this.grid[posY][posX];
            const isStart = i === 0;
            
            this.grid[posY][posX] = {
                letter: word.word[i],
                wordId: word.id,
                isStart: isStart || currentCell.isStart,
                isBlack: false
            };
        }
        
        return true;
    }

    tryPlaceWord(word) {
        const letters = word.word.split('');
        let bestPosition = null;
        let maxIntersections = -1;
        
        // Cerca tra tutte le parole già piazzate
        for (const placedWord of this.placedWords) {
            // Cerca lettere in comune tra le due parole
            for (let i = 0; i < placedWord.word.length; i++) {
                const placedLetter = placedWord.word[i];
                
                for (let j = 0; j < letters.length; j++) {
                    if (placedLetter === letters[j]) {
                        // Prova a posizionare la parola nuova
                        const positions = [];
                        
                        // Se la parola piazzata è orizzontale, prova verticale
                        if (placedWord.direction === 'horizontal') {
                            positions.push({
                                x: placedWord.x + i,
                                y: placedWord.y - j,
                                direction: 'vertical'
                            });
                        }
                        
                        // Se la parola piazzata è verticale, prova orizzontale
                        if (placedWord.direction === 'vertical') {
                            positions.push({
                                x: placedWord.x - j,
                                y: placedWord.y + i,
                                direction: 'horizontal'
                            });
                        }
                        
                        // Valuta tutte le posizioni trovate
                        for (const pos of positions) {
                            if (this.canPlaceWord(word.word, pos.x, pos.y, pos.direction)) {
                                // Conta quanti incroci avrebbe questa posizione
                                const intersections = this.countIntersections(word.word, pos.x, pos.y, pos.direction);
                                
                                // Preferisci posizioni con più incroci
                                if (intersections > maxIntersections) {
                                    maxIntersections = intersections;
                                    bestPosition = pos;
                                }
                            }
                        }
                    }
                }
            }
        }
        
        // Se hai trovato una buona posizione, piazza la parola
        if (bestPosition && maxIntersections >= 0) {
            if (this.placeWord(word, bestPosition.x, bestPosition.y, bestPosition.direction)) {
                word.placed = true;
                this.placedWords.push(word);
                console.log(`Piazzata: "${word.word}" in [${bestPosition.x},${bestPosition.y}] con ${maxIntersections} incroci`);
                return true;
            }
        }
        
        console.log(`Non piazzata: "${word.word}"`);
        return false;
    }

    canPlaceWord(word, x, y, direction) {
        const dx = direction === 'horizontal' ? 1 : 0;
        const dy = direction === 'vertical' ? 1 : 0;

        // Controlla i bordi
        if (x < 0 || y < 0) return false;
        if (direction === 'horizontal' && x + word.length > this.width) return false;
        if (direction === 'vertical' && y + word.length > this.height) return false;

        // Controlla ogni cella
        for (let i = 0; i < word.length; i++) {
            const posX = x + (dx * i);
            const posY = y + (dy * i);
            
            // Controlla che la posizione sia valida
            if (posY >= this.height || posX >= this.width) {
                return false;
            }
            
            const cell = this.grid[posY][posX];

            // Se la cella non è vuota e la lettera non corrisponde
            if (cell.letter !== '' && cell.letter !== word[i]) {
                return false;
            }

            // Controlla celle adiacenti (solo per nuove lettere)
            if (cell.letter === '') {
                if (!this.checkAdjacentCells(posX, posY, direction, i, word)) {
                    return false;
                }
            }
        }

        // Dopo le prime 3 parole, verifica che ci sia almeno un'intersezione
        if (this.placedWords.length > 3) {
            let hasIntersection = false;
            for (let i = 0; i < word.length; i++) {
                const posX = x + (dx * i);
                const posY = y + (dy * i);
                if (this.grid[posY][posX].letter !== '') {
                    hasIntersection = true;
                    break;
                }
            }
            if (!hasIntersection) return false;
        }

        return true;
    }

    checkAdjacentCells(x, y, direction, index, word) {
        // Controlla sopra/sotto per orizzontale, sinistra/destra per verticale
        const adjacentChecks = direction === 'horizontal' 
            ? [{dx: 0, dy: -1}, {dx: 0, dy: 1}] 
            : [{dx: -1, dy: 0}, {dx: 1, dy: 0}];

        for (const check of adjacentChecks) {
            const adjX = x + check.dx;
            const adjY = y + check.dy;
            
            if (adjX >= 0 && adjX < this.width && adjY >= 0 && adjY < this.height) {
                if (this.grid[adjY][adjX].letter !== '') {
                    return false; // C'è una lettera adiacente che non dovrebbe esserci
                }
            }
        }

        // Controlla le estremità
        if (index === 0) {
            const startCheck = direction === 'horizontal' 
                ? {dx: -1, dy: 0} 
                : {dx: 0, dy: -1};
                
            const startX = x + startCheck.dx;
            const startY = y + startCheck.dy;
            
            if (startX >= 0 && startX < this.width && startY >= 0 && startY < this.height) {
                if (this.grid[startY][startX].letter !== '') {
                    return false;
                }
            }
        }

        if (index === word.length - 1) {
            const endCheck = direction === 'horizontal' 
                ? {dx: 1, dy: 0} 
                : {dx: 0, dy: 1};
                
            const endX = x + endCheck.dx;
            const endY = y + endCheck.dy;
            
            if (endX >= 0 && endX < this.width && endY >= 0 && endY < this.height) {
                if (this.grid[endY][endX].letter !== '') {
                    return false;
                }
            }
        }

        return true;
    }

    updateBlackCells() {
        // Aggiorna le celle nere
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                if (this.grid[y][x].letter === '') {
                    this.grid[y][x].isBlack = true;
                } else {
                    this.grid[y][x].isBlack = false;
                }
            }
        }
    }

    // Nella classe CrosswordGenerator, modifica il metodo renderHTML:
    renderHTML() {
        let html = '<table class="crossword-grid" cellspacing="0" cellpadding="0">';
        
        for (let y = 0; y < this.height; y++) {
            html += '<tr>';
            for (let x = 0; x < this.width; x++) {
                const cell = this.grid[y][x];
                const cellClass = cell.isBlack ? 'empty' : 'filled';
                const number = cell.isStart ? this.getWordNumber(cell.wordId) : '';
                
                // Ottieni la difficoltà della parola
                const word = this.words.find(w => w.id === cell.wordId);
                const difficultyClass = word && word.difficulty ? `cell-difficulty-${word.difficulty}` : '';
                const numberClass = word && word.difficulty ? word.difficulty : '';
                
                html += `<td class="${cellClass} ${difficultyClass}" data-x="${x}" data-y="${y}">`;
                
                if (number) {
                    html += `<span class="cell-number ${numberClass}">${number}</span>`;
                    
                    // Aggiungi tooltip con difficoltà
                    if (word && word.difficulty) {
                        const difficultyLabels = {
                            'facile': 'Facile',
                            'medio': 'Medio', 
                            'difficile': 'Difficile'
                        };
                        html += `<div class="cell-difficulty-tooltip">${difficultyLabels[word.difficulty] || word.difficulty}</div>`;
                    }
                }
                
                if (!cell.isBlack) {
                    const inputClass = word && word.difficulty ? word.difficulty : '';
                    html += `<input type="text" maxlength="1" class="cell-input ${inputClass}" data-x="${x}" data-y="${y}">`;
                }
                
                html += '</td>';
            }
            html += '</tr>';
        }
        
        html += '</table>';
        return html;
    }

    // Modifica il metodo renderClues per includere la difficoltà:
    // Modifica il metodo renderClues per layout verticale
    renderClues() {
        // Legenda difficoltà
        const legendHtml = `
            <div class="difficulty-legend">
                <div class="legend-item">
                    <div class="legend-color facile"></div>
                    <span>Facile</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color medio"></div>
                    <span>Medio</span>
                </div>
                <div class="legend-item">
                    <div class="legend-color difficile"></div>
                    <span>Difficile</span>
                </div>
            </div>
        `;
        
        // Sezione orizzontali
        let horizontalWords = this.placedWords.filter(w => w.direction === 'horizontal');
        let horizontalHtml = '';
        
        if (horizontalWords.length > 0) {
            horizontalHtml = `
                <div class="clue-section">
                    <h3><i class="fas fa-arrow-right"></i> Orizzontali (${horizontalWords.length})</h3>
                    <ol>
                        ${horizontalWords.map((word, index) => `
                            <li class="definition-item ${word.difficulty || ''}">
                                <strong>${index + 1}.</strong> 
                                ${word.definition} 
                                <small>(${word.book})</small>
                                <span class="difficulty-badge ${word.difficulty || ''}">${word.difficulty || 'N/A'}</span>
                            </li>
                        `).join('')}
                    </ol>
                </div>
            `;
        }
        
        // Sezione verticali
        let verticalWords = this.placedWords.filter(w => w.direction === 'vertical');
        let verticalHtml = '';
        
        if (verticalWords.length > 0) {
            verticalHtml = `
                <div class="clue-section">
                    <h3><i class="fas fa-arrow-down"></i> Verticali (${verticalWords.length})</h3>
                    <ol>
                        ${verticalWords.map((word, index) => `
                            <li class="definition-item ${word.difficulty || ''}">
                                <strong>${index + 1}.</strong> 
                                ${word.definition} 
                                <small>(${word.book})</small>
                                <span class="difficulty-badge ${word.difficulty || ''}">${word.difficulty || 'N/A'}</span>
                            </li>
                        `).join('')}
                    </ol>
                </div>
            `;
        }
        
        // Combina tutto: prima legenda, poi orizzontali, poi verticali
        return legendHtml + horizontalHtml + verticalHtml;
    }

    getWordNumber(wordId) {
        const word = this.words.find(w => w.id === wordId);
        if (word && word.placed) {
            const index = this.placedWords.findIndex(w => w.id === wordId);
            return index + 1;
        }
        return '';
    }
/*
    renderClues() {
        let horizontalHtml = '<div class="clue-section"><h3>Orizzontali</h3><ol>';
        let verticalHtml = '<div class="clue-section"><h3>Verticali</h3><ol>';
        
        this.placedWords.forEach((word, index) => {
            const clueItem = `<li><strong>${index + 1}.</strong> ${word.definition} <small>(${word.book})</small></li>`;
            
            if (word.direction === 'horizontal') {
                horizontalHtml += clueItem;
            } else {
                verticalHtml += clueItem;
            }
        });
        
        horizontalHtml += '</ol></div>';
        verticalHtml += '</ol></div>';
        
        return horizontalHtml + verticalHtml;
    }
*/
    updateStats() {
        const statsElement = document.getElementById('stats');
        if (statsElement) {
            const placedCount = document.getElementById('placed-count');
            const dimensions = document.getElementById('dimensions');
            
            if (placedCount) {
                placedCount.textContent = this.placedWords.length;
            }
            if (dimensions) {
                dimensions.textContent = `${this.width}x${this.height}`;
            }
        }
    }
}

// Funzione principale per inizializzare il cruciverba
async function initializeCrossword(difficulty = 'facile') {
    const crossword = new CrosswordGenerator(25, 25);
    
    // Carica definizioni dal database
    const loaded = await crossword.loadDefinitions(difficulty);
    
    if (!loaded) {
        alert('Errore nel caricamento delle definizioni');
        return;
    }
    
    // Genera il cruciverba
    crossword.generate();
    
    // Renderizza la griglia
    document.getElementById('crossword-grid').innerHTML = crossword.renderHTML();
    
    // Renderizza le definizioni
    document.getElementById('crossword-clues').innerHTML = crossword.renderClues();
    
    // Aggiungi gestione input
    setupInputHandlers(crossword);
    
    return crossword;
}

function setupInputHandlers(crossword) {
    document.querySelectorAll('.cell-input').forEach(input => {
        input.addEventListener('input', function(e) {
            const x = parseInt(this.dataset.x);
            const y = parseInt(this.dataset.y);
            const cell = crossword.grid[y][x];
            
            if (cell && cell.letter) {
                if (this.value.toUpperCase() === cell.letter) {
                    this.classList.add('correct');
                    this.classList.remove('incorrect');
                    this.readOnly = true;
                    checkCompletion(crossword);
                } else {
                    this.classList.add('incorrect');
                    this.classList.remove('correct');
                }
            }
        });
        
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Backspace' || e.key === 'Delete') {
                this.value = '';
                this.classList.remove('correct', 'incorrect');
            }
        });
    });
}

function checkCompletion(crossword) {
    const inputs = document.querySelectorAll('.cell-input');
    const correctInputs = document.querySelectorAll('.cell-input.correct');
    
    if (inputs.length === correctInputs.length) {
        // Usa il modal esistente nel tuo index.php
        showResultInModal('Complimenti! Hai completato il cruciverba!', 'success');
    }
}

function showResultInModal(message, type = 'success') {
    const resultContent = document.getElementById('resultContent');
    const resultModal = document.getElementById('resultModal');
    
    if (resultContent && resultModal) {
        const icon = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle';
        const color = type === 'success' ? '#4CAF50' : '#f44336';
        
        resultContent.innerHTML = `
            <div style="text-align: center; padding: 20px;">
                <i class="fas ${icon}" style="font-size: 4rem; color: ${color}; margin-bottom: 20px;"></i>
                <h3 style="color: ${color}; margin-bottom: 15px;">${message}</h3>
                <p>Hai completato il cruciverba con successo!</p>
            </div>
        `;
        
        // Mostra il modal
        resultModal.style.display = 'block';
        
        // Aggiungi gestione per chiudere il modal
        const closeModal = document.querySelector('.close-modal');
        if (closeModal) {
            closeModal.onclick = function() {
                resultModal.style.display = 'none';
            }
        }
        
        // Chiudi cliccando fuori
        window.onclick = function(event) {
            if (event.target == resultModal) {
                resultModal.style.display = 'none';
            }
        }
    } else {
        // Fallback se il modal non esiste
        alert(message);
    }
}

// Event listeners per i controlli
$(document).ready(function() {
    //const difficultySelect = document.getElementById('difficulty-select');
    const checkSolutionBtn = document.getElementById('check-solution');
    const revealSolutionBtn = document.getElementById('reveal-solution');
    const generateBtn = document.getElementById('generate-crossword');
    
    let currentCrossword = null;
    
    if (generateBtn) {
        generateBtn.addEventListener('click', async function() {
            //const difficulty = difficultySelect.value;
            currentCrossword = await initializeCrossword('difficile');
        });
    }
    
    if (checkSolutionBtn) {
        checkSolutionBtn.addEventListener('click', function() {
            if (!currentCrossword) {
                showResultInModal('Genera prima un cruciverba!', 'warning');
                return;
            }
            
            let allCorrect = true;
            document.querySelectorAll('.cell-input').forEach(input => {
                const x = parseInt(input.dataset.x);
                const y = parseInt(input.dataset.y);
                const cell = currentCrossword.grid[y][x];
                
                if (input.value.toUpperCase() !== cell.letter) {
                    input.classList.add('incorrect');
                    allCorrect = false;
                }
            });
            
            if (allCorrect) {
                showResultInModal('Complimenti! Tutte le risposte sono corrette!', 'success');
            } else {
                showResultInModal('Alcune risposte sono sbagliate. Correggi le celle evidenziate in rosso.', 'warning');
            }
        });
    }
    
    if (revealSolutionBtn) {
        revealSolutionBtn.addEventListener('click', function() {
            if (!currentCrossword) {
                showResultInModal('Genera prima un cruciverba!', 'warning');
                return;
            }
            
            document.querySelectorAll('.cell-input').forEach(input => {
                const x = parseInt(input.dataset.x);
                const y = parseInt(input.dataset.y);
                const cell = currentCrossword.grid[y][x];
                
                input.value = cell.letter;
                input.classList.add('correct');
                input.readOnly = true;
            });
            
            showResultInModal('Soluzione rivelata!', 'info');
        });
    }
    
    // Genera un cruciverba all'avvio
    
    //if (difficultySelect) {
        initializeCrossword('facile').then(crossword => {
            console.log('dentro')
            currentCrossword = crossword;
        });
    //}
    
    // Gestione del modal esistente
    const closeModal = document.querySelector('.close-modal');
    if (closeModal) {
        closeModal.addEventListener('click', function() {
            document.getElementById('resultModal').style.display = 'none';
        });
    }
    
    const playAgainButton = document.getElementById('playAgainButton');
    if (playAgainButton) {
        playAgainButton.addEventListener('click', function() {
            location.reload();
        });
    }
    
    const shareButton = document.getElementById('shareButton');
    if (shareButton) {
        shareButton.addEventListener('click', function() {
            if (navigator.share) {
                navigator.share({
                    title: 'Cruciverba Completato',
                    text: 'Ho completato un cruciverba sulla Ruota dei Libri!',
                    url: window.location.href
                });
            } else {
                alert('Condivisione non supportata su questo dispositivo.');
            }
        });
    }
});

// Stili aggiuntivi per migliorare l'integrazione
const crosswordStyles = `
    /* Loading state */
    #crossword-grid.loading,
    #crossword-clues.loading {
        min-height: 300px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f8f9fa;
        border-radius: 10px;
    }
    
    /* Error state */
    .crossword-error {
        padding: 40px;
        text-align: center;
        color: #dc3545;
        background: #f8d7da;
        border-radius: 10px;
        margin: 20px 0;
    }
    
    /* Miglioramenti responsive */
    @media (max-width: 1200px) {
        .crossword-container {
            flex-direction: column;
        }
        
        .clues-container {
            max-width: 100%;
        }
    }
    
    @media (max-width: 768px) {
        .crossword-grid td {
            width: 30px;
            height: 30px;
        }
        
        .cell-input {
            font-size: 16px;
        }
        
        .controls {
            flex-wrap: wrap;
        }
        
        .controls select,
        .controls button {
            margin-bottom: 10px;
            width: 100%;
        }
    }
    
    /* Animazioni */
    .cell-input.correct {
        animation: correctPulse 0.5s ease;
    }
    
    @keyframes correctPulse {
        0% { transform: scale(1); }
        50% { transform: scale(1.05); }
        100% { transform: scale(1); }
    }
    
    .cell-input.incorrect {
        animation: incorrectShake 0.5s ease;
    }
    
    @keyframes incorrectShake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;

// Aggiungi gli stili al documento
document.addEventListener('DOMContentLoaded', function() {
    const styleEl = document.createElement('style');
    styleEl.textContent = crosswordStyles;
    document.head.appendChild(styleEl);
});
// Aggiungi questa funzione per evidenziare le definizioni al passaggio del mouse sulla griglia
function setupWordHighlighting(crossword) {
    // Trova tutte le celle con parole
    document.querySelectorAll('.crossword-grid td.filled').forEach(cell => {
        const x = parseInt(cell.dataset.x);
        const y = parseInt(cell.dataset.y);
        const cellData = crossword.grid[y][x];
        
        if (cellData.wordId !== null) {
            // Aggiungi event listener per hover
            cell.addEventListener('mouseenter', function() {
                highlightClue(cellData.wordId, crossword);
            });
            
            cell.addEventListener('mouseleave', function() {
                removeHighlight();
            });
            
            cell.addEventListener('click', function() {
                // Quando clicchi su una cella, evidenzia anche nella definizione
                highlightClue(cellData.wordId, crossword);
                setTimeout(removeHighlight, 2000);
            });
        }
    });
}

function highlightClue(wordId, crossword) {
    // Rimuovi evidenziazione precedente
    removeHighlight();
    
    // Trova l'indice della parola
    const wordIndex = crossword.placedWords.findIndex(w => w.id === wordId);
    if (wordIndex !== -1) {
        // Evidenzia nella definizione
        const clueItem = document.querySelector(`#crossword-clues li:nth-child(${wordIndex + 1})`);
        if (clueItem) {
            clueItem.classList.add('highlighted');
            clueItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }
}

function removeHighlight() {
    document.querySelectorAll('#crossword-clues li.highlighted').forEach(item => {
        item.classList.remove('highlighted');
    });
}

// Modifica initializeCrossword per includere l'highlighting
async function initializeCrossword(difficulty = 'facile') {
    const crossword = new CrosswordGenerator(25, 25);
    
    // Carica definizioni dal database
    const loaded = await crossword.loadDefinitions(difficulty);
    
    if (!loaded) {
        alert('Errore nel caricamento delle definizioni');
        return;
    }
    
    // Genera il cruciverba
    crossword.generate();
    
    // Renderizza la griglia
    document.getElementById('crossword-grid').innerHTML = crossword.renderHTML();
    
    // Renderizza le definizioni
    document.getElementById('crossword-clues').innerHTML = crossword.renderClues();
    
    // Aggiungi gestione input
    setupInputHandlers(crossword);
    
    // Aggiungi evidenziazione interattiva
    setupWordHighlighting(crossword);
    
    return crossword;
}