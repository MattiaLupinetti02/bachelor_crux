class CrosswordGenerator {
    constructor(width = 15, height = 15) {
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
            Array(this.width).fill({ letter: '', wordId: null, isStart: false })
        );
    }

    async loadDefinitions(difficulty = 'facile', limit = 15) {
        try {
            const response = await fetch(`api/get_definitions.php?difficolta=${difficulty}&limit=${limit}`);
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

    generate() {
        if (this.words.length === 0) {
            console.error('Nessuna parola caricata');
            return false;
        }

        // Piazza la prima parola al centro
        const firstWord = this.words[0];
        const startX = Math.floor((this.width - firstWord.length) / 2);
        const startY = Math.floor(this.height / 2);
        
        this.placeWord(firstWord, startX, startY, 'horizontal');
        firstWord.placed = true;
        this.placedWords.push(firstWord);

        // Prova a piazzare le altre parole
        for (let i = 1; i < this.words.length; i++) {
            this.tryPlaceWord(this.words[i]);
        }

        // Aggiorna le statistiche
        this.updateStats();
        
        return this.grid;
    }

    placeWord(word, x, y, direction) {
        word.x = x;
        word.y = y;
        word.direction = direction;
        
        const dx = direction === 'horizontal' ? 1 : 0;
        const dy = direction === 'vertical' ? 1 : 0;

        for (let i = 0; i < word.word.length; i++) {
            const posX = x + (dx * i);
            const posY = y + (dy * i);
            
            // Marca come inizio della parola
            const isStart = i === 0;
            
            this.grid[posY][posX] = {
                letter: word.word[i],
                wordId: word.id,
                isStart: isStart,
                definition: isStart ? word.definition : null
            };
        }
    }

    tryPlaceWord(word) {
        const letters = word.word.split('');
        
        for (const placedWord of this.placedWords) {
            for (let i = 0; i < placedWord.word.length; i++) {
                for (let j = 0; j < letters.length; j++) {
                    if (placedWord.word[i] === letters[j]) {
                        // Trova una posizione valida per l'intersezione
                        const position = this.findValidPosition(word, placedWord, i, j);
                        if (position) {
                            this.placeWord(word, position.x, position.y, position.direction);
                            word.placed = true;
                            this.placedWords.push(word);
                            return true;
                        }
                    }
                }
            }
        }
        return false;
    }

    findValidPosition(word, placedWord, placedIndex, wordIndex) {
        const directionsToTry = placedWord.direction === 'horizontal' ? ['vertical'] : ['horizontal'];
        
        for (const direction of directionsToTry) {
            if (direction === 'horizontal') {
                const x = placedWord.x + placedIndex - wordIndex;
                const y = placedWord.y;
                
                if (this.canPlaceWord(word.word, x, y, direction)) {
                    return { x, y, direction };
                }
            } else {
                const x = placedWord.x;
                const y = placedWord.y + placedIndex - wordIndex;
                
                if (this.canPlaceWord(word.word, x, y, direction)) {
                    return { x, y, direction };
                }
            }
        }
        return null;
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

    renderHTML() {
        let html = '<table class="crossword-grid" cellspacing="0" cellpadding="0">';
        
        for (let y = 0; y < this.height; y++) {
            html += '<tr>';
            for (let x = 0; x < this.width; x++) {
                const cell = this.grid[y][x];
                const isEmpty = cell.letter === '';
                const cellClass = isEmpty ? 'empty' : 'filled';
                const number = cell.isStart ? this.getWordNumber(cell.wordId) : '';
                
                html += `<td class="${cellClass}" data-x="${x}" data-y="${y}">`;
                if (number) {
                    html += `<span class="cell-number">${number}</span>`;
                }
                if (!isEmpty) {
                    html += `<span class="cell-letter">${cell.letter}</span>`;
                    html += `<input type="text" maxlength="1" class="cell-input" data-x="${x}" data-y="${y}">`;
                }
                html += '</td>';
            }
            html += '</tr>';
        }
        
        html += '</table>';
        return html;
    }

    getWordNumber(wordId) {
        const word = this.words.find(w => w.id === wordId);
        if (word) {
            const index = this.placedWords.findIndex(w => w.id === wordId);
            return index + 1;
        }
        return '';
    }

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

    async saveCrossword(difficulty = 'facile') {
        const crosswordData = {
            difficolta: difficulty,
            grid: this.grid,
            words: this.placedWords,
            dimensions: `${this.width}x${this.height}`,
            placedCount: this.placedWords.length
        };

        try {
            const response = await fetch('api/save_crossword.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(crosswordData)
            });
            
            return await response.json();
        } catch (error) {
            console.error('Errore nel salvataggio:', error);
            return { success: false, message: error.message };
        }
    }
}

// Funzione principale per inizializzare il cruciverba
async function initializeCrossword(difficulty = 'facile') {
    const crossword = new CrosswordGenerator(15, 15);
    
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
    
    // Salva nel database
    const saveResult = await crossword.saveCrossword(difficulty);
    if (saveResult.success) {
        console.log('Cruciverba salvato con ID:', saveResult.id);
    }
    
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
        alert('Complimenti! Hai completato il cruciverba!');
    }
}

// Event listeners per i controlli
document.addEventListener('DOMContentLoaded', function() {
    const generateBtn = document.getElementById('generate-crossword');
    const difficultySelect = document.getElementById('difficulty-select');
    const checkSolutionBtn = document.getElementById('check-solution');
    const revealSolutionBtn = document.getElementById('reveal-solution');
    
    let currentCrossword = null;
    
    generateBtn.addEventListener('click', async function() {
        const difficulty = difficultySelect.value;
        currentCrossword = await initializeCrossword(difficulty);
    });
    
    checkSolutionBtn.addEventListener('click', function() {
        if (!currentCrossword) return;
        
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
            alert('Complimenti! Tutte le risposte sono corrette!');
        } else {
            alert('Alcune risposte sono sbagliate. Correggi le celle evidenziate in rosso.');
        }
    });
    
    revealSolutionBtn.addEventListener('click', function() {
        if (!currentCrossword) return;
        
        document.querySelectorAll('.cell-input').forEach(input => {
            const x = parseInt(input.dataset.x);
            const y = parseInt(input.dataset.y);
            const cell = currentCrossword.grid[y][x];
            
            input.value = cell.letter;
            input.classList.add('correct');
            input.readOnly = true;
        });
    });
    
    // Genera un cruciverba all'avvio
    initializeCrossword('facile').then(crossword => {
        currentCrossword = crossword;
    });
});