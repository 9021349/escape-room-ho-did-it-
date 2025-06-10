// Add some interactive elements
function startQuiz() {
    alert("De quiz wordt geladen! Bereid je voor om de moordenaar te ontmaskeren.");
}

// Add subtle blood drip animation
function createBloodDrip() {
    const drip = document.createElement('div');
    drip.className = 'blood-drip';
    drip.style.left = Math.random() * window.innerWidth + 'px';
    document.body.appendChild(drip);
    
    setTimeout(() => {
        drip.remove();
    }, 3000);
}

// Create blood drips occasionally
setInterval(createBloodDrip, 8000);

// Add hover effects to suspect cards
document.querySelectorAll('.suspect-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.cursor = 'pointer';
    });
    
    card.addEventListener('click', function() {
        const name = this.querySelector('.suspect-name').textContent;
        alert(`Verdachte: ${name}\n\nDeze persoon zal een belangrijke rol spelen in onze quiz. Onthoud hun motief!`);
    });
});

// Add some atmospheric sounds on click (placeholder)
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'H1') {
        // Could add spooky sound effect here
        console.log('🎵 *Mysterieuze muziek speelt*');
    }
});