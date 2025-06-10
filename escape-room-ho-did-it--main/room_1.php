<?php
require_once('./dbcon.php');

try {
  $stmt = $db_connection->query("SELECT * FROM questions WHERE roomId = 1 ORDER BY id");
  $questions = $stmt->fetchAll(PDO::FETCH_ASSOC);
} catch (PDOException $e) {
  die("Databasefout: " . $e->getMessage());
}

// Evidence marker positions
$evidence_positions = [
    ['top' => '80%', 'left' => '15%'],  // Marker 1
    ['top' => '70%', 'left' => '85%'],  // Marker 2
    ['top' => '60%', 'left' => '75%'],  // Marker 3
    ['top' => '50%', 'left' => '25%'],  // Marker 4
    ['top' => '40%', 'left' => '35%'],  // Marker 5
    ['top' => '50%', 'left' => '65%'],  // Marker 6
    ['top' => '30%', 'left' => '45%'],  // Marker 7
    ['top' => '20%', 'left' => '55%'],  // Marker 8
    ['top' => '20%', 'left' => '75%'],  // Marker 9
    ['top' => '40%', 'left' => '85%'],  // Marker 10
];
?>

<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Crime Scene Investigation</title>
  <link rel="stylesheet" href="room1.css">
</head>

<body>
  <div id="timer" class="timer"></div>

  <h1>Crime Scene Investigation</h1>
  <p class="instructions">Click on the yellow evidence markers to investigate!</p>

  <div class="crime-scene-container">
    <?php foreach ($questions as $index => $question) : ?>
      <?php if (isset($evidence_positions[$index])) : ?>
        <div class="evidence-marker" 
             style="top: <?php echo $evidence_positions[$index]['top']; ?>; left: <?php echo $evidence_positions[$index]['left']; ?>;"
             onclick="openModal(<?php echo $index; ?>)"
             data-index="<?php echo $index; ?>" 
             data-question="<?php echo htmlspecialchars($question['question']); ?>"
             data-answer="<?php echo htmlspecialchars($question['answer']); ?>"
             id="marker-<?php echo $index; ?>">
          <?php echo $index + 1; ?>
        </div>
      <?php endif; ?>
    <?php endforeach; ?>
  </div>

  <section class="overlay" id="overlay" onclick="closeModal()"></section>

  <section class="modal" id="modal">
    <h2>Evidence Question</h2>
    <p id="question"></p>
    <input type="text" id="answer" placeholder="Your answer...">
    <button onclick="checkAnswer()">Submit</button>
    <p id="feedback"></p>
  </section>

  <script src="room1.js"></script>
</body>

</html>