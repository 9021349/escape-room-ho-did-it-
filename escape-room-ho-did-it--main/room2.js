let currentQuestionIndex = 0;
const completedQuestions = new Set();
const failedQuestions = new Set();
const maxAttempts = 3;
const questionAttempts = new Map();
let gameTimer;
let timeLeft = 600; // 10 minutes in seconds
let gameStarted = false;

function startTimer() {
  if (gameStarted) return;
  gameStarted = true;

  updateTimerDisplay();
  gameTimer = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      endGame(false);
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const timerElement = document.getElementById('timer');

  if (timerElement) {
    timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

    if (timeLeft <= 60) {
      timerElement.style.color = '#f44336';
      timerElement.style.animation = 'pulse 1s infinite';
    } else if (timeLeft <= 120) {
      timerElement.style.color = '#ff9800';
    }
  }
}

function stopTimer() {
  if (gameTimer) {
    clearInterval(gameTimer);
    gameTimer = null;
  }
}

function showQuestion(markerIndex) {
  // Start timer als nog niet gestart
  if (!gameStarted) {
    startTimer();
  }

  // Controleer of deze vraag al voltooid of gefaald is
  if (completedQuestions.has(markerIndex) || failedQuestions.has(markerIndex)) {
    if (completedQuestions.has(markerIndex)) {
      setFeedback('Deze vraag is al correct beantwoord!', 'success');
    } else {
      setFeedback('Deze vraag is al gefaald na 3 pogingen.', 'blocked');
    }
    return;
  }

  currentQuestionIndex = markerIndex;
  const q = questions[currentQuestionIndex];
  
  if (!q) {
    setFeedback('Vraag niet gevonden.', 'error');
    return;
  }

  // Toon de modal
  document.getElementById('overlay').style.display = 'block';
  document.getElementById('questionModal').style.display = 'block';
  
  // Vul vraag in
  document.getElementById('questionText').textContent = q.question;
  
  const answerInputElement = document.getElementById('answerInput');
  answerInputElement.value = '';
  answerInputElement.disabled = false;
  answerInputElement.focus();

  // Update poging display
  const attempts = questionAttempts.get(currentQuestionIndex) || 0;
  const attemptsLeft = maxAttempts - attempts;
  updateAttemptDisplay(attemptsLeft);
  
  setFeedback('');
}

function closeModal() {
  document.getElementById('overlay').style.display = 'none';
  document.getElementById('questionModal').style.display = 'none';
}

function updateAttemptDisplay(attemptsLeft) {
  let attemptElement = document.getElementById('attemptCounter');
  if (!attemptElement) {
    // Maak element aan als het niet bestaat
    attemptElement = document.createElement('div');
    attemptElement.id = 'attemptCounter';
    attemptElement.className = 'attempts-display';
    document.getElementById('questionModal').appendChild(attemptElement);
  }
  
  attemptElement.textContent = `Pogingen over: ${attemptsLeft}`;

  if (attemptsLeft <= 1) {
    attemptElement.style.color = '#f44336';
    attemptElement.style.fontWeight = 'bold';
  } else {
    attemptElement.style.color = '#666';
    attemptElement.style.fontWeight = 'normal';
  }
}

function setFeedback(message, type = '') {
  const feedbackElement = document.getElementById('feedback');
  feedbackElement.textContent = message;

  feedbackElement.className = 'feedback';

  if (message) {
    switch(type) {
      case 'success':
        feedbackElement.className += ' feedback-success';
        break;
      case 'error':
        feedbackElement.className += ' feedback-error';
        break;
      case 'blocked':
        feedbackElement.className += ' feedback-blocked';
        break;
      default:
        feedbackElement.className += ' feedback-error';
    }
  }
}

