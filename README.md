# Ruota della Fortuna - Libri e Penitenze

Un'applicazione web interattiva con due ruote della fortuna:
1. **Ruota dei Libri**: Domande su 34 libri letterari
2. **Ruota delle Penitenze**: Compiti divertenti da eseguire

## Requisiti
- PHP 7.4+
- MySQL 5.7+
- Apache o Nginx
- Browser moderno con JavaScript abilitato

## Installazione

### 1. Database
1. Crea un database MySQL chiamato `wheel_of_fortune`
2. Importa il file `database/wheel_of_fortune.sql`
3. Modifica `includes/config.php` con le tue credenziali

### 2. File PHP
1. Copia tutti i file nella cartella del tuo server web
2. Assicurati che Apache sia configurato per eseguire PHP

### 3. Popolamento Database (opzionale)
Se vuoi aggiungere più domande, esegui `populate_books.php`

## Struttura File
