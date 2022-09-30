import { Operations } from './Operations.mjs';
import { Utils } from './Utils.mjs';
import { Memento } from './Memento.mjs';

export class Game {

    // Object of pair-value (x, y) where 'x' is the key and 'y' the value. 'x' represents a number that can be drawn and 'y' the number of time this number can be drawn.
    #AVAILABLE_NUMBER = {
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

    // This.#AVAILABLE_NUMBER, an object of pair-value (x,y), then, this.#NUMBERS is an Array containing each 'x' value 'y' times.
    #NUMBERS = Object.entries(this.#AVAILABLE_NUMBER).reduce(
        (acc, [number, occurence]) => [...acc, ...Array(occurence).fill(parseInt(number))],
        []);

    /**
     * @param {number} n The number of card to generate
     */
    constructor(n) {
        if (n < 0 || n > this.#NUMBERS.length) {
            throw `Game - constructor - the value of arg "n" is invalid. 0 < n < ${this.#NUMBERS.length}`;
        }
        this.n = n;
        this.equations = [] // List of made equations
        this.cards = this.generateCards();
        [this.find, this.solution] = this.findSolution(Math.floor(Math.random() * 999) + 1);
    }

    /**
     * Return a set of this.n number cards to play with
     * 
     * @returns {number[]} An array of number containing this.n elements
     */
    generateCards() {
        const pouch = Utils.shuffle(this.#NUMBERS);
        // Get first n element of suffled array
        return pouch.slice(0, this.n);
    }

    /*
         The algorithm is based on Breadth-first search algorithm (https://en.wikipedia.org/wiki/Breadth-first_search) except that the creation and the searching happens at the same time to prevent generating the entire tree.
         
         Each node of the tree are define as follow :
         node = {
             elements -> An array containing the cards that the algorithm can use to generated sub-result in order to get close to the solution.
             equations -> An array containing the equations that has already been made in order to have sub-result and to get close to the solution.
         }
 
         A queue is initialize with a first node containing all the cards that can be used to find a solution, and an empty array of equations
 
         The algorithm loop until the queue is empty or until a solution is found.
         The exploration of a node consist of taking all element and using the different operations at hands to generate other nodes, these new nodes are added at the end of the queue.
         If during this process, the exploration gives the number to find, then the current node is returned and no other nodes are being explored.
 
         If no node give the number to find then the best node is return. The best node is the one that has a value in node.element that is the closest to the number to find.
 
         Sidenotes : 
             1. An idea was that we append a generated node to the beginning of the queue instead of the end if this node was 'closer' to the solution than any other node already present in the queue.
                Problem -> the algoritm made useless operation before giving the solution because one of its sub-result was closer, thus was explored sooner.
                e.g.
                Find 49 with 6, 6, 7, 7, 10, 2.
                The obvious solution would be to do 7 x 7 = 49. But the algorithm returned [6 x 6 = 36, 7 x 7 = 49] because it made 6 x 6 first, obtained 36, which was closer to 49 than 7, thus exploring this node first.
                (This e.g. is based on a case that happened but did not used those numbers exactly, it is just to get the idea).
    */
    /**
     * Return a node object where 
     *   node.elements contains the cards left to used after a solution is found
     *   node.equations contains the equations that has been made to find a solution
     * 
     * @param {number} number The number the algorithm should try to find with this.cards
     * @returns {Object} The best node
     */
    findSolution(number) {
        // Array of operations that can be executed to generate sub-result.
        const OPERATIONS = [Operations.add, Operations.sub, (a, b) => Operations.sub(b, a), Operations.mult, Operations.div, (a, b) => Operations.div(b, a)];

        let nodes = [{
            elements: this.cards,
            equations: []
        }];
        let queue = [nodes[0]];
        let temp_delta = Math.abs(Math.max(...this.cards) - number);
        let best_node = nodes[0];

        while (queue.length > 0) {
            let node = queue.shift();
            let a = node.elements[0];
            for (let i = 1; i < node.elements.length; i++) {
                let b = node.elements[i];
                for (let op of OPERATIONS) {
                    let [result, eq] = op(a, b);
                    if (result > 0 && result % 1 === 0) {
                        let newElements = []
                        for (let q = 1; q < node.elements.length; q++) {
                            if (q !== i) {
                                newElements.push(node.elements[q]);
                            }
                        }
                        newElements.push(result);

                        let newNode = {
                            elements: newElements,
                            equations: [...node.equations, eq]
                        }

                        let max_count = Math.max(...newElements);

                        // Define best node
                        let delta = Math.abs(max_count - number);
                        if (delta < temp_delta) {
                            temp_delta = delta;
                            best_node = newNode;
                        }

                        if (result === number) {
                            return [number, newNode];
                        }

                        if (newNode.elements.length > 1) {
                            queue.push(newNode);
                        }

                        nodes.push(newNode);
                    }
                }
            }
        }
        return [Math.max(...best_node.elements), best_node];
    }

    /**
     * Calculate a possible solution using pair of numbers and an operator
     * @param {number[]} arr An array of numbers
     * @returns {number} A number that can be obtain using all elementary operations and the given numbers
     */
    getPossibleSolution() {
        // Define possible operations
        const OPERATIONS = [Operations.add, Operations.sub, (a, b) => Operations.sub(b, a), Operations.mult, Operations.div, (a, b) => Operations.div(b, a)];

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
     * Execute op(a,b)
     * @param {string} op A string specifying the function name
     * @param {number} a
     * @param {number} b
     * @returns {Array | number} Either an array containing the result and the equation in string format and a boolean specifying if the number has been found or not if the result of op(a,b) is valid ; -1 otherwise
     */
    operate(op, a, b){

        a = parseInt(a);
        b = parseInt(b);

        const operationsName = [
            Operations.add.name,
            Operations.sub.name,
            Operations.mult.name,
            Operations.div.name,
        ]

        if(!operationsName.includes(op)){
            throw `Game - operate - ${op} is an invalid operation. Valid operations are ${[...operationsName]}`
        }

        const [r, eq] = Operations[op](a,b);

        // Is the result valid ?
        if (r < 0 || r % 1 !== 0) {
            return [-1, undefined, undefined];
        }

        // Add equations to this.equations
        this.equations.push(eq);

        // Remove used cards
        let aIndex = this.cards.findIndex(x => x === a);
        this.cards.splice(aIndex, 1);

        let bIndex = this.cards.findIndex(x => x === b);
        this.cards.splice(bIndex, 1);

        this.cards.push(r)

        return [r, eq, r === this.find];
    }

    /**
     * @returns {Object} The current state of the game
     */
    getState(){
        return {
            elements : [...this.cards],
            equations : [...this.equations]
        }
    }

    /**
     * Set the state of the game
     * @param {Memento} state The state memento of the game
     */
    setState(memento){
        if(!(memento instanceof Memento)){
            throw 'Game - setState - Invalid state ; state must be a Memento'
        }

        this.cards = [...memento.state.elements];
        this.equations = [...memento.state.equations];
    }
}