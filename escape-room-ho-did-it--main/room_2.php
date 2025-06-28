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
      background-image: url('img/police\ station.jpg');
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
      // Maak questions array beschikbaar voor JavaScript
      const questions = <?php echo json_encode($questions); ?>;
    </script>
    <script src="room2.js" defer></script>
</body>
</html>