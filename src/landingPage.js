import Gameboard from './gameBoard';
import Ship from './ship';

const destroyer = new Ship('destroyer', 2);
const submarine = new Ship('submarine', 3);
const cruiser = new Ship('cruiser', 3);
const battleship = new Ship('battleship', 4);
const carrier = new Ship('carrier', 5);

const initializePage = () => {
    const gameBoard = new Gameboard(10);

    const flip = () => {
        const shipsContainer = document.querySelector('[data-ships]');
        const shipsOptions = Array.from(shipsContainer.children);
        gameBoard.angle = gameBoard.angle === 0 ? 90 : 0;
        shipsOptions.forEach(ship => ship.style.transform = `rotate(${gameBoard.angle}deg)`);
    }

    const rotateBtn = document.querySelector('.rotate-ship');

    rotateBtn.addEventListener('click', flip);

    const ships = [destroyer, submarine, cruiser, battleship, carrier];
    ships.forEach(ship => gameBoard.placeShip(gameBoard.computer.name, ship));

    const dragStart = (e) => {
        gameBoard.notDropped = false;
        gameBoard.draggedShip = e.target;
    }

    const dragOver = (e) => {
        e.preventDefault();
    }

    const dropShip = (e) => {
        const startId = e.target.id;
        const ship = ships[gameBoard.draggedShip.id];
        gameBoard.placeShip(gameBoard.player.name, ship, startId);
        if (!gameBoard.notDropped) {
            gameBoard.draggedShip.remove();
        }
    }

    const shipsOptionsContainer = document.querySelector('[data-ships-container]');
    const shipsOptions = Array.from(shipsOptionsContainer.children);
    shipsOptions.forEach(shipOption => shipOption.addEventListener('dragstart', dragStart));

    const playersGrid = document.querySelectorAll(`#${gameBoard.player.name} div`);
    playersGrid.forEach(cell => {
        cell.addEventListener('dragover', dragOver);
        cell.addEventListener('drop', dropShip);
    });

    const computerTurn = () => {
        const displayInfo = document.querySelector('[data-display-info]');
        const turnInfo = document.querySelector('[data-display-turn]');

        if (!gameBoard.gameOver) {
            turnInfo.textContent = 'Computers Turn';
            displayInfo.textContent = 'The Computer is thinking...';

            setTimeout(() => {
                let randomMove = Math.floor(Math.random() * gameBoard.gridCellSize * gameBoard.gridCellSize);
                const playersGrid = document.querySelectorAll('#player div');
            
                if (playersGrid[randomMove].classList.contains('taken') && playersGrid[randomMove].classList.contains('boom')) {
                    computerTurn();
                    return;
                } else if (playersGrid[randomMove].classList.contains('taken') && !playersGrid[randomMove]. classList.contains('boom')) {
                    playersGrid[randomMove].classList.add('boom');
                    displayInfo.textContent = 'The Computer hit your ship!';
                    let cellClasses = Array.from(playersGrid[randomMove].classList);
                    gameBoard.computer.hits.push(...cellClasses.filter(className => className !== 'cell' && className !== 'taken' && className !== 'boom'));
                    gameBoard.checkScore(gameBoard.computer.name, gameBoard.computer.hits, gameBoard.computer.sunkShips);
                } else {
                    displayInfo.textContent = 'Nothing hit this time.';
                    playersGrid[randomMove].classList.add('miss');
                }
            }, 3000);

            setTimeout(() => {
                gameBoard.playerTurn = true;
                turnInfo.textContent = 'Your Turn!';
                displayInfo.textContent = 'Please make your move.';
                const computersGrid = document.querySelectorAll('#computer div');
                computersGrid.forEach(cell => cell.addEventListener('click', handleAttack)) 
            }, 6000)
        }
    }

    const handleAttack = (e) => {
        const displayInfo = document.querySelector('[data-display-info]');

        if (!gameBoard.gameOver) {
            if (e.target.classList.contains('taken')) {
                e.target.classList.add('boom');
                displayInfo.textContent = 'You hit the Computers ship!';
                let cellClasses = Array.from(e.target.classList);
                gameBoard.player.hits.push(...cellClasses.filter(className => className !== 'cell' && className !== 'taken' && className !== 'boom'));
                gameBoard.checkScore(gameBoard.player.name, gameBoard.player.hits, gameBoard.player.sunkShips);
                console.log('gb-hits', gameBoard.player.hits);
                console.log('gb-sunk', gameBoard.player.sunkShips);
            }
        }
        if (!e.target.classList.contains('taken')) {
            displayInfo.textContent = 'Nothing hit this time.';
            e.target.classList.add('miss');
        }
        gameBoard.playerTurn = false;
        const computersGrid = document.querySelectorAll('#computer div');
        computersGrid.forEach(cell => cell.replaceWith(cell.cloneNode(true)));
        setTimeout(computerTurn, 3000);
    }

    const startGame = () => {
        if (gameBoard.playerTurn === undefined) {
            const shipsContainer = document.querySelector('[data-ships]');
            const displayInfo = document.querySelector('[data-display-info]');
            const turnInfo = document.querySelector('[data-display-turn]');
            if (shipsContainer.children.length != 0) {
                displayInfo.textContent = 'Please place all your ships first!';
            } else {
                const computersGrid = document.querySelectorAll('#computer div');
                computersGrid.forEach(cell => cell.addEventListener('click', handleAttack));
                gameBoard.playerTurn = true;
                turnInfo.textContent = 'Your Turn!';
                displayInfo.textContent = 'The Game has Started';
            }
        }
    }

    const startBtn = document.querySelector('.start-btn');

    startBtn.addEventListener('click', startGame);
}

export default initializePage;