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
            <td>Arrow Up Key</td>
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
            <p>Information according to § 5 DDG</p>
            <p>Marina Denker<br>
            Am Schmiedekamp 4<br>
            28816 Stuhr<br>
            </p>

            <p><b>Contact:</b><br>
            E-Mail: <a href="mailto:marina.ritzau@web.de">marina.ritzau@web.de</a></p>

            <h3>Disclaimer:</h3>
            <p><b>Liability for Content</b><br>
            The content of our pages has been created with the utmost care. However, we cannot guarantee the accuracy, completeness, or currency of the content. As a service provider, we are responsible for our own content on these pages in accordance with general laws pursuant to § 7 para. 1 DDG. According to §§ 8 to 10 DDG, however, we as a service provider are not obligated to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity. Obligations to remove or block the use of information under general law remain unaffected. Liability in this regard is only possible from the point in time at which a concrete legal infringement becomes known. Upon becoming aware of any such legal violations, we will remove the relevant content immediately.</p><br><br>

            <h3>Copyright</h3><br>
            <p>The content and works created by the site operators on these pages are subject to German copyright law. Reproduction, editing, distribution, and any kind of use beyond the limits of copyright law require the written consent of the respective author or creator. Downloads and copies of this site are only permitted for private, non-commercial use. Where content on this site was not created by the operator, the copyrights of third parties are respected. In particular, third-party content is identified as such. Should you nevertheless become aware of a copyright infringement, please notify us accordingly. Upon becoming aware of any legal violations, we will remove such content immediately.</p>
            <p>Created with <a href="https://impressum-generator.de" rel="dofollow">Impressum-Generator.de</a>, the tool for imprint and <a href="https://impressum-generator.de/datenschutz-generator" rel="dofollow">privacy policy</a>. Based on a template by <a href="https://www.kanzlei-hasselbach.de/" rel="dofollow">Kanzlei Hasselbach</a>.</p>   
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
        <div class="reason_for_loss">
          <p class="lossreason">${reasonsForLoss}</p>
        </div>
        <div class="leave-options">
            <button class="wood-btn" onclick="restartGame()">Try Again</button>
          <button class="wood-btn" onclick="exitGame()">Leave Game</button>
        </div>
    `;
}

function wannaGoScreen() {
  return `
        <div class="question-header">
          <p class="exitquestion">Do you really wanna go?</p>
        </div>
        <div class="exit-options">
          <button class="wood-btn" onclick="exitGame()">Yes</button>
          <button class="wood-btn-secondary" onclick="closeExitConfirmation()">No</button>
        </div>
    `;
}