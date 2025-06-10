let currentQuestionIndex = 0;
const completedQuestions = new Set();

function openModal(index) {
  const marker = document.querySelector(`[data-index="${index}"]`);
  const question = marker.getAttribute('data-question');
  
  currentQuestionIndex = index;
  document.getElementById('question').textContent = question;
  document.getElementById('answer').value = '';
  document.getElementById('feedback').textContent = '';
  document.getElementById('feedback').className = '';

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
    feedback.textContent = 'Correct! Well done.';
    feedback.className = 'feedback-success';
    
    // Mark as completed
    document.getElementById(`marker-${currentQuestionIndex}`).classList.add('completed');
    completedQuestions.add(currentQuestionIndex);
    
    setTimeout(() => {
      closeModal();
      checkGameCompletion();
    }, 1500);
  } else {
    feedback.textContent = 'Wrong answer. Try again.';
    feedback.className = 'feedback-error';
  }
}

function checkGameCompletion() {
  const totalQuestions = document.querySelectorAll('.evidence-marker').length;
  if (completedQuestions.size === totalQuestions) {
    setTimeout(() => {
      alert('Congratulations! You solved the room 1 questions!');
      window.location.href = 'room_2.php'; // Navigeren naar room_2.php
    }, 500);
  }
}

// Enter key to submit
document.getElementById('answer').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    checkAnswer();
  }
});
