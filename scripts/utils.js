/**
 * This file contains function for math operation
 * and function for coordinates calcolation
 */

/**
 * This function recive an array of cards and check the coordinate
 * associate with a combination return an arrey of the coordinate
 * grouping by combination.
 * 
 * @param {Array.<Card>} cards Arrey of cards to take the coordinate
 * @param {Array.Array.<number>} combination Array with all possible combination
 */
function getCoordinateOfCardsCombination (cards, combinations) {
    let result = [];
    if (combinations.length === 0) {
        return result;
    }
    combinations.forEach(combination => {
        let set = [];
        combination.forEach(value => {
            let card = cards.filter(c => c.val === value)[0];
            set.push({
                x: card.x,
                y: card.y
            });
        });
        result.push(set);
    });

    return result;
}

/**
 * This function check in which card player clicked
 * 
 * @param {Array.<Card>} cards 
 * @param {number} x 
 * @param {number} y
 * @returns {Card}
 */
function checkClickOnCard(cards, x, y) {
    let pos = null;
    cards.forEach((card, i) => {
        if (x > card.x & x < (card.x + 50) & y > card.y & y < (card.y + 100)) {
            pos = i;
        }
    });
    if (pos != null) {
        return { ...cards[pos] };
    } else {
        return null;
    }
}

/**
 * This function looking for all possible cards combination that can be take
 * with a card of value v and return an array with all combination.
 * The combination is only the value of cards as number. 
 * 
 * @param {Array.<Card>} cards 
 * @param {number} v 
 */
function findSum(cards, v) {
    let listOfCardToTake = [];
    let cardToTake = null;
    let takeableCards = [];

    cards.forEach(card => {
        if (v > card.val) {
            listOfCardToTake.push(card.val);
        }
    });

    cards.forEach(card => {
        if (v === card.val) {
            cardToTake = card.val;
        }
    });

    if (listOfSum(listOfCardToTake, v).length > 0) {
        takeableCards = listOfSum(listOfCardToTake, v);
    }

    if (cardToTake != null) {
        takeableCards.push([cardToTake]);
    }

    return takeableCards;
}

/**
 * 
 * @param {Array.<number>} numbers 
 * @param {number} n 
 */
function listOfSum(numbers, n) {
    let ans = [];
    const listOfCombination = combination[n] || [];
    listOfCombination.forEach(element => {
        if (element.every(r => numbers.includes(r))) {
            ans.push(element);
        }
    });
    return ans;
}

/**
 * Object contain all possible cards combination.
 */
const combination = {
    5: [[3, 2]],
    6: [[4, 2]],
    7: [[5, 2], [4, 3]],
    8: [[6, 2], [5, 3]],
    9: [[7, 2], [6, 3], [5, 4], [3, 4, 2]],
    10: [[8, 2], [7, 3], [6, 4], [5, 2, 3]],
}

/**
 * Object that contain the cards coordinates on the table
 * there are several array for 1 2 3 and so on cards quantity
 */
const tablePosition = {
    1: [{ x: 375, y: 200 }],
    2: [{ x: 310, y: 200 }, { x: 365, y: 200 }],
    3: [{ x: 265, y: 200 }, { x: 320, y: 200 }, { x: 375, y: 200 }],
    4: [{ x: 265, y: 200 }, { x: 320, y: 200 }, { x: 375, y: 200 }, { x: 430, y: 200 }],
    5: [],
    6: [],
    7: [],
    8: [],
    9: [],
    10: [],
}

export { checkClickOnCard, findSum, getCoordinateOfCardsCombination }
