// assets/js/switch_handler.js
function switchWheel(type) {
    if (type === 'penance') {
        window.location.href = 'penance.php';
    } else {
        window.location.href = 'index.php';
    }
}

// Oppure per switch senza ricaricare (più avanzato):
function toggleWheel() {
    const newType = currentWheelType === 'book' ? 'penance' : 'book';
    loadItems(newType);
}