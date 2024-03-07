function Position(i, j, player){
    this.id = player.id;
    this.i = i;
    this.j = j;
}

function Player(id, name, symbol){
    this.id = id;
    this.name = name;
    this.symbol = symbol;
    this.winRounds = 0;
    this.addWinRound = () => { this.winRounds = this.winRounds + 1; }
    this.getWinRound = () => { return this.winRounds; }
    this.resetWinRound = () => { this.winRounds = 0; }
}

function createTablero(){
    tablero = [];
    const rows = 3;
    const cols = 3;
    let container = document.getElementById("table-container");

    for(let i = 0; i < rows; i++){
        tablero[i] = [];
        let rowContainer = document.createElement('div');
        rowContainer.classList.add("row-container");
        for(let j = 0; j < cols; j++){
            let newDiv = document.createElement("div");
            newDiv.classList.add('background');
            newDiv.setAttribute("i", i);
            newDiv.setAttribute("j", j);
            tablero[i][j] = null;
            rowContainer.appendChild(newDiv);
        }
        container.appendChild(rowContainer);
    }

    let generalContainer = document.getElementById("general-container");
    generalContainer.appendChild(container);

    return {tablero, container};
}

function GameUI(tableroUI) {

    this.tableroUI = tableroUI;

    let spans = document.querySelectorAll('.top-bar span');
    let spanWinsPlayer0 = spans[0];
    let spanWinsPlayer1 = spans[1];

    this.updateWins = (player) => {
        if( player.id == 0 ){
            spanWinsPlayer0.textContent = player.getWinRound();
        }else{
            spanWinsPlayer1.textContent = player.getWinRound();
        }
    } 

    this.addPositionUI = (div, player) => {
        div.textContent = player.symbol;
    }

    this.cleanTableUI = () => {
        this.tableroUI.childNodes.forEach(rowContainer => {
            rowContainer.childNodes.forEach(div => {
                div.textContent = '';
            });
        });
    }

    this.changeRound = (message) => {  
        const modal = document.getElementById("modalChangeRound");
        const continueBtn = document.getElementById("continueRoundBtn");

        modal.style.display = "block";
        modal.querySelector('p').textContent = message;

        continueBtn.addEventListener("click", function(){
            modal.style.display = "none";
        });
    }

    this.resetGame = (message) => {
        const modal = document.getElementById("modalEndGame");
        const continueBtn = document.getElementById("playAgainBtn");

        modal.style.display = "block";
        modal.querySelector('p').textContent = message;

        continueBtn.addEventListener("click", function(){
            modal.style.display = "none";
        });
    }


}

