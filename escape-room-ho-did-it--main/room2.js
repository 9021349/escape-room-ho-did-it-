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

function loadQuestion() {
  const q = questions[currentQuestionIndex];
  if (!q) return showCompletion();

  if (!gameStarted) {
    startTimer();
  }

  if (failedQuestions.has(currentQuestionIndex)) {
    currentQuestionIndex++;
    return loadQuestion();
  }

  if (completedQuestions.has(currentQuestionIndex)) {
    currentQuestionIndex++;
    return loadQuestion();
  }

  document.getElementById('questionNumber').textContent = currentQuestionIndex + 1;
  document.getElementById('questionText').textContent = q.question;
  document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
  document.getElementById('totalQuestions').textContent = questions.length;
  document.getElementById('progressBar').style.width = ((currentQuestionIndex / questions.length) * 100) + '%';

  const answerInputElement = document.getElementById('answerInput');
  answerInputElement.value = '';
  answerInputElement.disabled = false;
  setFeedback('');
  answerInputElement.focus();

  const attempts = questionAttempts.get(currentQuestionIndex) || 0;
  const attemptsLeft = maxAttempts - attempts;
  updateAttemptDisplay(attemptsLeft);
}

function updateAttemptDisplay(attemptsLeft) {
  const attemptElement = document.getElementById('attemptCounter');
  if (attemptElement) {
    attemptElement.textContent = `Pogingen over: ${attemptsLeft}`;

    if (attemptsLeft <= 1) {
      attemptElement.style.color = '#f44336';
      attemptElement.style.fontWeight = 'bold';
    } else {
      attemptElement.style.color = '#666';
      attemptElement.style.fontWeight = 'normal';
    }
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
  const userInput = document.getElementById('answerInput').value.trim().toLowerCase
}

function showCompletion() {
  stopTimer();
  
  const totalQuestions = questions.length;
  const correctAnswers = completedQuestions.size;
  const failedAnswers = failedQuestions.size;
  
  document.getElementById('questionSection').style.display = 'none';
  document.getElementById('completionSection').style.display = 'block';
  document.getElementById('progressBar').style.width = '100%';
  
  // Show results
  const finalTime = 600 - timeLeft;
  const minutes = Math.floor(finalTime / 60);
  const seconds = finalTime % 60;
  
  const completionMessage = document.getElementById('completionMessage');
  if (completionMessage) {
    if (correctAnswers === totalQuestions) {
      completionMessage.innerHTML = `
        <h2>🎉 Gefeliciteerd!</h2>
        <p>Je hebt alle ${totalQuestions} vragen correct beantwoord!</p>
        <p>Tijd gebruikt: ${minutes}:${seconds.toString().padStart(2, '0')}</p>
      `;
    } else {
      completionMessage.innerHTML = `
        <h2>Quiz voltooid!</h2>
        <p>Correct beantwoord: ${correctAnswers} van ${totalQuestions}</p>
        <p>Gefaalde vragen: ${failedAnswers}</p>
        <p>Tijd gebruikt: ${minutes}:${seconds.toString().padStart(2, '0')}</p>
      `;
    }
  }
}

function endGame(success) {
  stopTimer();
  
  if (success) {
    showCompletion();
  } else {
    const message = timeLeft <= 0 
      ? 'Game Over! De tijd is om.' 
      : 'Game Over! Te veel vragen fout beantwoord.';
    
    if (confirm(message + ' Wil je opnieuw beginnen?')) {
      restartGame();
    }
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
  document.getElementById('completionSection').style.display = 'none';
  document.getElementById('questionSection').style.display = 'block';
  
  // Reset timer display
  updateTimerDisplay();
  
  loadQuestion();
}

function goBackToRoom1() {
  stopTimer();
  window.location.href = 'room_1.php';
}

// Event listeners
document.getElementById('answerInput')?.addEventListener('keypress', e => {
  if (e.key === 'Enter') {
    submitAnswer();
  }
});

document.addEventListener('DOMContentLoaded', () => {
  // Add timer display to page
  const timerHTML = `
    <div class="timer-container">
      <div>Tijd over: <span id="timer">10:00</span></div>
    </div>
    <button class="restart-btn" onclick="restartGame()">Herstart</button>
  `;
  
  document.body.insertAdjacentHTML('afterbegin', timerHTML);
  
  // Add attempt counter to question section
  const questionSection = document.getElementById('questionSection');
  if (questionSection) {
    const attemptHTML = '<div id="attemptCounter" class="attempts-display">Pogingen over: 3</div>';
    questionSection.insertAdjacentHTML('beforeend', attemptHTML);
  }
  
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
      
      .attempts-display {
        margin: 10px 0;
        color: #666;
        font-size: 0.9rem;
        text-align: center;
      }
      
      .feedback-success {
        background-color: #e8f5e8;
        color: #2e7d32;
        border: 1px solid #4caf50;
        padding: 10px;
        border-radius: 4px;
        margin: 10px 0;
      }
      
      .feedback-error {
        background-color: #ffebee;
        color: #c62828;
        border: 1px solid #f44336;
        padding: 10px;
        border-radius: 4px;
        margin: 10px 0;
      }
      
      .feedback-blocked {
        background-color: #fff3e0;
        color: #ef6c00;
        border: 1px solid #ff9800;
        padding: 10px;
        border-radius: 4px;
        margin: 10px 0;
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
      
      #completionMessage {
        text-align: center;
        padding: 20px;
      }
      
      #completionMessage h2 {
        color: #2e7d32;
        margin-bottom: 15px;
      }
    </style>
  `;
  
  document.head.insertAdjacentHTML('beforeend', styles);
  
  // Initialize game
  if (questions?.length) {
    loadQuestion();
  } else {
    showCompletion();
  }
});

// Clean up timer when page unloads
window.addEventListener('beforeunload', () => {
  stopTimer();
});