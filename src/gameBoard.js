const Ship = require('./ship');

const destroyer = new Ship('destroyer', 2);
const submarine = new Ship('submarine', 3);
const cruiser = new Ship('cruiser', 3);
const battleship = new Ship('battleship', 4);
const carrier = new Ship('carrier', 5);

class Gameboard {
    constructor(player, gridCellSize) {
        this.player = player;
        this.gridCellSize = gridCellSize;
        this.angle = 0;
        this.hits = [];
        this.sunkShips = [];
        this.ships = [destroyer, submarine, cruiser, battleship, carrier];
        this.gameOver = false;
        this.playerTurn;
    }

    createGameboard() {
        const gameboard = document.createElement('div');
        gameboard.className = 'gameboard';
        gameboard.id = this.player;

        for (let i = 0; i < this.gridCellSize * this.gridCellSize; i++) {
            const gridCell = document.createElement('div');
            gridCell.className = 'cell';
            gridCell.id = i;
            gameboard.append(gridCell);
        }
    }

    flip() {
        const shipsOptionsContainer = document.querySelector('[data-ships-container]');
        const shipsOptions = Array.from(shipsOptionsContainer.children);
        this.angle = this.angle === 0 ? 90 : 0;
        shipsOptions.forEach(ship => ship.style.transform = `rotate(${this.angle}deg)`);
    }

    placeShip(player, ship, startId) {
        const allGridCells = document.querySelectorAll(`#${user} div`);
        let randomBoolean = Math.random() < 0.5;
        let isHorizontal = user === 'player' ? this.angle === 0 : randomBoolean;
        let randomStartIndex = Math.floor(Math.random() * this.gridCellSize * this.gridCellSize);

        let startIndex = startId ? startId : randomStartIndex;

        let validStart = isHorizontal ? startIndex <= this.gridCellSize * this.gridCellSize - ship.length ? startIndex : this.gridCellSize * this.gridCellSize - ship.length : startIndex <= this.gridCellSize * this.gridCellSize - this.gridCellSize * ship.length ? startIndex : startIndex - ship.length * this.gridCellSize + this.gridCellSize;

        let shipCells = [];

        for (let i = 0; i < ship.length; i++) {
            if (isHorizontal) {
                shipCells.push(allGridCells[Number(validStart) + i]);
            } else {
                shipCells.push(allGridCells[Number(validStart) + i * this.gridCellSize]);
            }
        }

        let valid;
        let notDropped;

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
            if (player === 'player') notDropped = true;
        }

        this.ships.forEach(ship => this.placeShip('computer', ship));

        let draggedShip;
        const shipsOptionsContainer = document.querySelector('[data-ships-container]');
        const shipsOptions = Array.from(shipsOptionsContainer.children);
        shipsOptions.forEach(shipOption => shipOption.addEventListener('dragstart', dragStart));

        const playersGrid = document.querySelectorAll(`#${this.player} div`);
        playersGrid.forEach(cell => {
            cell.addEventListener('dragover', dragOver);
            cell.addEventListener('drop', dropShip);
        });

        const dragStart = (e) => {
            notDropped = false;
            draggedShip = e.target;
        }

        const dragOver = (e) => {
            e.preventDefault();
        }

