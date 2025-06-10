

// Game data - deze zou je normaal van andere pagina's krijgen
let gameData = {
    correctAnswers: 8,     
    totalQuestions: 12,    
    timeSpent: "23:45",   
    cluesFound: 12,     
    suspectedMurderer: "Marco"  
};

// Functie om te bepalen of speler heeft gewonnen of verloren
function checkGameResult() {
    // Win condities:
    // 1. Minimaal 60% van de vragen goed (7 van 12)
    // 2. De juiste moordenaar gekozen (Marco)
    
    const correctPercentage = (gameData.correctAnswers / gameData.totalQuestions) * 100;
    const correctMurderer = gameData.suspectedMurderer === "Marco";
    
    // Check of speler heeft gewonnen
    if (correctPercentage >= 60 && correctMurderer) {
        return "victory"; 
    } else {
        return "defeat";   
    }
}

// Functie om automatisch het juiste eindscherm te tonen
function showGameResult() {
    const result = checkGameResult();
    
    // Verberg alle eindschermen
    document.querySelectorAll('.ending').forEach(ending => {
        ending.classList.remove('active');
    });
    
    // Verwijder active class van alle buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Toon het juiste eindscherm
    document.getElementById(result + '-ending').classList.add('active');
    
    // Activeer de juiste button
    if (result === "victory") {
        document.querySelector('.toggle-btn:first-child').classList.add('active');
    } else {
        document.querySelector('.toggle-btn:last-child').classList.add('active');
    }
    
    // Update de statistieken
    updateStats(result);
}

// Functie om statistieken bij te werken
function updateStats(result) {
    if (result === "victory") {
        // Update victory stats
        document.querySelector('#victory-ending .stat-number').textContent = gameData.cluesFound;
        document.querySelector('#victory-ending .stat-box:nth-child(2) .stat-number').textContent = gameData.correctAnswers;
        document.querySelector('#victory-ending .stat-box:nth-child(3) .stat-number').textContent = gameData.timeSpent;
    } else {
        // Update defeat stats
        const missedClues = 12 - gameData.cluesFound;
        const wrongDeductions = gameData.totalQuestions - gameData.correctAnswers;
        
        document.querySelector('#defeat-ending .stat-number').textContent = missedClues;
        document.querySelector('#defeat-ending .stat-box:nth-child(2) .stat-number').textContent = wrongDeductions;
        document.querySelector('#defeat-ending .stat-box:nth-child(3) .stat-number').textContent = gameData.timeSpent;
    }
}

// Bestaande functies (blijven hetzelfde)
function showEnding(type) {
    // Hide all endings
    document.querySelectorAll('.ending').forEach(ending => {
        ending.classList.remove('active');
    });
    
    // Remove active class from all buttons
    document.querySelectorAll('.toggle-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected ending
    document.getElementById(type + '-ending').classList.add('active');
    
    // Add active class to clicked button
    event.target.classList.add('active');
}

function playAgain() {
    alert('Nieuw spel wordt geladen...');
    window.location.href = 'homepage.html';
}

function viewSolution() {
    alert('Volledige oplossing wordt geladen...');
}

function backToMenu() {
    alert('Terug naar hoofdmenu...');
    window.location.href = 'homepage.html';
}

// Hoofdfunctie die alles start
document.addEventListener('DOMContentLoaded', function() {
    // Controleer automatisch het spel resultaat
    showGameResult();
    
    // Fade in animatie
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 1s ease-in';
        document.body.style.opacity = '1';
    }, 100);
});

// Functie om game data van andere pagina's te krijgen (optioneel)
function getGameDataFromURL() {
    // Als je data via URL parameters wilt doorgeven
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('score')) {
        gameData.correctAnswers = parseInt(urlParams.get('score'));
    }
    if (urlParams.has('time')) {
        gameData.timeSpent = urlParams.get('time');
    }
    if (urlParams.has('clues')) {
        gameData.cluesFound = parseInt(urlParams.get('clues'));
    }
    if (urlParams.has('murderer')) {
        gameData.suspectedMurderer = urlParams.get('murderer');
    }
}