<?php
require_once('./dbcon.php');

try {
  $stmt = $db_connection->query("SELECT * FROM questions WHERE roomId = 2 ORDER BY id ASC");
  $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
  die("Databasefout: " . $e->getMessage());
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Escape Room 2</title>
  <link rel="stylesheet" href="room2.css">
  <style>
    /* fix background path */
    .crime-scene-container {
      position: relative;
      max-width: 800px;
      margin: 0 auto;
      background-image: url('img/police\ station.jpg')
      background-size: cover;
      background-position: center;
      height: 600px;
      border: 2px solid #555;
      border-radius: 10px;
    }

    .evidence-marker {
      position: absolute;
      width: 35px;
      height: 35px;
      background-color: #ffeb3b;
      color: #000;
      border: 2px solid #000;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: bold;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .evidence-marker:hover {
      background-color: #ffc107;
      transform: scale(1.1);
    }

    /* plaats markers ergens zichtbaar */
    #marker1 { top: 100px; left: 150px; }
    #marker2 { top: 250px; left: 300px; }
    #marker3 { top: 400px; left: 200px; }
  </style>
</head>
<body>
  <div class="container">
    <h1 class="flickering">Escape Room 2</h1>
    <p class="instructions">Klik op een bewijsstuk om een vraag te beantwoorden</p>

    <div class="crime-scene-container">
      <div class="evidence-marker" id="marker1">1</div>
      <div class="evidence-marker" id="marker2">2</div>
      <div class="evidence-marker" id="marker3">3</div>
    </div>

    <!-- Vraag modal -->
    <div class="overlay" id="overlay"></div>
    <div class="modal" id="questionModal">
      <h2 id="questionText">Vraag komt hier</h2>
      <input type="text" id="answerInput" placeholder="Typ je antwoord">
      <button onclick="submitAnswer()">Verzenden</button>
      <div id="feedback"></div>
    </div>

    <script>
      const questions = <?php echo json_encode($questions); ?>;
      let currentQuestionIndex = null;
      let incorrectAttempts = 0;
      const maxAttempts = 3;

      function openModal(index) {
        currentQuestionIndex = index;
        document.getElementById('questionText').textContent = questions[index].question;
        document.getElementById('answerInput').value = '';
        document.getElementById('feedback').textContent = '';
        document.getElementById('overlay').style.display = 'block';
        document.getElementById('questionModal').style.display = 'block';
      }

      function closeModal() {
        document.getElementById('overlay').style.display = 'none';
        document.getElementById('questionModal').style.display = 'none';
      }

      function setFeedback(message, isSuccess = false) {
        const feedback = document.getElementById('feedback');
        feedback.textContent = message;
        feedback.className = isSuccess ? 'feedback-success' : 'feedback-error';
      }

     function submitAnswer() {
    const input = document.getElementById('answerInput').value.trim().toLowerCase();
    const correct = questions[currentQuestionIndex].answer.trim().toLowerCase();

    if (!input) return setFeedback('Vul een antwoord in!');

    if (input === correct) {
        setFeedback('Correct! Goed gedaan!', true);
        document.getElementById('marker' + (currentQuestionIndex + 1)).classList.add('completed');

        setTimeout(() => {
            closeModal();
            if (document.querySelectorAll('.evidence-marker.completed').length === 3) {
                window.location.href = 'win-verlies/index.html';
            }
        }, 1000);
    } else {
        incorrectAttempts++;
        setFeedback('Fout antwoord. Probeer opnieuw.');
        if (incorrectAttempts >= maxAttempts) {
            window.location.href = 'win-verlies/index.html';
        }
    }
}


      // Marker click listeners
      document.getElementById('marker1').addEventListener('click', () => openModal(0));
      document.getElementById('marker2').addEventListener('click', () => openModal(1));
      document.getElementById('marker3').addEventListener('click', () => openModal(2));
      document.getElementById('overlay').addEventListener('click', closeModal);

      document.getElementById('answerInput').addEventListener('keypress', e => {
        if (e.key === 'Enter') submitAnswer();
      });
    </script>
  </div>
</body>
</html>
