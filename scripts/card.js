class Card {
    constructor(val, seed) {
        this.val = val;
        this.seed = seed;
        this.imgCard = new Image();
        this.x = 0;
        this.y = 0;
    }
}

/**
 * This function create an array with 52 cards.
 * Because we have to load 52 images asynchronous we use promise
 * when all the promises are resolve the callback function is run
 * passing the created cards deck
 */
function createDeck(call) {
    let deck = [];
    let jarOfPromise = [];
    for (let x of ["B", "C", "S", "D"]) {
        for (let y of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]) {
            jarOfPromise.push(
                new Promise(resolve => {
                    let tempCard = new Card(y, x); // create card with value and seed
                    
                    tempCard.imgCard.addEventListener('load',
                        function () {
                            resolve(true);
                        });
                    tempCard.imgCard.setAttribute('crossOrigin', 'same-origin');
                    tempCard.imgCard.src = createImgFileName(y, x);
                    deck.push(tempCard);
                })
            );
        }
    }

    Promise.all(jarOfPromise).then(_ => {
        call(deck);
    });
} // end createDeck

function createImgFileName(val, seed, dir = "cardsImg") {
    return "./" + dir + "/" + val.toString() + seed + ".jpg"
    // example "../cardsImg/1B.jpg"
}

/**
 * This function remove the card with specific valeu from the dock
 * and return that card.
 */
function takeCardByValue(list, value, seed) {
    let n = null;
    let card = null;
    for (let x = 0; x < list.length; x++) {
        if (list[x].val == value & list[x].seed == seed) {
            n = x;
        }
    }
    if (n != null) {
        card = list.splice(n, 1)[0];
    }

    return card;
}

export { Card, createDeck,  takeCardByValue };
