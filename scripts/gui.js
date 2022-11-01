import { Color } from './color.js';
import { checkClickOnCard, findSum, getCoordinateOfCardsCombination } from './utils.js';

class Gui {
    _mouseMove = null;
    _clickSelectCard = null;
    _bottons = {}; // botton are add in the main function
    constructor() {
        this.canvas = document.getElementById("my-canvas");
        this.ctx = this.canvas.getContext('2d');
        this.H = this.canvas.height;
        this.W = this.canvas.width;
        this.w = 50; // card width
        this.h = 100; // card height
        this.playerCards = [];  // arrey carte del giocatore
        this.cardsOnTable = []; // array carte sul tavolo
        this.cardsOnTableHighlight = []; // non usata
        this.pleyerCardHighlight = null; // non usata
        this.selectInfo = {
            listOfPositions: null,
            listOfValues: null,
            numberOfDovision: null
        };
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
     * function to select a card. On the select card an arrow will draw.
     * If no dard on table red arrow , if cards on table red arrow
     * the mouseMove hendler is remove. when arrow is pressed.
     */
    clickSelectCard(e) {
        console.log(`Click: x-> ${e.offsetX} y-> ${e.offsetY}`); // <--
        let clickedCard = checkClickOnCard(this.playerCards, e.offsetX, e.offsetY);
        let list = [];
        if (clickedCard != null) {
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
            // TODO aggiungere event listener per prendere le carte della cominazione
            // selezionata
        }
        // TODO se non ci sono combinazioni il click deve far giocare la carta
        // parte complessa da pensare bene.

    }

    heightTackableCards(listPos) {
        if (listPos.length === 1 & listPos[0].length === 1) {
            let position = listPos[0][0];
            // hightlight only one card
            this.ctx.fillStyle = Color.blu;
            this.ctx.fillRect(position.x, position.y, this.w, this.h);
            this.selectInfo.numberOfDovision = 1;
            console.log(this.selectInfo); // <--
        }
        if (listPos.length > 1) {
            console.log(`${listPos.length} possibili combinazioni`); // <--
            let nDivision = 0;
            listPos.forEach(el => {
                if (el.length > 1) nDivision += 1; // add number for possible combination
            })
            this.selectInfo.numberOfDovision = nDivision; 
            // if division is 1 do not need area divisio, only two color
            if (nDivision === 1) {
                listPos.forEach((cardsPosGroup, index) => {
                    // if (el.length === 1) {
                    //     this.ctx.fillStyle = Color.blu;
                    //     this.ctx.fillRect(el[0].x, el[0].y, this.w, this.h);
                    //     console.log(`posizione: ${index}`);
                    // }
                    let color = Color[index];
                    this.ctx.fillStyle = color;
                    cardsPosGroup.forEach(c => {
                        this.ctx.fillRect(c.x, c.y, this.w, this.h);
                    });
                });
            }
            // case with division > 1 need to divide the area for selection
            if (nDivision > 1) {
                let delta = this.h / nDivision;
                listPos.forEach((cardsPosGroup, index) => {
                    let color = Color[index];
                    this.ctx.fillStyle = color;
                    cardsPosGroup.forEach(c => {
                        this.ctx.fillRect(c.x, c.y + index * delta, this.w, delta);
                    });
                })
            }

            console.log(`n. divisioni = ${nDivision}`); // <--
            console.log(this.selectInfo);

        }
        // TODO finire con la parte che evidenzia più carte nelle
        // combinazioni
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