function submitAnswer() {
  const userInput = document.getElementById('answerInput').value.trim().toLowerCase();
  const q = questions[currentQuestionIndex];
  
  if (!userInput) {
    setFeedback('Voer een antwoord in.', 'error');
    return;
  }

  const correctAnswer = q.answer.toLowerCase().trim();
  const attempts = questionAttempts.get(currentQuestionIndex) || 0;
  
  if (userInput === correctAnswer) {
    // Correct antwoord
    completedQuestions.add(currentQuestionIndex);
    setFeedback('Correct! Goed gedaan!', 'success');
    
    // Update marker visueel
    const marker = document.getElementById(`marker${currentQuestionIndex + 1}`);
    if (marker) {
      marker.style.backgroundColor = '#4caf50';
      marker.style.color = 'white';
      marker.innerHTML = '✓';
    }
    
    // Sluit modal na 2 seconden
    setTimeout(() => {
      closeModal();
      checkGameCompletion();
    }, 2000);
    
  } else {
    // Fout antwoord
    const newAttempts = attempts + 1;
    questionAttempts.set(currentQuestionIndex, newAttempts);
    
    if (newAttempts >= maxAttempts) {
      // Maximum pogingen bereikt
      failedQuestions.add(currentQuestionIndex);
      setFeedback(`Fout! Het juiste antwoord was: ${q.answer}. Deze vraag is nu geblokkeerd.`, 'blocked');
      
      // Update marker visueel
      const marker = document.getElementById(`marker${currentQuestionIndex + 1}`);
      if (marker) {
        marker.style.backgroundColor = '#f44336';
        marker.style.color = 'white';
        marker.innerHTML = '✗';
      }
      
      setTimeout(() => {
        closeModal();
        checkGameCompletion();
      }, 3000);
    } else {
      // Nog pogingen over
      const attemptsLeft = maxAttempts - newAttempts;
      setFeedback(`Fout antwoord. Je hebt nog ${attemptsLeft} poging(en) over.`, 'error');
      updateAttemptDisplay(attemptsLeft);
      
      // Focus terug op input
      document.getElementById('answerInput').focus();
    }
  }
}

function checkGameCompletion() {
  if (completedQuestions.size === questions.length) {
    // Alle vragen correct beantwoord
    setTimeout(() => {
      endGame(true);
    }, 1000);
  } else if (failedQuestions.size + completedQuestions.size === questions.length) {
    // Alle vragen behandeld (combinatie van correct en gefaald)
    setTimeout(() => {
      endGame(false);
    }, 1000);
  }
}

function showCompletion() {
  stopTimer();
  
  const totalQuestions = questions.length;
  const correctAnswers = completedQuestions.size;
  const failedAnswers = failedQuestions.size;
  const finalTime = 600 - timeLeft;
  
  // Bereid data voor om door te geven
  const gameData = {
    room: 2,
    totalQuestions: totalQuestions,
    correctAnswers: correctAnswers,
    failedAnswers: failedAnswers,
    timeUsed: finalTime,
    success: correctAnswers === totalQuestions
  };
  
  // Redirect naar win/verlies pagina
  if (correctAnswers === totalQuestions) {
    // Alle vragen correct - WIN
    redirectToWinPage(gameData);
  } else {
    // Niet alle vragen correct - VERLIES
    redirectToLossPage(gameData);
  }
}

function redirectToWinPage(gameData) {
  // Redirect naar lokale win.html
  const params = new URLSearchParams({
    room: gameData.room,
    score: gameData.correctAnswers,
    total: gameData.totalQuestions,
    time: gameData.timeUsed,
    status: 'win'
  });
  
  window.location.href = `win.html?${params.toString()}`;
}

function redirectToLossPage(gameData) {
  // Redirect naar lokale loss.html
  const params = new URLSearchParams({
    room: gameData.room,
    score: gameData.correctAnswers,
    total: gameData.totalQuestions,
    time: gameData.timeUsed,
    status: 'loss'
  });
  
  window.location.href = `loss.html?${params.toString()}`;
}

function endGame(success) {
  stopTimer();
  
  if (success) {
    showCompletion();
  } else {
    // Game over door tijd of te veel fouten
    const gameData = {
      room: 2,
      totalQuestions: questions.length,
      correctAnswers: completedQuestions.size,
      failedAnswers: failedQuestions.size,
      timeUsed: 600 - timeLeft,
      success: false,
      reason: timeLeft <= 0 ? 'timeout' : 'too_many_failures'
    };
    
    // Direct naar verlies pagina
    redirectToLossPage(gameData);
  }
}

