import { Color } from './color.js';
import { checkClickOnCard, findSum, getCoordinateOfCardsCombination, ALPHABET } from './utils.js';

class Gui {
    _mouseMove = null;
    _clickSelectCard = null;
    _clickCombination = null; // henbled binding for highlight cards click method
    _bottons = {}; // botton are add in the main function
    constructor() {
        this.canvas = document.getElementById("my-canvas");
        this.ctx = this.canvas.getContext('2d');
        this.H = this.canvas.height;
        this.W = this.canvas.width;
        this.w = 50; // card width
        this.h = 100; // card height
        this.playerCards = [];  // array carte del giocatore
        this.cardsOnTable = []; // array carte sul tavolo
        this.cardsOnTableHighlight = []; // non usata
        this.pleyerCardHighlight = null; // non usata
        this.selectInfo = {
            reaperCard: null,
            listOfPositions: null,
            listOfValues: null,
            numberOfDovision: null
        };
        this.catchedCards = [];
    }

    init() {

    }

    /**
     * function to call for give cards to the player
     * the controller will give the defined cards accordingly for each player
     */
    getPlayerCards(cardsToGet) {
        for (let x = 0; x < cardsToGet.length; x++) {
            this.playerCards.push(cardsToGet[x]);
        }
    }

    // the method draw the player card.
    // and give to the cards recived the calculate x and y value
    drawCards(cardsToDraw) {
        let l = cardsToDraw.length;
        let gap = 5;
        let x = (this.W - (l * this.w + (l - 1) * gap)) / 2;
        let y = this.H - 20 - this.h;
        for (let n = 0; n < l; n++) {
            let card = cardsToDraw[n];
            card.x = x;
            card.y = y;
            this.ctx.drawImage(card.imgCard, x, y, this.w, this.h);
            x += (this.w + gap);
        }
    }

    drawCardsOnTable(cardsToDraw) {
        this.ctx.clearRect(260, 140, 280, 215);
        if (cardsToDraw.length < 1) {
            return
        }
        let cardsPositions = getPosCardOnTable(cardsToDraw.length);
        for (let z = 0; z < cardsToDraw.length; z++) {
            let x = cardsPositions[z].x;
            let y = cardsPositions[z].y;
            let card = cardsToDraw[z];
            card.x = x;
            card.y = y;
            this.ctx.drawImage(card.imgCard, x, y, this.w, this.h);
        }
    }

    /**
     * this function draw a rectangle that show where the played cards
     * will be draw
     */
    drawAreaPleyRect() {
        this.ctx.beginPath();
        this.ctx.lineWidth = "1";
        this.ctx.strokeStyle = "black";
        this.ctx.rect(260, 140, 280, 215); // area in the center of the table
        this.ctx.stroke();
        this.drawCardsOnTable(this.cardsOnTable); // <--
    }

    /**
     * handle the mouse movement over the cards before a card is select
     * a red rectangle is drawing on the canrd woth mouse pointer over
     * after a cards is select this listener function is remove from the event
     * listener
     */
    mouseMove(e) {
        let x = e.offsetX;
        let y = e.offsetY;
        for (let n = 0; n < this.playerCards.length; n++) {
            let card = this.playerCards[n];
            if (x > card.x & x < (card.x + this.w) & y > card.y & y < (card.y + this.h)) {
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
                this.drawCards(this.playerCards);
                this.drawAreaPleyRect();
                this.ctx.beginPath();
                this.ctx.lineWidth = "2";
                this.ctx.strokeStyle = Color.blu;
                this.ctx.rect(card.x, card.y, this.w, this.h);
                this.ctx.stroke();
                this.drawArrowUp(card.x, card.y); // <--
            }
        }
    }

