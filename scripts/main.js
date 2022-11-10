import { createDeck, takeCardByValue } from './card.js';
import { Gui } from './gui.js';

console.log("PAGINA CARICATA")
const btnCarte = document.getElementById("btn-carte")
const btnSimula = document.getElementById("btn-simula")
let cardsDeck;

let gui = new Gui();
gui._buttons = {
    btnCarte: btnCarte,
    btnSimula: btnSimula,
}
window.gui = gui; // <--

// ---------- This is the entry point -----------------------------------------
// ---------- All the function have to be run after cardsDeck is created -----
// ----------------------------------------------------------------------------

/**
 * Because this function will be call async from createDeck function
 * it will also take care to initialize the Gui, in this was the start
 * of the game can be only after all the image load from createDec()
 * will be done.
 * */
function getCardsDeck(inp) {
    cardsDeck = inp;
    window.cc = cardsDeck; // <--
    btnCarte.disabled = false;
    btnSimula.disabled = false;
    test();
}

createDeck(getCardsDeck);

// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------
// ----------------------------------------------------------------------------



// ------- TEST FUNCTION ----------//
function generateTestCards() {
    gui.getPlayerCards(cardsDeck.splice(0,12));
    gui.playerCards.push(cardsDeck[5]);
    gui.drawCards(gui.playerCards);
    btnCarte.disabled = true;
}

btnCarte.addEventListener('click', generateTestCards);

btnSimula.addEventListener('click', () => {
    gui.drawAreaPlayRect();
    gui.startPlayCheck();
    gui.cardsOnTable.push(cardsDeck[26]);
    gui.cardsOnTable.push(cardsDeck[27]);
    gui.cardsOnTable.push(cardsDeck[28]);
    gui.cardsOnTable.push(cardsDeck[29]);
    gui.cardsOnTable.push(cardsDeck[30]);
    gui.drawCardsOnTable(gui.cardsOnTable);
    btnSimula.disabled = true;
})

function test() {
    let aa = takeCardByValue(cardsDeck, 1 , "S");
}
