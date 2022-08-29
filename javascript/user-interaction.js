/**
 * @param {*} e 
 * @param {*} maxCard The maximum number of card of this type than can be present in the equations board
 * @param {*} className The class name that the new element will have in the equation board (Can be either 'card' or 'user-equation-op)
 */
const onCardClick = (e, maxCard, className) => {

    const element = e.currentTarget;
    const userEquationElement = document.getElementsByClassName('user-equation')[0];

    // Double check, is el disabled ?
    if(element.classList.contains('disabled')){
        return;
    }

    // Not more than 2 number cards selected
    const userEquationChildren = userEquationElement.children;
    let nbCards = 0;

    for(let child of userEquationChildren){
        if(child.classList.contains(className)){
            nbCards++;
        }
    }
    
    if(nbCards < maxCard){
        // Add copy of node to user-equation element
        let newElement = element.cloneNode(true);
        newElement.onclick = (e) => onEquationCardClick(e, {el : element, fc : (e) => onCardClick(e, maxCard, className)});
        newElement.classList.add(className);

        // Put element in correct order -> number - op - number (There are probably better ways to do it)
        // Only works for single operation
        let firstChild = userEquationElement.children[0]
        if(firstChild){
            if(firstChild.classList.contains('card')){
                if(className === 'user-equation-op' && userEquationElement.children.length === 2){
                    userEquationElement.insertBefore(newElement, firstChild.nextSibling);
                }
                else{
                    userEquationElement.appendChild(newElement);
                }
            }
            else{
                userEquationElement.insertBefore(newElement, firstChild);
            }
        }
        else{
            userEquationElement.appendChild(newElement);
        }
        
        // Disabled element node
        element.classList.toggle('disabled');
        // If operation card, leave the onclik function
        if(className !== 'user-equation-op'){
            element.onclick = null;
        }
    }
}

const onEquationCardClick = (e, { el, fc }) => {
    const element = e.currentTarget;

    // Remove element from parent
    const parent = element.parentNode;
    parent.removeChild(element);

    // Enabled twin node
    el.classList.toggle('disabled');
    el.onclick = fc;
}

const onEqualClick = () => {
    const userEquationElement = document.getElementsByClassName('user-equation')[0]
    const children = userEquationElement.children;
    let a = children[0].dataset.value;
    let op = children[1].dataset.value;
    let b = children[2].dataset.value;
    [result, eq ] = window[op](a, b)
    
    // Is result valid ?
    if (result > 0 && result % 1 === 0) {
        // Is the number found
        let found = false;
        if(result == document.getElementsByClassName('number-to-found')[0].innerHTML){
            const resetButton = document.getElementsByClassName('reset-button')[0];
            resetButton.classList.toggle('give-up');
            resetButton.innerHTML = '<p>Rejouer<p>'
            found = true;
        }

        // Display eq on equation-list
        const equationListElement = document.getElementsByClassName('equation-list')[0];
        let newEqElement = document.createElement('p');
        if(found){
            newEqElement.classList.toggle('winning-eq');
        }
        newEqElement.innerHTML = eq;
        equationListElement.appendChild(newEqElement);

         // Add result card to number-cards
        const numberCardsElement = document.getElementsByClassName('number-cards')[0];
        let newNumberCard = document.createElement('div');
        newNumberCard.classList.add('card');
        newNumberCard.dataset.value = result;
        newNumberCard.onclick = (e) => onCardClick(e, 2, 'card');
        newNumberCard.innerHTML = '<p>' + result + '</p>';
        numberCardsElement.appendChild(newNumberCard);

        // Remove elements from user-equation
        for(let child of [...children]){
            userEquationElement.removeChild(child);
        }

        // Update number-cards
        const disabledElements = document.getElementsByClassName('disabled');
        for(let el of [...disabledElements]){
            let i = 0;
            while(i < numberCardsElement.children.length && !numberCardsElement.children[i].isEqualNode(el)){
                i++;
            }

            if(i !== numberCardsElement.children.length){
                numberCardsElement.removeChild(el);
            }
            else{
                // This is the operation card
                el.classList.toggle('disabled');
            }
        }
    }
    else{
        throw 'invalid equation';
    }
}

const onGiveUp = (e, equations) => {
    const element = e.currentTarget;
    let equationsListElement = document.getElementsByClassName('equation-list')[0];

    // Show solution
    for(let eq of equations){
        let para = document.createElement('p');
        para.innerHTML = eq;
        equationsListElement.appendChild(para);
    }

    // Display replay button
    element.classList.toggle('give-up');
    element.innerHTML = '<p>Rejouer<p>'
    element.onclick = (e) => resetGame(e);
}

const resetGame = () => {
    const element = document.getElementsByClassName('reset-button')[0];
    let numberCardsElement = document.getElementsByClassName('number-cards')[0];
    let equationsListElement = document.getElementsByClassName('equation-list')[0];

    // Remove all elements
    for(let child of [...numberCardsElement.children]){
        numberCardsElement.removeChild(child)   
    }

    for(let child of [...equationsListElement.children]){
        equationsListElement.removeChild(child)   
    }

    // Generated new game
    [rnd, numbers, equations] = getNewGame();

    // Display give up button
    element.classList.toggle('give-up');
    element.innerHTML = '<p>Abandonner<p>'
    element.onclick = (e) => onGiveUp(e, equations);

    // Return number to found, numbers to use and solution
    return [rnd, numbers, equations];
}

const getNewGame = () => {
    let numberCardsElement = document.getElementsByClassName('number-cards')[0];

    // Fill number-cards
    var numbers = getRandomNumberCard();
    for(let n of numbers){
        let node = document.createElement('div');
        node.classList.add('card')
        node.dataset.value = n;
        node.onclick = (e) => onCardClick(e, 2, 'card');
        node.innerHTML = '<p>' + n + '</p>'
        numberCardsElement.appendChild(node)
    }

    // Put value to find
    var rnd = Math.floor(Math.random() * 999) + 1;
    var { elements, equations } = soluceFinder(numbers, rnd);
    if(!elements.includes(rnd)){
        rnd = elements[elements.length - 1];
    }
    document.getElementsByClassName('number-to-found')[0].innerHTML = rnd
    return [rnd, numbers, equations]
}