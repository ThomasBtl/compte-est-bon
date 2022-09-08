import { Game } from './Game.mjs';
import { Memento, Caretaker } from './Memento.mjs';

//#region initialization

var toFindElement = document.getElementsByClassName('number-to-found')[0];
var numberCardsElement = document.getElementsByClassName('number-cards')[0];
var userEquationElement = document.getElementsByClassName('user-equation')[0];
var equationListElement = document.getElementsByClassName('equation-list')[0];
var opElements = document.getElementsByClassName('op-box');
var binElement = document.getElementsByClassName('bin-box')[0];
var equalElement = document.getElementsByClassName('equal-box')[0];
var resetButtonElement = document.getElementsByClassName('reset-button')[0];
var undoButton = document.getElementsByClassName('undo-button')[0];

let [currentGame, caretaker] = reset();

//#endregion

//#region handler

function onCardClick(e) {
    const element = e.currentTarget;

    // Copy node
    let eqNode = element.cloneNode(true);
    eqNode.onclick = (e) => onRemoveEqElement(e, element, 'eq');

    if (element.classList.contains('card')) {
        if (userEquationElement.getElementsByClassName('card').length !== 2) {
            // Place node in user-equation
            placeEqElement(eqNode, 'card');

            // Disable element
            element.classList.toggle('disabled');
            element.onclick = (e) => onRemoveEqElement(e, eqNode, 'body');
        }
    }
    else {
        if (userEquationElement.getElementsByClassName('user-equation-op').length !== 1) {
            // Place node in user-equation
            placeEqElement(eqNode, 'op');
            eqNode.classList.add('user-equation-op');

            // Disable element
            element.classList.toggle('disabled');
            element.onclick = (e) => onRemoveEqElement(e, eqNode, 'body');
        }
    }
}

/**
 * @param {Event} e 
 * @param {HTMLElement} twin An HTMLElement link to the e.currentTarget
 * @param {string} from A string specifying from where does the event come from exactly ; either 'body' or 'eq'
 */
function onRemoveEqElement(e, twin, from) {

    let listElement = null;
    let eqElement = null;

    if (from === 'eq') {
        listElement = twin;
        eqElement = e.currentTarget;
    }
    else {
        listElement = e.currentTarget;
        eqElement = twin;
    }

    // Remove element from parent
    const parent = eqElement.parentNode;
    parent.removeChild(eqElement);

    // Enabled twin node
    listElement.classList.toggle('disabled');
    listElement.onclick = (e) => onCardClick(e);

}

/**
 * Click on the bin button
 */
function onCleanEq() {
    // Remove from user-equation
    for (let child of [...userEquationElement.children]) {
        userEquationElement.removeChild(child)
    }

    // Enable all disabled button
    let disabledElements = document.getElementsByClassName('disabled');
    for (let el of [...disabledElements]) {
        el.onclick = (e) => onCardClick(e);
        el.classList.toggle('disabled');
    }
}

function onEqualClick() {
    const eqElements = userEquationElement.children;

    // Is equation incomplete
    if (eqElements.length < 3) {
        return;
    }

    let previousState = Object.assign({}, currentGame.getState());

    let a = eqElements[0].dataset.value;
    let op = eqElements[1].dataset.value;
    let b = eqElements[2].dataset.value;
    let [r, eq, found] = currentGame.operate(op, a, b);

    if (r !== -1) {
        // Is the number found
        if (found) {
            const resetButton = document.getElementsByClassName('reset-button')[0];
            resetButton.onclick = (e) => onResetGame(e);
            resetButton.classList.toggle('give-up');
            resetButton.innerHTML = '<p>Rejouer<p>'
        }

        // Display eq on equation-list
        let newEqElement = document.createElement('p');
        if (found) {
            newEqElement.classList.toggle('winning-eq');
        }
        newEqElement.innerHTML = eq;
        equationListElement.appendChild(newEqElement);

        // Add result card to number-cards
        let newNumberCard = createNumberCard(r);
        numberCardsElement.appendChild(newNumberCard);

        // Update number-cards
        for (let child of [...numberCardsElement.children]) {
            numberCardsElement.removeChild(child);
        }

        for (let n of currentGame.cards) {
            let card = createNumberCard(n);
            numberCardsElement.appendChild(card);
        }

        // Remove elements from user-equation
        onCleanEq();

        caretaker.add(new Memento(previousState));
    }
    else {
        popAlert(`Opération invalide. Seul les opérations donnant des résultats ≥ 0 sont valides`, 'error')
    }
}

function onGiveUp(e) {
    const element = e.currentTarget;

    // Remove element from equation-list
    for (let child of [...equationListElement.children]) {
        equationListElement.removeChild(child);
    }

    // Show solution
    for (let eq of currentGame.solution.equations) {
        let para = document.createElement('p');
        para.innerHTML = eq;
        equationListElement.appendChild(para);
    }

    // Display replay button
    element.classList.toggle('give-up');
    element.innerHTML = '<p>Rejouer<p>'
    element.onclick = (e) => onResetGame(e);
}

