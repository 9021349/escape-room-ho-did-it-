let currentQuestionIndex = 0;
const completedQuestions = new Set();
const failedQuestions = new Set();
const maxAttempts = 3; // Maximum aantal pogingen per vraag
const questionAttempts = new Map(); // Houdt bij hoeveel pogingen per vraag
let gameTimer;
let timeLeft = 600; // 10 minuten in seconden
let gameStarted = false;

// Timer functionaliteit
function startTimer() {
  if (gameStarted) return;
  gameStarted = true;
  
  updateTimerDisplay();
  gameTimer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();
    
    if (timeLeft <= 0) {
      endGame(false); // Game over door tijd
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerElement = document.getElementById('timer');
  
  if (timerElement) {
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    // Waarschuwing kleuren bij weinig tijd
    if (timeLeft <= 60) {
      timerElement.style.color = '#f44336'; // Rood
      timerElement.style.animation = 'pulse 1s infinite';
    } else if (timeLeft <= 120) {
      timerElement.style.color = '#ff9800'; // Oranje
    }
  }
}

function stopTimer() {
  if (gameTimer) {
    clearInterval(gameTimer);
    gameTimer = null;
  }
}

function openModal(index) {
  // Start timer bij eerste vraag
  if (!gameStarted) {
    startTimer();
  }
  
  // Check of vraag al gefaald is
  if (failedQuestions.has(index)) {
    alert('Deze vraag is niet meer beschikbaar omdat je te vaak fout hebt geantwoord.');
    return;
  }
  
  // Check of vraag al voltooid is
  if (completedQuestions.has(index)) {
    alert('Deze vraag heb je al correct beantwoord!');
    return;
  }
  
  const marker = document.querySelector(`[data-index="${index}"]`);
  const question = marker.getAttribute('data-question');
  
  currentQuestionIndex = index;
  document.getElementById('question').textContent = question;
  document.getElementById('answer').value = '';
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = '';
  
  // Toon aantal pogingen
  const attempts = questionAttempts.get(index) || 0;
  const attemptsLeft = maxAttempts - attempts;
  document.getElementById('attempts').textContent = `Pogingen over: ${attemptsLeft}`;
  
  document.getElementById('overlay').style.display = 'block';
  document.getElementById('modal').style.display = 'block';
  document.getElementById('answer').focus();
}

function closeModal() {
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('modal').style.display = 'none';
}

function checkAnswer() {
  const marker = document.querySelector(`[data-index="${currentQuestionIndex}"]`);
  const correctAnswer = marker.getAttribute('data-answer').toLowerCase().trim();
  const userAnswer = document.getElementById('answer').value.toLowerCase().trim();
  const feedback = document.getElementById('feedback');
  
  if (userAnswer === correctAnswer) {
    feedback.textContent = 'Correct! Goed gedaan!';
    feedback.className = 'feedback-success';
    
    // Mark as completed
    document.getElementById(`marker-${currentQuestionIndex}`).classList.add('completed');
    completedQuestions.add(currentQuestionIndex);
    
    setTimeout(() => {
      closeModal();
      checkGameCompletion();
    }, 1500);
  } else {
    // Verhoog aantal pogingen
    const currentAttempts = questionAttempts.get(currentQuestionIndex) || 0;
    const newAttempts = currentAttempts + 1;
    questionAttempts.set(currentQuestionIndex, newAttempts);
    
    const attemptsLeft = maxAttempts - newAttempts;
    
    if (attemptsLeft > 0) {
      feedback.textContent = `Fout antwoord! Je hebt nog ${attemptsLeft} poging(en) over.`;
      feedback.className = 'feedback-error';
      document.getElementById('attempts').textContent = `Pogingen over: ${attemptsLeft}`;
    } else {
      // Geen pogingen meer over
      feedback.textContent = 'Te vaak fout! Deze vraag is nu geblokkeerd.';
      feedback.className = 'feedback-blocked';
      
      // Markeer vraag als gefaald
      failedQuestions.add(currentQuestionIndex);
      document.getElementById(`marker-${currentQuestionIndex}`).classList.add('failed');
      
      setTimeout(() => {
        closeModal();
        checkGameCompletion();
      }, 2000);
    }
  }
}

function checkGameCompletion() {
  const totalQuestions = document.querySelectorAll('.evidence-marker').length;
  const totalAnswered = completedQuestions.size + failedQuestions.size;
  
  if (completedQuestions.size === totalQuestions) {
    // Alle vragen correct beantwoord
    stopTimer();
    setTimeout(() => {
      const finalTime = 600 - timeLeft;
      const minutes = Math.floor(finalTime / 60);
      const seconds = finalTime % 60;
      alert(`Gefeliciteerd! Je hebt Room 1 voltooid in ${minutes}:${seconds.toString().padStart(2, '0')}!`);
      window.location.href = 'room_2.php';
    }, 500);
  } else if (totalAnswered === totalQuestions && failedQuestions.size > 0) {
    // Alle vragen beantwoord maar niet allemaal correct
    endGame(false);
  }
}

function endGame(success) {
  stopTimer();
  
  if (success) {
    alert('Gefeliciteerd! Je hebt alle vragen correct beantwoord!');
    window.location.href = 'room_2.php';
  } else {
    const message = timeLeft <= 0 
      ? 'Game Over! De tijd is om.' 
      : 'Game Over! Je hebt te veel vragen fout beantwoord.';
    alert(message + ' Probeer het opnieuw!');
    location.reload(); // Herlaad de pagina
  }
}

// Restart functie
function restartGame() {
  if (confirm('Weet je zeker dat je opnieuw wilt beginnen?')) {
    location.reload();
  }
}

// Voeg CSS toe voor nieuwe stijlen
const additionalStyles = `
  <style>
    .timer-container {
      position: fixed;
      top: 20px;
      right: 20px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 10px 15px;
      border-radius: 8px;
      font-family: 'Courier New', monospace;
      font-size: 1.2rem;
      font-weight: bold;
      z-index: 1001;
      border: 2px solid #ffeb3b;
    }
    
    .attempts-display {
      margin: 10px 0;
      color: #666;
      font-size: 0.9rem;
    }
    
    .evidence-marker.failed {
      background-color: #f44336;
      color: white;
      cursor: not-allowed;
    }
    
    .evidence-marker.failed:hover {
      background-color: #d32f2f;
      transform: none;
    }
    
    .feedback-blocked {
      background-color: #ffebee;
      color: #c62828;
      border: 1px solid #f44336;
    }
    
    @keyframes pulse {
      0% { opacity: 1; }
      50% { opacity: 0.5; }
      100% { opacity: 1; }
    }
    
    .restart-btn {
      position: fixed;
      top: 20px;
      left: 20px;
      background: #ff5722;
      color: white;
      border: none;
      padding: 10px 15px;
      border-radius: 5px;
      cursor: pointer;
      font-size: 0.9rem;
      z-index: 1001;
    }
    
    .restart-btn:hover {
      background: #d84315;
    }
  </style>
`;

// Voeg timer en restart knop toe aan de pagina
document.addEventListener('DOMContentLoaded', function() {
  // Voeg CSS toe
  document.head.insertAdjacentHTML('beforeend', additionalStyles);
  
  // Voeg timer toe
  document.body.insertAdjacentHTML('afterbegin', `
    <div class="timer-container">
      <div>Tijd over: <span id="timer">10:00</span></div>
    </div>
    <button class="restart-btn" onclick="restartGame()">Herstart</button>
  `);
  
  // Voeg attempts display toe aan modal (als deze bestaat)
  const modal = document.getElementById('modal');
  if (modal) {
    const question = modal.querySelector('h2');
    if (question) {
      question.insertAdjacentHTML('afterend', '<div id="attempts" class="attempts-display">Pogingen over: 3</div>');
    }
  }
});

// Enter key to submit
document.addEventListener('DOMContentLoaded', function() {
  const answerInput = document.getElementById('answer');
  if (answerInput) {
    answerInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        checkAnswer();
      }
    });
  }
});