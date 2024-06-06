import Player from "./player";

class Gameboard {
    constructor(gridCellSize) {
        this.gridCellSize = gridCellSize;
        this.player = new Player('player');
        this.computer = new Player('computer');
        this.createGameboard(this.player.name);
        this.createGameboard(this.computer.name);
        this.angle = 0;
        this.draggedShip;
        this.notDropped;
        this.gameOver = false;
        this.playerTurn;
    }

    createGameboard(player) {
        const gameboardsContainer = document.querySelector('[data-gameboards-container]');
        const gameboard = document.createElement('div');
        gameboard.className = 'gameboard';
        gameboard.id = player;

        for (let i = 0; i < this.gridCellSize * this.gridCellSize; i++) {
            const gridCell = document.createElement('div');
            gridCell.className = 'cell';
            gridCell.id = i;
            gameboard.append(gridCell);
        }

        gameboardsContainer.append(gameboard);
    }

    placeShip(player, ship, startId) {
        const allGridCells = document.querySelectorAll(`#${player} div`);
        let randomBoolean = Math.random() < 0.5;
        let isHorizontal = player === 'player' ? this.angle === 0 : randomBoolean;
        let randomStartIndex = Math.floor(Math.random() * this.gridCellSize * this.gridCellSize);

        let startIndex = startId ? startId : randomStartIndex;

        let validStart = isHorizontal ? startIndex <= this.gridCellSize * this.gridCellSize - ship.length ? startIndex : this.gridCellSize * this.gridCellSize - ship.length : 
        //vertical
        startIndex <= this.gridCellSize * this.gridCellSize - this.gridCellSize * ship.length ? startIndex : startIndex - ship.length * this.gridCellSize + this.gridCellSize;

        let shipCells = [];

        for (let i = 0; i < ship.length; i++) {
            if (isHorizontal) {
                shipCells.push(allGridCells[Number(validStart) + i]);
            } else {
                shipCells.push(allGridCells[Number(validStart) + i * this.gridCellSize]);
            }
        }

        let valid;

        if (isHorizontal) {
            shipCells.every((_shipCell, index) => valid = shipCells[0].id % this.gridCellSize !== this.gridCellSize - (shipCells.length - (index + 1)));
        } else {
            shipCells.every((_shipCell, index) => valid = shipCells[0].id < 90 + (this.gridCellSize * index + 1));
        }

        const notTaken = shipCells.every(shipCell => !shipCell.classList.contains('taken'));

        if (valid && notTaken) {
            shipCells.forEach(shipCell => {
                shipCell.classList.add(ship.name);
                shipCell.classList.add('taken');
            });
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
                    displayInfo.textContent = `You have sunk computer's ${shipName}`;
                    this.player.hits = playerHits.filter(storedShipName => storedShipName !== shipName);
                }
                if (player === 'computer') {
                    displayInfo.textContent = `Computer has sunk your ${shipName}`;
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
            displayInfo.textContent = "You have sunk all computer's ships. You Won!";
            this.gameOver = true;
        }
        if (this.computer.sunkShips.length === 5) {
            displayInfo.textContent = 'Computer has sunk all your ships. You Lose!'
            this.gameOver = true;
        }
    }
}

export default Gameboard;