        const dropShip = (e) => {
            const startId = e.target.id;
            const ship = this.ships[draggedShip.id];
            this.placeShip('player', ship, startId);
            if (!notDropped) {
                draggedShip.remove();
            }
        }
    }

    startGame() {
        if (this.playerTurn === undefined) {
            const shipsContainer = document.querySelector('[data-ships]');
            const displayInfo = document.querySelector('[data-display-info]');
            const turnInfo = document.querySelector('[data-display-turn]');
            if (shipsContainer.children.length != 0) {
                displayInfo.textContent = 'Please place all your ships first!';
            } else {
                const computersGrid = document.querySelectorAll('#computer div');
                computersGrid.forEach(cell => cell.addEventListener('click', this.handleAttack));
                this.playerTurn = true;
                turnInfo.textContent = 'Your Turn!';
                infoDisplay.textContent = 'The Game has Started';
            }
        }
    }

    handleAttack(e) {
        const displayInfo = document.querySelector('[data-display-info]');
        const turnInfo = document.querySelector('[data-display-turn]');

        if (!this.gameOver) {
            if (e.target.classList.contains('taken')) {
                e.target.classList.add('boom');
                displayInfo.textContent = "You have hit computer's ship!";
                let classes = Array.from(e.target.classList);
                classes.filter(className => className !== 'cell');
                classes.filter(className => className !== 'boom');
                classes.filter(className => className !== 'taken');
                this.hits.push(...classes);
                checkScore(this.player, this.hits, this.sunkShips);
            }
        }

        if(!e.target.classList.contains('taken')) {
            displayInfo.textContent = 'Nothing hit this time.';
            e.target.classList.add('miss');
        }

        this.playerTurn = false;
        const ComputersGrid = querySelectorAll('#computer div');
        ComputersGrid.forEach(cell => cell.replaceWith(cell.cloneNode(true)));
        setTimeout(computersTurn, 3000);

        const computersTurn = () => {
            if (!this.gameOver) {
                turnInfo.textContent = "Computer's Turn";
                displayInfo.textContent = 'The Computer is thinking...';

                setTimeout(() => {
                    let randomMove = Math.floor(Math.random * this.gridCellSize * this.gridCellSize);
                    const playersGrid = document.querySelectorAll(`#${this.player} div`);
                    
                    if (playersGrid[randomMove].classList.contains('taken') && playersGrid[randomMove].classList.contains('boom')) {
                        computersTurn();
                        return;
                    } else if (playersGrid[randomMove].classList.contains('taken') && !playersGrid[randomMove].classList.contains('boom')) {
                        playersGrid[randomMove].classList.add('boom');
                        displayInfo.textContent = 'Computer has hit your ship!';
                        let classes = Array.from(playersGrid[randomMove].classList);
                        classes.filter(className => className !== 'cell');
                        classes.filter(className => className !== 'boom');
                        classes.filter(className => className !== 'taken');
                        if (this.player === 'computer') {
                            this.hits.push(...classes);
                            this.checkScore(this.player, this.hits, this.sunkShips);
                        }
                    } else {
                        displayInfo.textContent = 'Nothing hit this time.';
                        playersGrid[randomMove].classList.add('miss');
                    }
                }, 3000);

                setTimeout(() => {
                    this.playerTurn = true;
                    turnInfo.textContent = 'Your Turn!';
                    displayInfo.textContent = 'Please make your move.';
                    const computersGrid = querySelectorAll('#computer div');
                    computersGrid.forEach(cell => cell.addEventListener('click', this.handleAttack));
                }, 6000);
            }
        }
    }

    checkScore(player, playerHits, playerSunkShips) {
        const displayInfo = document.querySelector('[data-display-info]');

        const checkShip = (shipName, shipLength) => {
            if (playerHits.filter(storedShipName => storedShipName === shipName).length === shipLength) {

                if (player !== 'computer') {
                    displayInfo.textContent = `You have sunk computer's ${shipName}`;
                    playerHits = playerHits.filter(storedShipName => storedShipName !== shipName);
                }
                if (player === 'computer') {
                    displayInfo.textContent = `Computer has sunk your ${shipName}`;
                    playerHits = playerHits.filter(storedShipName => storedShipName !== shipName);
                }

                playerSunkShips.push(shipName);
            }
        }

        checkShip('destroyer', 2);
        checkShip('submarine', 3);
        checkShip('cruiser', 3);
        checkShip('battleship', 4);
        checkShip('carrier', 5);

        if (this.player !== 'computer' && this.sunkShips.length === 5) {
            displayInfo.textContent = "You have sunk all computer's ships. You Won!";
            this.gameOver = true;
        }
        if (this.player === 'computer' && this.sunkShips.length === 5) {
            displayInfo.textContent = 'Computer has sunk all your ships. You Lose!'
            this.gameOver = true;
        }
    }
}

module.exports = Gameboard;