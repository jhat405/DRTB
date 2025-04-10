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
    const failPopup = document.getElementById("failPopup");
    failPopup.style.display = "flex";

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
        const successPopup = document.getElementById("successPopup");
        successPopup.style.display = "flex"
    });
}

export function hideInstructions() {
    instructionsOverlay.style.display = "none";
  }

export function failPopup(){
const failPopup = document.getElementById("failPopup");
failPopup.style.display = "none"
const closePopup = document.getElementById("closeFailPopup");
closePopup.addEventListener("click", closeFailPopupPlayAgain);
}

function closeFailPopupPlayAgain() {
const failPopup = document.getElementById("failPopup");
failPopup.style.display = "none";
initGame()
}

export function successPopup(){
    const successPopup = document.getElementById("successPopup");
    successPopup.style.display = "none"
    const closePopup = document.getElementById("closeSuccessPopup");
    closePopup.addEventListener("click", closeSuccessPopupPlayAgain);
}

function closeSuccessPopupPlayAgain() {
    const successPopup = document.getElementById("successPopup");
    successPopup.style.display = "none";
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

export function muteButton(){
const muteBtn = document.getElementById('muteBtn');
const speakerIcon = {
  on: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
        <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
       </svg>`,
  off: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
        <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" />
        </svg>`
};

let isMuted = false;

muteBtn.addEventListener('click', () => {
  isMuted = !isMuted;

  document.querySelectorAll('audio').forEach(audio => {
    audio.muted = isMuted;
  });

  muteBtn.innerHTML = isMuted ? speakerIcon.off : speakerIcon.on;
});
}