    /**
     * Method to select a card. On the select card an arrow will draw.
     * If no card on table red arrow , if cards on table blue arrow
     * After selcet a cartd if there are cards cmbination on table
     * the method "heightTackableCards" is call to highlight the possible
     * combination. 
     */
    clickSelectCard(e) {
        let clickedCard = checkClickOnCard(this.playerCards, e.offsetX, e.offsetY);
        let list = [];
        if (clickedCard != null) {
            this.selectInfo.reaperCard = clickedCard; // add the selected card to this.selectInfo to be use later
            list = findSum(this.cardsOnTable, clickedCard.val);
            this.selectInfo.listOfValues = list;
        }
        // with list we have the information of the grup card,
        // in the next function we use that list to highlight the cards on the table
        let positions = getCoordinateOfCardsCombination(this.cardsOnTable, list);
        this.selectInfo.listOfPositions = positions;
        console.log(positions); // <--
        console.log(list); // <--
        if (positions.length != 0) {
            this.heightTackableCards(positions);
            this.canvas.removeEventListener('mousemove', this._mouseMove);
            this.canvas.removeEventListener('click', this._clickSelectCard);
            this._bottons.btnCarte.disabled = true;
            this._bottons.btnSimula.disabled = true;
            return;
        }
        // TODO se non ci sono combinazioni il click deve far giocare la carta
        // parte complessa da pensare bene.
        // si può eseguire il metodo click combination qui.
        // click combination controlla se non ci sono combinazini ma solo una carta reaper
        // giocherà direttamente la carta.  --- PARTE DA GESTIRE CON ATTENZIONE ----
        this.canvas.removeEventListener('mousemove', this._mouseMove);
        this.canvas.removeEventListener('click', this._clickSelectCard);
        this._bottons.btnCarte.disabled = true;
        this._bottons.btnSimula.disabled = true;
        this._clickCombination = this.clickCombination.bind(this);
        this.canvas.addEventListener('click', this._clickCombination);
    }

    heightTackableCards(listPos) {
        if (listPos.length === 1 & listPos[0].length === 1) {
            let position = listPos[0][0];
            // hightlight only one card
            this.ctx.fillStyle = Color.blu;
            this.ctx.fillRect(position.x, position.y, this.w, this.h);
            this.selectInfo.numberOfDovision = 1;
        }
        if (listPos.length > 1) {
            let nDivision = 0;
            listPos.forEach(el => {
                if (el.length > 1) nDivision += 1; // add number for possible combination
            })
            this.selectInfo.numberOfDovision = nDivision;
            // if division is 1 do not need area divisio, only two color
            // I know there are some row of code wrate two time but I'm a noob :)
            if (nDivision === 1) {
                let delta = this.h / nDivision;
                listPos.forEach((cardsPosGroup, index) => {
                    let color = Color[index];
                    this.ctx.fillStyle = color;
                    let letter = ALPHABET[index];
                    this.ctx.fillStyle = color;
                    this.ctx.font = `${delta * 0.6}px serif`;
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.strokeStyle = 'white'
                    cardsPosGroup.forEach(c => {
                        this.ctx.fillRect(c.x, c.y, this.w, this.h);
                        this.ctx.strokeText(
                            letter,
                            c.x + this.w / 2,
                            c.y + delta / 2
                        );
                    });
                });
            }
            // case with division > 1 need to divide the area for selection
            if (nDivision > 1) {
                let delta = this.h / nDivision;
                listPos.forEach((cardsPosGroup, index) => {
                    let color = Color[index];
                    let letter = ALPHABET[index];
                    this.ctx.fillStyle = color;
                    this.ctx.font = `${delta * 0.7}px serif`;
                    this.ctx.textAlign = 'center';
                    this.ctx.textBaseline = 'middle';
                    this.ctx.strokeStyle = 'white'
                    cardsPosGroup.forEach(c => {
                        this.ctx.fillRect(c.x, c.y + index * delta, this.w, delta);
                        this.ctx.strokeText(
                            letter,
                            c.x + this.w / 2,
                            c.y + index * delta + delta / 2
                        );
                    });
                })
            }

            console.log(`click carta con combinazioni`); // <--
        }
        // TODO add avent listener for click selection
        this._clickCombination = this.clickCombination.bind(this);
        this.canvas.addEventListener('click', this._clickCombination);

    }

    // this method hendle the click on the cards combination on table to tacke.
    // use this.selectInfo for recive information about the existing combination on the table.
    // after click save information about selecter dard to this.catchedCards.
    // then trig the animation to take the cards.
    // then send the message to "CONTROLLER" about catched cards
    // then remove his oun avent listener.
    clickCombination(e) {
        console.log(this.selectInfo);
        let x = e.offsetX;
        let y = e.offsetY;
        // case with no combination to take, only play the card on the table.
        if (this.selectInfo.reaperCard.val === 1) {
            console.log("Hai selezionato un asso");

            return;
        }
        if (this.selectInfo.numberOfDovision === null) {
            console.log('Selezionata carta senza prese dispobibili');
            this.playerCards.forEach((card, index) => {
                if (x > card.x && x < (card.x + this.w) && y > card.y && y < (card.y + this.h)) {
                    console.log(`La carta ${card.val} di " ${card.seed} " verra giocata sul tavolo.`);
                }
            });

            // here run the function for animate play the single card on table.
            return;
        }
        if (this.selectInfo.listOfValues.length > 0) {
            console.log(`Hai selezionato una carta con ${this.selectInfo.listOfValues.length} possibili combinazioni.`);

            // here run the function for animate take cards.
            this.clickTakeCards(x, y);
            return;
        }

    }