function onResetGame(e) {
    const element = e.currentTarget;

    // Remove all elements
    for (let child of [...numberCardsElement.children]) {
        numberCardsElement.removeChild(child)
    }

    for (let child of [...equationListElement.children]) {
        equationListElement.removeChild(child)
    }

    // Generated new game
    [currentGame, caretaker] = reset();

    // Display give up button
    element.classList.toggle('give-up');
    element.innerHTML = '<p>Abandonner<p>'
    element.onclick = (e) => onGiveUp(e);
}

function onUndoEq() {
    const previousState = caretaker.get();

    if (previousState !== undefined) {
        currentGame.setState(previousState);

        // Redo number cards
        for (let child of [...numberCardsElement.children]) {
            numberCardsElement.removeChild(child);
        }

        for (let n of currentGame.cards) {
            let card = createNumberCard(n);
            numberCardsElement.appendChild(card);
        }

        // Redo equation list
        for (let child of [...equationListElement.children]) {
            equationListElement.removeChild(child);
        }

        for (let eq of currentGame.equations) {
            let eqElement = document.createElement('p');
            eqElement.innerHTML = eq;
            equationListElement.appendChild(eqElement)
        }
    }
    else {
        popAlert('Aucune équation précédemment éffectué', 'info');
    }
}

//#endregion

//#region utils

/**
 * Place en element in user-equation in the correct order
 * @param {HTMLElement} element The element to place
 * @param {string} [type] The type of the element to place ; either 'card' or 'op' [optional, default = 'card']
 */
function placeEqElement(element, type = 'card') {
    let firstChild = userEquationElement.children[0]
    if (firstChild) {
        if (firstChild.classList.contains('card')) {
            if (type === 'op' && userEquationElement.children.length === 2) {
                userEquationElement.insertBefore(element, firstChild.nextSibling);
            }
            else {
                userEquationElement.appendChild(element);
            }
        }
        else {
            userEquationElement.insertBefore(element, firstChild);
        }
    }
    else {
        userEquationElement.appendChild(element);
    }
}

/**
 * Create a new HTMLElement card number
 * @param {number} n The number to display
 * @returns {HTMLElement} A new card number HTMLElement
 */
function createNumberCard(n) {
    let newNumberCard = document.createElement('div');
    newNumberCard.classList.add('card');
    newNumberCard.dataset.value = n;
    newNumberCard.onclick = (e) => onCardClick(e);
    newNumberCard.innerHTML = '<p>' + n + '</p>';
    return newNumberCard
}

/**
 * Reset the game
 * @returns The game and the caretaker
 */
function reset() {
    let game = new Game(6);
    let caretaker = new Caretaker();

    toFindElement.innerHTML = game.find;

    // Fill number-cards
    for (let n of game.cards) {
        let node = createNumberCard(n);
        numberCardsElement.appendChild(node)
    }

    for (let opBox of opElements) {
        opBox.onclick = (e) => onCardClick(e);
    }

    binElement.onclick = onCleanEq;

    equalElement.onclick = onEqualClick;

    resetButtonElement.onclick = (e) => onGiveUp(e);

    undoButton.onclick = onUndoEq;

    return [game, caretaker];
}

/**
 * Open an alert window to display usefull information. Alert window is open for 8s
 * @param {string} message The message to display
 * @param {string} type The type of the message. Only 'error' and 'info' are accepted value 
 */
function popAlert(message, type) {
    try{
        const alertBox = document.getElementById('alert-box');
        const alert = createAlert(message, type);
        alertBox.appendChild(alert);
    }
    catch(e){
        console.log(e)
    }
}

/**
 * Create and alert HTMLElement
 * @param {string} message The message to display on the alert
 * @param {string} type The type of alert to pop. Either 'info' or 'error'
 * @throws Will throw an error if type is not valid
 * @retunrs An HTMLElement corresponding to an alert box of type {type} with the message {message}
 */
function createAlert(message, type){
    if (type === 'error' || type === 'info') {
        // Create alert wrapper
        let alertBox = document.createElement('div');
        alertBox.classList.add('alert', `${type}-alert`, 'animated');

        // Create alert content
        let messageBox = document.createElement('p');
        messageBox.innerHTML = `${message}`;

        let exitAlertSpan = document.createElement('span');
        exitAlertSpan.classList.add('quit-alert');
        exitAlertSpan.addEventListener('click', () => {
            alertBox.classList.toggle('animated');
        });

        alertBox.appendChild(messageBox);
        alertBox.appendChild(exitAlertSpan);

        return alertBox;
    }
    else {
        throw `userInteraction - popAlert - ${type} is not valid alert type. Only 'error' and 'info' are accepted value`;
    }
}

//#endregion