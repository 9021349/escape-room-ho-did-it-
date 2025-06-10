<?php
// begin.php - Murder Mystery Homepage
?>
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>The Last Party - Murder Mystery Quiz</title>
<link rel="stylesheet" href="homepage/style.css">
</head>
<body>
    <div class="container">
        <header>
            <h1 class="flickering">THE LAST PARTY</h1>
            <p class="subtitle">Murder Mystery Quiz Game</p>
        </header>

        <div class="story-section">
            <h2 class="story-title">Het Verhaal</h2>
            <p class="story-text">
                Het was een gewone zaterdagavond toen Sam zijn vier beste vrienden uitnodigde voor een feestje in zijn appartement. De muziek speelde, de drankjes vloeiden, en iedereen leek plezier te hebben. Maar toen de klok middernacht sloeg, werd Sam dood aangetroffen in zijn eigen woonkamer.
            </p>
            <p class="story-text">
                De politie heeft de plaats delict afgezet, maar één ding is zeker: een van zijn vier vrienden is de moordenaar. Elk van hen had een motief, elk van hen had de kans, en elk van hen houdt geheimen verborgen.
            </p>
            <div class="mystery-clue">
                "Beantwoord de juiste vragen, analyseer de bewijzen, en ontdek welke van Sams vrienden de moordenaar is. Elke vraag brengt je dichter bij de waarheid!"
            </div>
        </div>

        <div class="story-section">
            <h2 class="story-title">De Verdachten</h2>
            <div class="suspects">
                <div class="suspect-card">
                    <div class="suspect-name">EMMA</div>
                    <div class="suspect-description">
                        Sams ex-vriendin. Ze leek over de breuk heen te zijn, maar was ze dat echt? Haar jaloezie over Sams nieuwe relatie was voor iedereen duidelijk zichtbaar die avond.
                    </div>
                </div>
                <div class="suspect-card">
                    <div class="suspect-name">DAVID</div>
                    <div class="suspect-description">
                        Sams zakenpartner. Hun bedrijf stond op het punt van faillissement en Sam wilde eruit stappen. David had alles te verliezen als Sam zou vertrekken.
                    </div>
                </div>
                <div class="suspect-card">
                    <div class="suspect-name">LISA</div>
                    <div class="suspect-description">
                        Sams zus. Familie zou alles voor elkaar moeten doen, maar Lisa had ontdekt dat Sam haar erfenis had gebruikt voor zijn bedrijf. Vergeving was niet in haar woordenboek.
                    </div>
                </div>
                <div class="suspect-card">
                    <div class="suspect-name">MARCO</div>
                    <div class="suspect-description">
                        Sams beste vriend sinds de middelbare school. Maar beste vrienden kunnen de ergste vijanden worden, vooral als er geheimen over een gedeeld verleden naar boven komen.
                    </div>
                </div>
            </div>
        </div>

        <div class="cta-section">
            <h2 style="color: #cc1414; margin-bottom: 20px;">Ben jij de detective die deze zaak kan oplossen?</h2>
            <p style="margin-bottom: 30px; font-size: 1.1em;">
                Start onze interactieve Murder Mystery Quiz en beantwoord vragen over de verdachten, bewijzen en gebeurtenissen van die fatale avond. Gebruik je detective vaardigheden om de echte moordenaar te ontmaskeren!
            </p>
<a href="room_1.php" class="cta-button">START DE QUIZ</a>
            
            <div style="margin-top: 30px; padding: 20px; background: rgba(0,0,0,0.3); border-radius: 10px;">
                <h3 style="color: #cc1414; margin-bottom: 15px;">Hoe werkt het?</h3>
                <div style="text-align: left; max-width: 600px; margin: 0 auto;">
                    <p style="margin-bottom: 10px;">📋 <strong>Stap 1:</strong> Lees het verhaal en leer de verdachten kennen</p>
                    <p style="margin-bottom: 10px;">🕵️ <strong>Stap 2:</strong> Beantwoord vragen over alibis, motieven en bewijzen</p>
                    <p style="margin-bottom: 10px;">🔍 <strong>Stap 3:</strong> Analyseer aanwijzingen en trek conclusies</p>
                    <p>⚖️ <strong>Stap 4:</strong> Wijs de moordenaar aan en zie of je gelijk had!</p>
                </div>
            </div>
        </div>
    </div>

    <footer>
        <p>&copy; 2024 The Last Party Escape Room..</p>
        <p>Geschikt voor 2-6 spelers | Leeftijd: 16+ | Speeltijd: 60 minuten</p>
    </footer>

<script src="homepage/app.js"></script>
</body>
</html>
