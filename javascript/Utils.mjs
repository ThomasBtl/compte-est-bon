/**
 * Class containing some utilities fonction.
 */
export class Utils {
    /**
     * Return a shuffle copy of arr
     * @param {number[]} arr An array of numbers
     * @returns {number[]} A new array which is a shuffle copy of arr
     */
    static shuffle(arr){
        return [...arr].sort(() => Math.random() - 0.5);
    }
}