/*************  ✨ Windsurf Command 🌟  *************/
let currentQuestionIndex = 0;

function loadQuestion() {
  const q = questions[currentQuestionIndex];
  if (!q) return showCompletion();

  const questionNumberElement = document.getElementById('questionNumber');
  const questionTextElement = document.getElementById('questionText');
  const currentQuestionElement = document.getElementById('currentQuestion');
  const totalQuestionsElement = document.getElementById('totalQuestions');
  const progressBarElement = document.getElementById('progressBar');
  document.getElementById('questionNumber').textContent = currentQuestionIndex + 1;
  document.getElementById('questionText').textContent = q.question;
  document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
  document.getElementById('totalQuestions').textContent = questions.length;
  document.getElementById('progressBar').style.width = ((currentQuestionIndex / questions.length) * 100) + '%';

  questionNumberElement.textContent = currentQuestionIndex + 1;
  questionTextElement.textContent = q.question;
  currentQuestionElement.textContent = currentQuestionIndex + 1;
  totalQuestionsElement.textContent = questions.length;
  progressBarElement.style.width = ((currentQuestionIndex / questions.length) * 100) + '%';

  const answerInputElement = document.getElementById('answerInput');
  answerInputElement.value = '';
  document.getElementById('answerInput').value = '';
  setFeedback('');
  answerInputElement.focus();
  document.getElementById('answerInput').focus();
}

function setFeedback(message, isSuccess = false) {
  const feedbackElement = document.getElementById('feedback');
  feedbackElement.textContent = message;
  feedbackElement.className = 'feedback' + (message ? (isSuccess ? ' feedback-success' : ' feedback-error') : '');
  const feedback = document.getElementById('feedback');
  feedback.textContent = message;
  feedback.className = 'feedback' + (message ? (isSuccess ? ' feedback-success' : ' feedback-error') : '');
}

function submitAnswer() {
  const userInput = document.getElementById('answerInput').value.trim().toLowerCase();
  const correct = questions[currentQuestionIndex].answer.trim().toLowerCase();

  if (!userInput) return setFeedback('Vul een antwoord in!');
  if (userInput === correct) {
    setFeedback('Correct! Goed gedaan!', true);
    setTimeout(() => {
      currentQuestionIndex++;
      loadQuestion();
    }, 1500);
  } else {
    setFeedback('Fout antwoord. Probeer het opnieuw!');
  }
}

function showCompletion() {
  document.getElementById('questionSection').style.display = 'none';
  document.getElementById('completionSection').style.display = 'block';
  document.getElementById('progressBar').style.width = '100%';
}

function restartGame() {
  currentQuestionIndex = 0;
  document.getElementById('completionSection').style.display = 'none';
  document.getElementById('questionSection').style.display = 'block';
  loadQuestion();
}

function goBackToRoom1() {
  window.location.href = 'room_1.php';
}

document.getElementById('answerInput').addEventListener('keypress', e => {
  if (e.key === 'Enter') submitAnswer();
});

document.addEventListener('DOMContentLoaded', () => {
  if (questions?.length) {
    loadQuestion();
  } else {
    document.getElementById('questionSection').style.display = 'none';
    document.getElementById('completionSection').style.display = 'block';
    document.getElementById('progressBar').style.width = '100%';
  }
});
/*******  3b452079-88ee-4cb4-821a-12c1e4b2c1f3  *******/