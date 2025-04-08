import { initGame } from "./game.js";

 /**********************************************************
* UPDATE DISPLAY & BOAT TIPPING
**********************************************************/
export function updateDisplay() {
    document.getElementById('word-left').textContent = frontRevealed.join(' ');
    document.getElementById('word-right').textContent = backRevealed.join(' ');
    
    let frontCount = frontRevealed.filter(l => l !== '_').length;
    let backCount = backRevealed.filter(l => l !== '_').length;
    let diff = frontCount - backCount;
    let angle = 0;
    
    if (Math.abs(diff) === 1) {
    angle = 5;
    } else if (Math.abs(diff) === 2) {
    angle = 10;
    } else if (Math.abs(diff) >= 3) {
    sinkBoat();
    return;
    }
    
    document.getElementById('boat-container').style.transform =
   (diff > 0) ? `rotate(${-angle}deg)` : `rotate(${angle}deg)`;
}

 /**********************************************************
     * SINK THE BOAT
     **********************************************************/
export function sinkBoat() {
    document.getElementById('boat-container').classList.add('sink');
    splashSound.play();
    bgSound.pause();
    createBubbles();
    // Disable letter buttons until the player answers the popup
    document.querySelectorAll('.letter-btn').forEach(btn => btn.disabled = true);
    // After a delay, prompt the player to play again
    setTimeout(() => {
    //   if (confirm("The boat has sunk!\nDo you want to play again?")) {
    //     initGame();
    //   }
    popup.style.display = "block";

    }, 3000);
  }

/**********************************************************
 * CREATE BUBBLES ON SINK
 **********************************************************/
export function createBubbles() {
    const bubblesContainer = document.getElementById('bubbles');
    for (let i = 0; i < 10; i++) {
        const bubble = document.createElement('div');
        bubble.classList.add('bubble');
        bubble.style.left = Math.random() * 100 + '%';
        bubble.style.animationDelay = Math.random() * 2 + 's';
        bubblesContainer.appendChild(bubble);
    }
    setTimeout(() => { bubblesContainer.innerHTML = ''; }, 4000);
}

/**********************************************************
 * DISPLAY SEAGULL ANIMATION
 **********************************************************/
export function showSeagull() {
    const seagullContainer = document.getElementById('seagull-container');
    seagullContainer.style.display = 'block';
    seagullContainer.addEventListener('animationend', function () {
        if (confirm("Congratulations! You've kept the boat balanced and saved it!\nDo you want to play again?")) {
        initGame();
        }
    });
}

export function hideInstructions() {
    instructionsOverlay.style.display = "none";
  }

export function popUpOverlay(){
const popup = document.getElementById("popup");
popup.style.display = "none"
const closePopup = document.getElementById("closePopup");
closePopup.addEventListener("click", closePopupPlayAgain);
}

export function closePopupPlayAgain() {
popup.style.display = "none";
initGame()
}

export function addKeyboardInput() {
    document.addEventListener('keydown', function(event) {
        // Convert the key pressed to uppercase
        const key = event.key.toUpperCase();
        // Only process if it's a single letter A-Z
        if (!/^[A-Z]$/.test(key)) return;
        
        // Find all letter buttons and trigger a click on the matching one (if available)
        const letterButtons = document.querySelectorAll('.letter-btn');
        letterButtons.forEach(btn => {
        if (btn.textContent === key && !btn.disabled) {
            btn.click();
        }
        });
    });
}