// NUMBER SETUP.
// Object of pair-value (x, y) where 'x' is the key and 'y' the value. 'x' represents a number that can be drawn and 'y' the number of time this number can be drawn.
const AVAILABLE_NUMBERS = {
    1: 20,
    2: 20,
    3: 20,
    4: 20,
    5: 20,
    6: 20,
    7: 20,
    8: 20,
    9: 20,
    10: 20,
    25: 4,
    50: 4,
    75: 4,
    100: 4,
}

// Init the pouch of numbers
var NUMBERS = [];
for (const n in AVAILABLE_NUMBERS) {
    NUMBERS.push(...Array(AVAILABLE_NUMBERS[n]).fill(n));
}

/**
 * Function shuffling an array of number
 * @param {Number[]} arr array of numbers to shuffle. No effect on arr after the function
 * @returns A new shuffled array of number
 */
function shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
}

/**
 * Function to get 6 random number from the pouch
 * @returns An array containing 6 numbers
 */
function getRandomNumberCard() {
    const pouch = shuffle(NUMBERS);
    // Get first 6 element of suffled array
    return pouch.slice(0, 6);
}

function add(a, b) {
    let r = parseInt(a) + parseInt(b);
    return [r, `${a} + ${b} = ${r}`];
}

function sub(a, b) {
    let r = parseInt(a) - parseInt(b);
    return [r, `${a} - ${b} = ${r}`];
}

function mult(a, b) {
    let r = parseInt(a) * parseInt(b);
    return [r, `${a} x ${b} = ${r}`];
}

function div(a, b) {
    let r = parseInt(a) / parseInt(b);
    return [r, `${a} / ${b} = ${r}`];
}

/**
 * Function that calculate a possible solution using pair of number and an operator
 * @param {Number[]} arr An array of numbers
 * @returns A number that can be obtain using elementary operations and the given numbers
 */
function getPossibleResult(arr) {
    // Define possible operations
    const OPERATIONS = [add, sub, mult, div];

    // Init array of number
    let n = shuffle(arr);
    let findSoluce = false;
    let equations = [];

    // Loop until there is a possible solution using all numbers of n
    while (!findSoluce) {
        let calculusOk = false;
        let x = 0;

        // Loop until the calculus being made is valid
        // the solution x of calculus is valid only if x € N1
        while (!calculusOk) {
            a = n.pop()
            b = n.pop()
            let op = OPERATIONS[Math.floor(Math.random() * 4)]

            x = op(a, b);
            // Check if x is valid
            // If not valid put pop numbers back to n
            if (x > 0 && x % 1 === 0) {
                equations.push(`${a} ${op.name} ${b}`);
                calculusOk = true;
            }
            else {
                n.push(b, a);
            }
        }

        n.push(x);
        n = shuffle(n);
        if (n.length === 1) {
            findSoluce = true;
        }
    }

    return n[0]
}


/**
 * 
    Function SOLUCE_FINDER(arr, number) return a node
        nodes <- [{
            elements : arr,
            equations : []
        }]
        queue <- [nodes[0]]
        temp_delta <- ABS(MAX(arr) - number)
        operations <- [ADD, SUB, (a,b) => SUB(b,a), MULT, DIV, (a,b) => DIV(b,a)]
        best_node <- nodes[0]
        WHILE NOT EMPTY(queue) DO
            node <- SHIFT(queue)
            a <- SHIFT(node.elements)
            FOR i <- 0 to LENGTH(node.elements) DO
                b <- node.elements[i]
                FOR ALL op in operations DO
                    result, eq = op(a, b) // Return a result and the detail of the operation
                    IF IS_INTEGER(result) and result > 0 THEN
                        new_elements <- [all x of node.elements exept node.elements[i], result]
                        new_equation <- [all x of node.equations, eq]
                        new_node = {
                            elements : new_elements,
                            equations : new_equation
                        }

                        max_count <- MAX(new_elements)
                        delta <- ABS(max_count - number)
                        IF delta < temp_delta THEN
                            temp_delta <- delta
                            best_node <- new_node

                        IF max_count = number THEN
                            return new_node // This is the solution

                        IF LENGTH(new_node.elements) > 1 THEN
                            queue <- APPENDS(new_node, queue) // Add node at the end of queue
       
                        nodes <- APPENDS(node, nodes) // appening node to nodes
        RETURN best_node
 */

function soluceFinder(arr, number) {
    const OPERATIONS = [add, sub, (a, b) => sub(b, a), mult, div, (a, b) => div(b, a)];

    let nodes = [{
        elements : arr,
        equations : []
    }];
    let queue = [nodes[0]];
    let temp_delta = Math.abs(Math.max(...arr) - number);
    let best_node = nodes[0];
    
    while (queue.length > 0) {
        let node = queue.shift();
        let a = node.elements[0];
        for (let i = 1; i < node.elements.length; i++) {
            let b = node.elements[i];
            for (let op of OPERATIONS) {
                let [ result, eq ] = op(a, b);
                if (result > 0 && result % 1 === 0) {
                    let newElements = []
                    for (let q = 1; q < node.elements.length; q++) {
                        if (q !== i) {
                            newElements.push(node.elements[q]);
                        }
                    }
                    newElements.push(result);

                    let newNode = {
                        elements : newElements,
                        equations : [...node.equations, eq]
                    }

                    let max_count = Math.max(...newElements);

                    let delta = Math.abs(max_count - number);
                    if(delta < temp_delta){
                        temp_delta = delta;
                        best_node = newNode;
                    }

                    if(max_count === number){
                        return newNode;
                    }

                    if(newNode.elements.length > 1){
                        queue.push(newNode);
                    }

                    nodes.push(newNode);
                }
            }
        }
    }
    return best_node;
}