    clickTakeCards(x, y) {
        
        let cardOnClick = null;
        let combinationListValue = null;
        let delta = null;

        // define a card clicked
        this.cardsOnTable.forEach((card, index) => {
            if (x > card.x && x < (card.x + this.w) && y > card.y && y < (card.y + this.h)) {
                cardOnClick = card;
            }
        });
        if (cardOnClick === null) {
            return;
        }

        // check which combinatin is click
        delta = Math.floor(this.h / this.selectInfo.numberOfDovision);
        console.log(Math.floor((y - cardOnClick.y) / delta)); // <--
        // Now is necessary to handle two possibility: if division === 1 of if division > 1
        // becouse they are different.
        if (this.selectInfo.numberOfDovision === 1) {
            let cardValue = cardOnClick.val;
            // find the combination
            this.selectInfo.listOfValues.forEach(list => {
                if (list.includes(cardValue)) {
                    combinationListValue = list;
                    console.log(combinationListValue);
                }
            });
            //------ test
            let np = 20;
            this.cardsOnTable.forEach(card => {
                if (combinationListValue.includes(card.val)) {
                    card.x = np;
                    card.y = np;
                    np += 30;
                    this.catchedCards.push(card);
                }
            });
            let newTable = this.cardsOnTable.filter(card => {
                if (!(combinationListValue.includes(card.val))) {
                    return card;
                }
            });
            this.cardsOnTable = newTable;
            this.drawCardsOnTable(this.cardsOnTable);
            this.catchedCards.forEach(card => {
                this.ctx.drawImage(card.imgCard, card.x, card.y, this.w, this.h);
            });
            /// adesso bisogna toglierle dal tavolo, e disegnarle fuori
            /// hanno gia le coordinate giuste
            /// poi ridisegnare le carte sul tavolo, tien duro che ce la fai

        }
        // if division are more than 1
        if (this.selectInfo.numberOfDovision > 1) {


        }

    }

    drawArrowUp(xP, yP) {
        this.ctx.fillStyle = Color.grey;
        this.ctx.fillRect(xP, yP, this.w, this.h);
        this.ctx.fillStyle = Color.blu;
        this.ctx.beginPath();
        this.ctx.moveTo(xP + 25, yP + 5);
        this.ctx.lineTo(xP + 45, yP + 40);
        this.ctx.lineTo(xP + 30, yP + 40);
        this.ctx.lineTo(xP + 30, yP + 50);
        this.ctx.lineTo(xP + 20, yP + 50);
        this.ctx.lineTo(xP + 20, yP + 40);
        this.ctx.lineTo(xP + 5, yP + 40);
        this.ctx.fill();
    }


    /**
     * This funtion attach to the canvas an event listener for mousemove
     * we use a trick: we create a on fly cariable with binding version
     * of final function to make it ease to remove event listener later
     */
    startPlayCheck() {
        this._mouseMove = this.mouseMove.bind(this);
        this.canvas.addEventListener('mousemove', this._mouseMove);
        this._clickSelectCard = this.clickSelectCard.bind(this);
        this.canvas.addEventListener('click', this._clickSelectCard);
    }
}

/**
 * this function return an array of point for positioning cards on table
 * recive the number of cards and return an arrey with accordlyng number points
 */
function getPosCardOnTable(n) {
    if (n == 1) {
        return [{ x: 365, y: 200 }];
    }
    if (n == 2) {
        return [{ x: 310, y: 200 }, { x: 365, y: 200 }];
    }
    if (n == 3) {
        return [{ x: 265, y: 200 }, { x: 320, y: 200 }, { x: 375, y: 200 }];
    }
    if (n == 4) {
        return [{ x: 265, y: 200 }, { x: 320, y: 200 }, { x: 375, y: 200 }, { x: 430, y: 200 }];
    }
    if (n == 5) {
        return [{ x: 265, y: 200 }, { x: 320, y: 200 }, { x: 375, y: 200 }, { x: 430, y: 200 },
        { x: 485, y: 200 }];
    }
}

export { Gui };
