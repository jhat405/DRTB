import { showSeagull } from "./dom.js";

/**********************************************************
 * CHECK FOR WIN
 **********************************************************/
   export function checkWin() {
    if (frontRevealed.join('') === wordFront && backRevealed.join('') === wordBack) {
        bgSound.pause();
        winSound.play();
        showSeagull();
    }
    }

