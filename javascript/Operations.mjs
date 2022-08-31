/**
 * Class containing operations that can be used during the game.
 * Each operation return 2 values. The first one is the result of the operation. The second one is the structure of the operation that has been made in string format.
 */
export class Operations{
    /**
     * Return a + b and the equation in string format
     * @param {number} a
     * @param {number} b 
     * @returns {Array} An array [r, eq] where r is the result of a + b and eq is the equation in string format
     */
    static add(a, b) {
        let r = parseInt(a) + parseInt(b);
        return [r, `${a} + ${b} = ${r}`];
    }
    
    /**
     * Return a - b and the equation in string format
     * @param {number} a
     * @param {number} b 
     * @returns {Array} An array [r, eq] where r is the result of a - b and eq is the equation in string format
     */
    static sub(a, b) {
        let r = parseInt(a) - parseInt(b);
        return [r, `${a} - ${b} = ${r}`];
    }
    
    /**
     * Return a * b and the equation in string format
     * @param {number} a
     * @param {number} b 
     * @returns {Array} An array [r, eq] where r is the result of a * b and eq is the equation in string format
     */
    static mult(a, b) {
        let r = parseInt(a) * parseInt(b);
        return [r, `${a} x ${b} = ${r}`];
    }
    
    /**
     * Return a / b and the equation in string format
     * @param {number} a 
     * @param {number} b != 0
     * @throw Will throw an error if b = 0
     * @returns {Array} An array [r, eq] where r the result of a / b and eq is the equation in string format.
     */
    static div(a, b) {
        if(b === 0){
            throw 'Operations - div - Cannot divide by 0';
        }
        let r = parseInt(a) / parseInt(b);
        return [r, `${a} / ${b} = ${r}`];
    }
}