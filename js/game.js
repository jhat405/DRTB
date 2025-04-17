import{addKeyboardInput, hideInstructions, sinkBoat, updateDisplay, failPopup, muteButton, successPopup,triggerJump} from "./dom.js"
import { levels } from "./levels.js";
import { checkWin } from "./utils.js";
let currentLevel = "easy"; // default level
let themesLibrary = levels[currentLevel];
let lastPuzzleIndex = -1;

export function initGame() {
    // Remove any previous sink class so the boat resets
    const boatContainer = document.getElementById('boat-container');
    boatContainer.classList.remove('sink');
    // Reset the boat's transform to ensure it is horizontal
    boatContainer.style.transform = 'rotate(0deg)';
    
    // Clear overlays (if any)
    document.getElementById('seagull-container').style.display = 'none';
    document.getElementById('bubbles').innerHTML = '';
    
    // Choose a new puzzle index (different from the last, if possible)
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * themesLibrary.length);
    } while (themesLibrary.length > 1 && newIndex === lastPuzzleIndex);
    lastPuzzleIndex = newIndex;
    
    let selectedTheme = themesLibrary[newIndex];
    // Set the clue and code words
    window.wordFront = selectedTheme.words[0];
    window.wordBack = selectedTheme.words[1];
    document.getElementById('boat-name').innerHTML =
'<span id="epithet">Voyager of </span>' +
'<span id="theme" style="filter: blur(5px); font-weight: normal;">' +
selectedTheme.theme +
'</span>';
    // Reset guessed letters and strikes using updated global variables
    window.frontRevealed = Array(window.wordFront.length).fill('_');
    window.backRevealed = Array(window.wordBack.length).fill('_');
    window.strikes = 0;
    // Update UI
    document.getElementById('word-left').textContent = frontRevealed.join(' ');
    document.getElementById('word-right').textContent = backRevealed.join(' ');
    document.getElementById('strike-count').textContent = strikes;
    // Clear and recreate letter buttons
    const lettersContainer = document.getElementById('letters');
    lettersContainer.innerHTML = "";
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split('').forEach(letter => {
      let btn = document.createElement('button');
      btn.textContent = letter;
      btn.classList.add('letter-btn');
      btn.onclick = () => guessLetter(letter, btn);
      lettersContainer.appendChild(btn);
    });
    setTimeout(function(){
      triggerJump()
    }, 1000
    );
    setTimeout(function() {
      const themeSpan = document.getElementById('theme');
      if (themeSpan) {
        themeSpan.style.filter = 'none';
        themeSpan.style.fontWeight = 'bold';
      }
    }, 2000);
    
  }

/**********************************************************
 * HANDLE LETTER GUESSES
 **********************************************************/
function guessLetter(letter, btn) {
    btn.disabled = true;
    let foundMatch = false;

    if (wordFront.includes(letter)) {
        wordFront.split('').forEach((char, i) => {
        if (char === letter) {
            frontRevealed[i] = letter;
            foundMatch = true;
        }
        });
    }
    if (wordBack.includes(letter)) {
        wordBack.split('').forEach((char, i) => {
        if (char === letter) {
            backRevealed[i] = letter;
            foundMatch = true;
        }
        });
    }

    if (foundMatch) {
        correctSound.currentTime = 0;
        correctSound.play();
    } else {
        wrongSound.currentTime = 0;
        wrongSound.play();
        strikes++;
        document.getElementById('strike-count').textContent = strikes;
        if (strikes >= 3) {
        sinkBoat();
        return;
        }
    }

    updateDisplay();
    checkWin();
}

function setLevel(level) {
    currentLevel = level;
    themesLibrary = levels[currentLevel];
    // Update active button appearance
    document.getElementById('easyBtn').classList.remove('active');
    document.getElementById('mediumBtn').classList.remove('active');
    document.getElementById('hardBtn').classList.remove('active');
    document.getElementById(level + "Btn").classList.add('active');
    initGame();
  }

function instructionsOverlay(){
  const questionMark = document.getElementById("howToPlayBtn");
    const instructionsOverlay = document.getElementById("instructionsOverlay");
    instructionsOverlay.style.display = "none"
    const closeInstructions = document.getElementById("close-instructions");
    questionMark.addEventListener("click", () => {
      console.log('Clicked! IsMuted:');
      instructionsOverlay.style.display = instructionsOverlay.style.display = "flex";
    });
    closeInstructions.addEventListener("click", hideInstructions);
}




export function start() {
  console.log("Start function running...");
  const correctSound = /** @type {HTMLAudioElement} */ (
    document.getElementById('correctSound')
  );
  console.log("correctSound:", correctSound);
  
  if (correctSound) {
    correctSound.volume = 0.4;
  } else {
    console.warn("correctSound was null");
  }
    document.getElementById('easyBtn').addEventListener('click', function(){ setLevel("easy"); });
    document.getElementById('mediumBtn').addEventListener('click', function(){ setLevel("medium"); });
    document.getElementById('hardBtn').addEventListener('click', function(){ setLevel("hard"); });
    
    /**********************************************************
     * AUDIO SETUP
     **********************************************************/
    
    //const correctSound =  document.getElementById('correctSound') ;
    correctSound.volume = 0.4;
    const wrongSound = document.getElementById('wrongSound');
    wrongSound.volume = 0.4;
    const splashSound = document.getElementById('splashSound');
    splashSound.volume = 0.4;
    const bgSound = document.getElementById('bgSound');
    bgSound.volume = 0.2;
    const winSound = document.getElementById('bgSound');
    winSound.volume = 0.4;
    
    let bgStarted = false;
    window.addEventListener('click', function startBG() {
      if (!bgStarted) {
        bgSound.play().catch(err => console.log(err));
        bgStarted = true;
      }
    });
    
    /**********************************************************
     * HOW TO PLAY BUTTON
     **********************************************************/
    /** document.getElementById('howToPlayBtn').addEventListener('click', function() {
      alert("How to Play:\n\nGuess the letters to reveal two secret words that share a theme. Too many wrong guesses or too much imbalance will tip the boat and sink it. Choose a level, and enjoy the challenge!");
    }); **/
    
    //Instructions Overlay Logic
    
    instructionsOverlay()
    failPopup()
    successPopup()
    muteButton()
    


// Call the function to enable keyboard input
  addKeyboardInput();

    // Initialize the game on page load using the default level
    //* initGame(); *//

   // Listen for the Play button click
  document.getElementById("play-button").addEventListener("click", function() {
        // Hide the landing overlay and white background overlay
        document.getElementById("landing-overlay").style.display = "none";
        document.getElementById("overlay-bg").style.display = "none";
        // Show the game container
        document.getElementById("game-container").style.display = "block";
        // Initialize the game
        initGame();
    });
}