function game(p1, p2) {
    let { tablero: tablero, container: tableroUI } = createTablero();

    let ui = new GameUI(tableroUI);
    let currentPlayer = p1;   
    let roundFinished = false;
    let totalMoves = 0;
    let totalRounds = 0;
    let gameFinished = false;


    const switchPlayer = (player1, player2) => {
        if( currentPlayer == player1 ){
            currentPlayer = player2;
        }else{
            currentPlayer = player1;
        }
    }

    const checkWinRound = (player) => {
        let result = false;
        if( (   (tablero[0][0] != null && tablero[0][0].id == player.id) &&
                (tablero[1][1] != null && tablero[1][1].id == player.id) &&
                (tablero[2][2] != null && tablero[2][2].id == player.id)    ) 
            || 
            (   (tablero[0][2] != null && tablero[0][2].id == player.id) &&
                (tablero[1][1] != null && tablero[1][1].id == player.id) &&
                (tablero[2][0] != null && tablero[2][0].id == player.id)    )
            || 
            (   (tablero[0][0] != null && tablero[0][0].id == player.id) &&
                (tablero[0][1] != null && tablero[0][1].id == player.id) &&
                (tablero[0][2] != null && tablero[0][2].id == player.id)    ) 
            ||
            (   (tablero[1][0] != null && tablero[1][0].id == player.id) &&
                (tablero[1][1] != null && tablero[1][1].id == player.id) &&
                (tablero[1][2] != null && tablero[1][2].id == player.id)    )
            ||
            (   (tablero[2][0] != null && tablero[2][0].id == player.id) &&
                (tablero[2][1] != null && tablero[2][1].id == player.id) &&
                (tablero[2][2] != null && tablero[2][2].id == player.id)    )
                || 
            (   (tablero[0][0] != null && tablero[0][0].id == player.id) &&
                (tablero[1][0] != null && tablero[1][0].id == player.id) &&
                (tablero[2][0] != null && tablero[2][0].id == player.id)    ) 
            ||
            (   (tablero[0][1] != null && tablero[0][1].id == player.id) &&
                (tablero[1][1] != null && tablero[1][1].id == player.id) &&
                (tablero[2][1] != null && tablero[2][1].id == player.id)    )
            ||
            (   (tablero[0][2] != null && tablero[0][2].id == player.id) &&
                (tablero[1][2] != null && tablero[1][2].id == player.id) &&
                (tablero[2][2] != null && tablero[2][2].id == player.id)    )
            ){
                result = true;
            }
        return result;
    }

    const getCurrentPlayer = () => {
        return currentPlayer;
    }

    const agregaMov = (pos, div) => {
        if( chequearMov(pos) ){
            //Logic 
            tablero[pos.i][pos.j] = pos;
            totalMoves++;
            //Grafic
            ui.addPositionUI(div, currentPlayer);
            
            checkGameRound();
        }else{
            console.log("Invalid position, try again");
        }
    }

    const checkGameRound = () => {
        winner = checkWinRound(currentPlayer);
        if(winner || totalMoves == 9){
            let message;
            totalRounds++;
            if(winner){
                currentPlayer.addWinRound();
                message = currentPlayer.name+" wins the rounds";
                ui.updateWins(currentPlayer);
            }else{
                message = "Round tie";
            }

            if(totalRounds == 3){
                gameFinished = true;
                if( p1.getWinRound() > p2.getWinRound() ){
                    message = p1.name+" wins the game with "+p1.getWinRound()+" rounds won";
                }else if(p1.getWinRound() < p2.getWinRound()){
                    message = p2.name+" wins the game with "+p2.getWinRound()+" rounds won";
                }else{
                    message = "Tie: "+p1.name+" = "+p1.getWinRound()+" = "+p2.name;
                }
                ui.resetGame(message);
                resetGame();
            }else{
                ui.changeRound(message);
                anotherRound();
            }

        }else{
            switchPlayer(p1,p2);
            console.log("turn of: "+currentPlayer.name);
        }
    }

    const resetGame = () => {
        for(let i = 0; i < 3; i++){
            tablero[i] = [];
            for(let j = 0; j < 3; j++){
                tablero[i][j] = null;
            }
        }
        ui.cleanTableUI();
        p1.resetWinRound();
        p2.resetWinRound();
        ui.updateWins(p1);
        ui.updateWins(p2);
        roundFinished = false;
        totalMoves = 0;
        totalRounds = 0;
        gameFinished = false;

    }

    const anotherRound = (message) => { 
        for(let i = 0; i < 3; i++){
            tablero[i] = [];
            for(let j = 0; j < 3; j++){
                tablero[i][j] = null;
            }
        }
        ui.cleanTableUI();
        totalMoves = 0;
        roundFinished = false;
        switchPlayer(p1, p2);
        console.log("Another round");
        
    }

    const chequearMov = (pos) => {
        let toReturn = false;
        if( tablero[pos.i][pos.j] == null ){ //If there is nothing on the cell, you can add a piece
            toReturn = true;
        }
        return toReturn;
    }

    const printTable = () => {
        let line = '';
        for(let i = 0; i < 3; i++ ){
            for(let j = 0; j < 3; j++){
                if( tablero[i][j] != null ){
                    line = line + " " + tablero[i][j].id + " ";
                }else{
                    line = line + " null ";
                }
            }
            console.log(line);
            line = '';
        }
    }

    const getGameFinished = () => {
        return gameFinished;
    }


    return {getGameFinished, agregaMov, chequearMov, printTable, getCurrentPlayer }

} 


const player1 = new Player(0, "Player 1", "X");
const player2 = new Player(1, "Player 2", "O");
const gamePlay = game(player1, player2); 

document.addEventListener("DOMContentLoaded", function() {

    let divs = document.querySelectorAll(".background");
    divs.forEach(function(div){
        div.addEventListener("click", function(){
            if( gamePlay.getGameFinished() == false ){
                let i = div.getAttribute('i');
                let j = div.getAttribute('j');
                let roundPlayer = gamePlay.getCurrentPlayer();
                let pos = new Position(i, j, roundPlayer);
                gamePlay.agregaMov(pos, div);
                gamePlay.printTable();
            }

        });
    });

});
