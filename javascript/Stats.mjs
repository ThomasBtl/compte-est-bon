/**
 * Class that manages the user's statistics
 * The validity of these statistics is check at each fetch to assure that the user has not been invalidating the data.
 * To check the statiscs validity we use an unique number generated based on these same stats, if the nunber does not correspond to the data, the statistics are invalided, and are being reajusted back to normal
 * 
 * sidenotes:
 *     This class is a quick way to implements tracking of user's games history, but is far from being optimal
 */
export class Stats {

    static nGames;
    static nWins;
    static uNum;

    /**
     * Method that inits the class based on the storage
     */
    static initStats(){
        const data = JSON.parse(window.localStorage.getItem('data'));

        if(data){
            this.nGames = data.nGames;
            this.nWins = data.nWins;
            this.uNum = parseInt(window.localStorage.getItem('state'));
            if(!this.checkIntegrity()){
                this.nGames = 0;
                this.nWins = 0;
                window.localStorage.setItem('state', this.#generatedStateNumber())
                console.error('Data integrity has been violated. Do not modify value inside the storage. Storage cleared');
            }
        }
        else{
            this.resetInfo();
        }

    }

    /**
     * Method that generates a number based on the save statistics
     * @returns A number corresponding the the state validy
     */
    static #generatedStateNumber(){
        let result = 17;
        result = 31 * result + this.nGames;
        result = 31 * result + this.nWins;
        return result;
    }

    /**
     * Method that saves data in storage
     */
    static #saveInfo(){
        if(this.checkIntegrity()){
            window.localStorage.setItem('data', JSON.stringify({
                nGames : this.nGames,
                nWins : this.nWins,
            }))
            window.localStorage.setItem('state', this.uNum);
        }
        else{
            this.resetInfo()
            console.error('Data integrity has been violated. Do not modify value inside the storage. Storage cleared');
        }
    }

    /**
     * Add a game to the statistics
     * @param {boolean} win A boolean value specifying if the game has been won or not
     */
    static addGames(win){
        this.nGames++;
        if(win){
            this.nWins++;
        }
        this.uNum = this.#generatedStateNumber()
        this.#saveInfo();
    }

    /**
     * Method that clears the storage
     */
    static resetInfo(){
        window.localStorage.clear();
        this.nGames = 0;
        this.nWins = 0;
        this.uNum = this.#generatedStateNumber()
        this.#saveInfo();
    }

    /**
     * Method that check the validity of the data base on uNum
     * @returns True of the state if valid, false otherwise
     */
    static checkIntegrity(){
        return this.#generatedStateNumber() === this.uNum;
    }

}