function restartGame() {
  // Reset all variables
  currentQuestionIndex = 0;
  completedQuestions.clear();
  failedQuestions.clear();
  questionAttempts.clear();
  timeLeft = 600;
  gameStarted = false;
  
  // Stop timer
  stopTimer();
  
  // Reset display
  const completionSection = document.getElementById('completionSection');
  if (completionSection) {
    completionSection.style.display = 'none';
  }
  
  document.querySelector('.crime-scene-container').style.display = 'block';
  
  // Reset markers
  for (let i = 1; i <= questions.length; i++) {
    const marker = document.getElementById(`marker${i}`);
    if (marker) {
      marker.style.backgroundColor = '#ffeb3b';
      marker.style.color = '#000';
      marker.innerHTML = i.toString();
    }
  }
  
  // Reset timer display
  updateTimerDisplay();
  
  // Close any open modals
  closeModal();
}

function goBackToRoom1() {
  stopTimer();
  window.location.href = 'room_1.php';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
  // Add timer display to page
  const timerHTML = `
    <div class="timer-container">
      <div>Tijd over: <span id="timer">10:00</span></div>
    </div>
    <button class="restart-btn-fixed" onclick="restartGame()">Herstart</button>
  `;
  
  document.body.insertAdjacentHTML('afterbegin', timerHTML);
  
  // Add event listeners voor markers
  document.querySelectorAll('.evidence-marker').forEach((marker, index) => {
    marker.addEventListener('click', () => {
      showQuestion(index);
    });
  });
  
  // Event listener voor Enter key in answer input
  document.getElementById('answerInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      submitAnswer();
    }
  });
  
  // Event listener voor overlay (om modal te sluiten)
  document.getElementById('overlay')?.addEventListener('click', closeModal);
  
  // Add styles
  const styles = `
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
      
      .overlay {
        display: none;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 1000;
      }
      
      .modal {
        display: none;
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: white;
        padding: 30px;
        border-radius: 10px;
        max-width: 500px;
        width: 90%;
        z-index: 1001;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
      }
      
      .modal h2 {
        margin-bottom: 20px;
        color: #333;
      }
      
      .modal input {
        width: 100%;
        padding: 10px;
        margin: 10px 0;
        border: 2px solid #ddd;
        border-radius: 5px;
        font-size: 16px;
      }
      
      .modal button {
        background: #4caf50;
        color: white;
        border: none;
        padding: 12px 20px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        margin-top: 10px;
      }
      
      .modal button:hover {
        background: #45a049;
      }
      
      .attempts-display {
        margin: 10px 0;
        color: #666;
        font-size: 0.9rem;
        text-align: center;
      }
      
      .feedback {
        margin-top: 15px;
        padding: 10px;
        border-radius: 4px;
        text-align: center;
      }
      
      .feedback-success {
        background-color: #e8f5e8;
        color: #2e7d32;
        border: 1px solid #4caf50;
      }
      
      .feedback-error {
        background-color: #ffebee;
        color: #c62828;
        border: 1px solid #f44336;
      }
      
      .feedback-blocked {
        background-color: #fff3e0;
        color: #ef6c00;
        border: 1px solid #ff9800;
      }
      
      .completion-section {
        display: none;
        text-align: center;
        padding: 40px 20px;
        background: rgba(255, 255, 255, 0.95);
        border-radius: 15px;
        margin: 20px auto;
        max-width: 600px;
      }
      
      .completion-section h2 {
        color: #2e7d32;
        margin-bottom: 20px;
      }
      
      .completion-section button {
        margin: 10px;
        padding: 12px 20px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
      }
      
      .back-btn {
        background: #2196f3;
        color: white;
      }
      
      .back-btn:hover {
        background: #1976d2;
      }
      
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
      }
      
      .restart-btn-fixed {
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
      
      .restart-btn-fixed:hover {
        background: #d84315;
      }
    </style>
  `;
  
  document.head.insertAdjacentHTML('beforeend', styles);
  
  // Initialize timer display
  updateTimerDisplay();
});

// Clean up timer when page unloads
window.addEventListener('beforeunload', () => {
  stopTimer();
});