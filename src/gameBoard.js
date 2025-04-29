const Player = require("./player");

class Gameboard {
    constructor(testMode = false) {
        this.gridDimension = 100;
        this.player = new Player('player');
        this.computer = new Player('computer');
        this.angle = 0;
        this.draggedShip;
        this.notDropped;
        this.playerTurn;
        this.movesAlreadyMade = [];
        this.gameOver = false;
    
        if (!testMode) {
            this.createGameboard(this.player.name);
            this.createGameboard(this.computer.name);
        }
    }
    

    createGameboard(player) {
        const gameboardsContainer = document.querySelector('[data-gameboards-container]');
        const gameboard = document.createElement('div');
        gameboard.className = 'gameboard';
        gameboard.id = player;

        for (let i = 0; i < this.gridDimension; i++) {
            const gridCell = document.createElement('div');
            gridCell.className = 'cell';
            gridCell.id = i;
            gameboard.append(gridCell);
        }

        gameboardsContainer.append(gameboard);
    }

    placeShip(player, ship, startId) {
        const playersGrid = document.querySelectorAll(`#${player} div`);
        let randomBoolean = Math.random() < 0.5;
        let isHorizontal = player === 'player' ? this.angle === 0 : randomBoolean;
        let randomStartIndex = Math.floor(Math.random() * this.gridDimension);

        let startIndex = startId ? startId : randomStartIndex;

        let validStart = isHorizontal ? startIndex <= this.gridDimension - ship.length ? startIndex : this.gridDimension - ship.length : 
        //vertical
        startIndex <= this.gridDimension - 10 * ship.length ? startIndex : startIndex - ship.length * 10 + 10;

        let shipCells = [];

        for (let i = 0; i < ship.length; i++) {
            if (isHorizontal) {
                shipCells.push(playersGrid[Number(validStart) + i]);
            } else {
                shipCells.push(playersGrid[Number(validStart) + i * 10]);
            }
        }

        let valid;

        if (isHorizontal) {
            shipCells.every((_shipCell, index) => valid = shipCells[0].id % 10 !== 10 - (shipCells.length - (index + 1)));
        } else {
            shipCells.every((_shipCell, index) => valid = shipCells[0].id < 90 + (10 * index + 1));
        }

        const notTaken = shipCells.every(shipCell => !shipCell.classList.contains('taken'));

        if (valid && notTaken) {
            shipCells.forEach(shipCell => {
                shipCell.classList.add(ship.name);
                shipCell.classList.add('taken');
            });
            shipCells[0].classList.add('start');
            shipCells[shipCells.length - 1].classList.add('end');
            if (parseInt(shipCells[1].id) === parseInt(shipCells[0].id) + 1) {
                shipCells.forEach(shipCell => shipCell.classList.add('horizontal'));
            } else {
                shipCells.forEach(shipCell => shipCell.classList.add('vertical'));
            }
        } else {
            if (player === 'computer') this.placeShip(player, ship, startId);
            if (player === 'player') this.notDropped = true;
        }
    }

    checkScore = (player, playerHits, playerSunkShips) => {
        const displayInfo = document.querySelector('[data-display-info]');

        const checkShip = (shipName, shipLength) => {
            if (playerHits.filter(storedShipName => storedShipName === shipName).length === shipLength) {

                if (player === 'player') {
                    displayInfo.textContent = `YOU HAVE SUNK COMPUTER'S ${shipName.toUpperCase()}!`;
                    this.player.hits = playerHits.filter(storedShipName => storedShipName !== shipName);
                }
                if (player === 'computer') {
                    displayInfo.textContent = `COMPUTER HAS SUNK YOUR ${shipName.toUpperCase()}!`;
                    this.computer.hits = playerHits.filter(storedShipName => storedShipName !== shipName);
                }

                playerSunkShips.push(shipName);
            }
        }

        checkShip('destroyer', 2);
        checkShip('submarine', 3);
        checkShip('cruiser', 3);
        checkShip('battleship', 4);
        checkShip('carrier', 5);

        if (this.player.sunkShips.length === 5) {
            displayInfo.textContent = "YOU HAVE SUNK ALL COMPUTER'S SHIPS. YOU WON!";
            this.gameOver = true;
        }
        if (this.computer.sunkShips.length === 5) {
            displayInfo.textContent = 'COMPUTER HAS SUNK ALL YOUR SHIPS. YOU LOSE!';
            this.gameOver = true;
        }
    }
}

module.exports = Gameboard;