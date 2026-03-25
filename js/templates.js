function getExplanationOverlay() {
  return `
    <div class="game-explanation">
      <div class="overlay-header"><h2>Explanation</h2> <button class="close-btn" onclick="toggleOverlay('game-explanation')">X</button></div>
        <p>El Pollo Loco is an action-packed platform adventure set in the scorching desert. You play as Pepe, a brave explorer who can run, jump, and throw salsa bottles to defeat enemies. He can carry a maximum of five bottles and starts with 100 health points – if they drop to zero, the game is over.<br><br>
        Collect coins and bottles along the way, avoid dangers, and use skillful jumps or precise throws to defeat chickens and eventually the final boss. You only win the game once you defeat him.
        </p>
        <h3>Controls</h3>
        <p>Pepe is easily controlled using the keyboard:</p>
        <table><tbody>
          <tr>
            <td class="table-img"><img src="img/icons/arrow_left.svg"> <img src="img/icons/arrow_right.svg"></td>
            <td>Walk:</td>
            <td>Left & Right Arrow Keys</td>
          </tr>
          <tr>
            <td class="table-img"><img src="img/icons/arrow_up.svg"></td>
            <td>Jump:</td>
            <td>Spacebar</td>
          </tr>
          <tr>
            <td class="table-img"><img src="img/icons/throw_icon.svg"></td>
            <td>Throw salsa bottle:</td>
            <td>D key</td>
          </tr>
        </tbody>
        </table>

    </div>
    `;
}

function getImprintOverlay() {
  return `
      <div class="game-explanation">
        <div class="overlay-header"><h2>Imprint</h2> <button class="close-btn" onclick="toggleOverlay('imprint')">X</button></div>
        <h3>Diensteanbieter</h3>
        <p>Marina Denker</p>
        <p>Am Schmiedekamp 4</p>
        <p>28816 Stuhr</p>

        <h3>Kontaktmöglichkeiten</h3>
        <p>E-Mail-Adresse: <a href="mailto:marina.ritzau@web.de">marina.ritzau@web.de</a></p>

        <h3>Vorbehalt der Nutzung für Text und Data Mining</h3>
        <p>Vorbehalt der Nutzung für Text und Data Mining: Der Inhaber dieser Website gestattet die Nutzung oder das Herunterladen von Inhalten dieser Website durch Dritte für die Entwicklung, das Training oder den Betrieb von künstlicher Intelligenz oder anderen maschinellen Lernsystemen ("Text und Data Mining") ausschließlich mit ausdrücklicher schriftlicher Zustimmung des Inhabers. Ohne eine solche Zustimmung ist es untersagt, die Inhalte für Text und Data Mining zu verwenden. Dies gilt auch, wenn auf der Website keine Meta-Angaben vorhanden sind, die entsprechende Verfahren aussperren, und selbst dann, wenn Bots, die den Zweck haben, die Website zu Zwecken des Text und Data Mining auszulesen, nicht ausgesperrt werden.</p>

        <h3>Haftungs- und Schutzrechtshinweise</h3>
        <p>Haftungsausschluss: Die Inhalte dieses Onlineangebotes wurden sorgfältig und nach unserem aktuellen Kenntnisstand erstellt, dienen jedoch nur der Information und entfalten keine rechtlich bindende Wirkung, sofern es sich nicht um gesetzlich verpflichtende Informationen (z. B. das Impressum, die Datenschutzerklärung, AGB oder verpflichtende Belehrungen von Verbrauchern) handelt. Wir behalten uns vor, die Inhalte vollständig oder teilweise zu ändern oder zu löschen, soweit vertragliche Verpflichtungen unberührt bleiben. Alle Angebote sind freibleibend und unverbindlich.</p>
        <p>Urheberrechte und Markenrechte: Alle auf dieser Website dargestellten Inhalte, wie Texte, Fotografien, Grafiken, Marken und Warenzeichen sind durch die jeweiligen Schutzrechte (Urheberrechte, Markenrechte) geschützt. Die Verwendung, Vervielfältigung usw. unterliegen unseren Rechten oder den Rechten der jeweiligen Urheber bzw. Rechteinhaber.</p>

        <p class="seal"  style="padding-bottom: 24px;"><a href="https://datenschutz-generator.de/" title="Rechtstext von Dr. Schwenke - für weitere Informationen bitte anklicken." target="_blank" rel="noopener noreferrer nofollow">Erstellt mit kostenlosem Datenschutz-Generator.de von Dr. Thomas Schwenke</a></p>
        </div>
      </div>
    `;
}

function getGameOverScreen() {
  return ` 
      <img class="gameover-img" src="img/You won, you lost/Game over A.png" alt="You Lost">
  `;
}

function getYouWonScreen() {
  return ` 
      <img class="won-img" src="img/You won, you lost/You won A.png" alt="You Won">
        <div class="leave-options">
          <button class="wood-btn" onclick="restartGame()">Play Again</button>
          ${currentLevel === 1 ? '<button class="wood-btn" onclick="startLevel(2)">Play Level 2</button>' : ""}
          <button class="wood-btn" onclick="exitGame()">Leave Game</button>
        </div>
  `;
}

function getYouLostScreen() {
  return `
        <img class="lost-img" src="img/You won, you lost/You lost.png" alt="You Lost">
        <div class="leave-options">
            <button class="wood-btn" onclick="restartGame()">Try Again</button>
          <button class="wood-btn" onclick="exitGame()">Leave Game</button>
        </div>
    `;
}