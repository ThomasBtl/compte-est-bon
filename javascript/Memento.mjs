/**
 * Class that save a game at a given time
 * The state of the game follow this structure :
 * state = {
 *      elements : number[],
 *      equations : string[]
 * }
 * Where 
 *  state.elements is an array of number containing the available cards to used.
 *  state.equation is an array of string containing the already made equations.
 */
export class Memento{
    /**
     * @param {any} state The state of the game
     */
    constructor(state){
        if(this.#checkState(state)){
            this.state = state
        }
    }

    /**
     * Check if a state parameters is valid or not
     * @param {any} state The state parameter
     * @throw Will throw an error if the state is not correct
     * @returns {boolean} True if the state parameter is correct ; Throw en exception otherwise
     */
    #checkState(state){
        if(state === null || typeof state !== 'object' || Array.isArray(state)){
            throw 'Memento - #checkState - Invalid state parameter, state must be an object';
        }
        if(!Array.isArray(state.elements) || state.elements.some(x => typeof x !== 'number')){
            throw 'Memento - #checkState - state.elements must be an Array of number';
        }
        if(!Array.isArray(state.equations) || state.equations.some(eq => typeof eq !== 'string')){
            throw 'Memento - #checkState - state.equations must be an Array of string';
        }
        return true;
    }
}

/**
 * Class that keep track of the game state history
 */
export class Caretaker{

    #mementoes = []; // A list of mementoes

    /**
     * Add a new memento to the caretaker
     * @param {*} memento 
     */
    add(memento){
        this.#mementoes.push(memento);
    }

    /**
     * Get the last element of the state
     * @returns {Memento} A memento corresponding to the last state of the game
     */
    get(){
        return this.#mementoes.pop();
    }
}