import { createDeck, tackeCardByValue } from './card.js';
import { Gui } from './gui.js';

console.log("PAGINA CARICATA")
const btnCarte = document.getElementById("btn-carte")
const btnSimula = document.getElementById("btn-simula")
let cardsDeck;

let gui = new Gui();
gui._bottons = {
    btnCarte: btnCarte,
    btnSimula: btnSimula,
}
window.gui = gui; // <--

// ---------- This is the entry point -----------------------------------------
// ---------- All the function have to be run after cardsDesck is created -----
// ----------------------------------------------------------------------------

/**
 * Becouse this function will be call async from createDeck function
 * it will also take care to inizialite the Gui, in this was the start
 * of the game can be only after all the image load from creadeDec()
 * will be done.
 * */
function getCardsDeck(inp) {
    cardsDeck = inp;
    console.log(cardsDeck);
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
    gui.getPlayerCards(cardsDeck.splice(0,13));
    gui.drawCards(gui.playerCards);
}

btnCarte.addEventListener('click', generateTestCards);

btnSimula.addEventListener('click', () => {
    gui.drawAreaPleyRect();
    gui.startPlayCheck();
    gui.cardsOnTable.push(cardsDeck[26]);
    gui.cardsOnTable.push(cardsDeck[27]);
    gui.cardsOnTable.push(cardsDeck[28]);
    gui.cardsOnTable.push(cardsDeck[29]);
    gui.drawCardsOnTable(gui.cardsOnTable);
    console.log(gui.cardsOnTable);
})

function test() {
    let aa = tackeCardByValue(cardsDeck, 1 , "S");
    console.log(aa);
}
