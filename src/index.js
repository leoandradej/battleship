import initializePage from "./landingPage";

initializePage();

// const gameBoardsContainer = document.querySelector('[data-gameboards-container]')
// const optionContainer = document.querySelector('[data-option-container]')
// const flipBtn = document.querySelector('[data-flip-btn]');
// const startBtn = document.querySelector('[data-start-btn]');
// const infoDisplay = document.querySelector('[data-info-display]');
// const turnDisplay = document.querySelector('[data-turn-display]');

// let angle = 0;
// const flip = () => {
//     const optionShips = Array.from(optionContainer.children)
//     angle = angle === 0 ? 90 : 0;
//     optionShips.forEach(ship => ship.style.transform = `rotate(${angle}deg)`);
// }
// flipBtn.addEventListener('click', flip);

// const width = 10;
// const createBoard = (user) => {
//     const gameBoard = document.createElement('div');
//     gameBoard.className = 'game-board';
//     gameBoard.id = user;

//     for (let i =0; i < width * width; i++) {
//         const block = document.createElement('div');
//         block.className = 'block';
//         block.id = i;
//         gameBoard.append(block);
//     }

//     gameBoardsContainer.append(gameBoard);
// }
// createBoard('player');
// createBoard('computer');

// class Ship {
//     constructor(name, length) {
//         this.name;
//         this.length;
//     }
// }

// const destroyer = new Ship('destroyer', 2);
// const submarine = new Ship('submarine', 3);
// const cruiser = new Ship('cruiser', 3);
// const battleship = new Ship('battleship', 4);
// const carrier = new Ship('carrier', 5);

// const ships = [destroyer, submarine, cruiser, battleship, carrier];
// let notDropped;

// const addShip = (user, ship, startId) => {
//     const allBoardBlocks = document.querySelectorAll(`#${user} div`);
//     let randomBoolean = Math.random() < 0.5;
//     let isHorizontal = user === 'player' ? angle === 0 : randomBoolean;
//     let randomStartIndex = Math.floor(Math.random() * width * width);

//     let startIndex = startId ? startId : randomStartIndex;

//     let validStart = isHorizontal ? startIndex <= width * width - ship.length ? startIndex : width * width - ship.length : startIndex <= width * width - width * ship.length ? startIndex : startIndex - ship.length * width + width;

//     let shipBlocks = [];

//     for (let i = 0; i < ship.length; i++) {
//         if (isHorizontal) {
//             shipBlocks.push(allBoardBlocks[Number(validStart) + i]);
//         } else {
//             shipBlocks.push(allBoardBlocks[Number(validStart) + i * width]);
//         }
//     }

//     let valid;

//     if (isHorizontal) {
//         shipBlocks.every((_shipBlock, index) => valid = shipBlocks[0].id % width !== width - (shipBlocks.length - (index + 1)));
//     } else {
//         shipBlocks.every((_shipBlock, index) => valid = shipBlocks[0].id < 90 + (width * index + 1));
//     }

//     const notTaken = shipBlocks.every(shipBlock => !shipBlock.classList.contains('taken'));

//     if (valid && notTaken) {
//         shipBlocks.forEach(shipBlock => {
//             shipBlock.classList.add(ship.name);
//             shipBlock.classList.add('taken');
//         })
//     } else {
//         if (user === 'computer') addShip(user, ship, startId);
//         if (user === 'player') notDropped = true;
//     }
// }

// ships.forEach(ship => addShip('computer', ship));

// let draggedShip;
// const optionShips = Array.from(optionContainer.children);
// optionShips.forEach(optionShip => optionShip.addEventListener('dragstart', dragStart));

// const allPlayerBlocks = document.querySelectorAll('#player div');
// allPlayerBlocks.forEach(playerBlock => {
//     playerBlock.addEventListener('dragover', dragOver);
//     playerBlock.addEventListener('drop', dropShip);
// })

// const dragStart = (e) => {
//     notDropped = false;
//     draggedShip = e.target;
// }

// const dragOver = (e) => {
//     e.preventDefault();
// }

// const dropShip = (e) => {
//     const startId = e.target.id;
//     const ship = ships[draggedShip.id];
//     addShip('player', ship, startId);
//     if (!notDropped) {
//         draggedShip.remove();
//     }
// }

// let gameOver = false;
// let playerTurn;

// const startGame = () => {
//     if (playerTurn === undefined) {
//         if (optionContainer.children.length != 0) {
//             infoDisplay.textContent = 'Please place all your pieces first!';
//         } else {
//             const allBoardBlocks = document.querySelectorAll('#computer div');
//             allBoardBlocks.forEach(block => block.addEventListener('click', handleClick));
//             playerTurn = true;
//             turnDisplay.textContent = 'Your Turn!';
//             infoDisplay.textContent = 'The Game has Started!';
//         }
//     }   
// }

// startBtn.addEventListener('click', startGame);

// let playerHits = [];
// let computerHits = [];
// const playerSunkShips = [];
// const computerSunkShips = [];

// const handleClick = (e) => {
//     if (!gameOver) {
//         if (e.target.classList.contains('taken')) {
//             e.target.classList.add('boom');
//             infoDisplay.textContent = 'You hit the computers ship!';
//             let classes = Array.from(e.target.classList);
//             classes.filter(className => className !== 'block');
//             classes.filter(className => className !== 'boom');
//             classes.filter(className => className !== 'taken');
//             playerHits.push(...classes);
//             checkScore('player', playerHits, playerSunkShips);
//         }
//     }
//     if (!e.target.classList.contains('taken')) {
//         infoDisplay.textContent = 'Nothing hit this time.';
//         e.target.classList.add('empty');
//     }
//     playerTurn = false;
//     const allBoardBlocks = document.querySelectorAll('#computer div');
//     allBoardBlocks.forEach(block => block.replaceWith(block.cloneNode(true)));
//     setTimeout(computerTurn, 3000);
// }

// const computerTurn = () => {
//     if (!gameOver) {
//         turnDisplay.textContent = 'Computers Turn';
//         infoDisplay.textContent = 'The Computer is thinking...';

//         setTimeout(() => {
//             let randomMove = Math.floor(Math.random * width * width);
//             const allBoardBlocks = document.querySelectorAll('#player div');
            
//             if (allBoardBlocks[randomMove].classList.contains('taken') && allBoardBlocks[randomMove].classList.contains('boom')) {
//                 computerTurn();
//                 return
//             } else if (allBoardBlocks[randomMove].classList.contains('taken') && !allBoardBlocks[randomMove].classList.contains('boom')) {
//                 allBoardBlocks[randomMove].classList.add('boom');
//                 infoDisplay.textContent = 'The computer hit your ship!';
//                 let classes = Array.from(allBoardBlocks[randomMove].classList);
//                 classes.filter(className => className !== 'block');
//                 classes.filter(className => className !== 'boom');
//                 classes.filter(className => className !== 'taken');
//                 computerHits.push(...classes);
//                 checkScore('computer', computerHits, computerSunkShips);
//             } else {
//                 infoDisplay.textContent = 'Nothing hit this time.';
//                 allBoardBlocks[randomMove].classList.add('empty');
//             }
//         }, 3000);

//         setTimeout(() => {
//             playerTurn = true;
//             turnDisplay.textContent = 'Your Turn!';
//             infoDisplay.textContent = 'Please make your move.';
//             const allBoardBlocks = document.querySelectorAll('#computer div');
//             allBoardBlocks.forEach(block => block.addEventListener('click', handleClick)) 
//         }, 6000)
//     }
// }

// const checkScore = (user, userHits, userSunkShips) => {

//     const checkShip = (shipName, shipLength) => {
//         if (userHits.filter(storedShipName => storedShipName === shipName).length === shipLength) {
            
//             if (user === 'player') {
//                 infoDisplay.textContent = `You sunk the computer's ${shipName}`;
//                 playerHits = userHits.filter(storedShipName => storedShipName !== shipName);
//             }
//             if (user === 'computer') {
//                 infoDisplay.textContent = `The computer sunk your ${shipName}`;
//                 computerHits = userHits.filter(storedShipName => storedShipName !== shipName);
//             }
//             userSunkShips.push(shipName);
//         }
//     }

//     checkShip('destroyer', 2);
//     checkShip('submarine', 3);
//     checkShip('cruiseer', 3);
//     checkShip('battleship',4);
//     checkShip('carrier', 5);

//     if (playerSunkShips.length === 5) {
//         infoDisplay = textContent = 'You sunk all the computers ships. You Won!';
//         gameOver = true;
//     }
//     if (computerSunkShips.length === 5) {
//         infoDisplay = textContent = 'The computer sunk all your ships. You Lose!';
//         gameOver = true;
//     }
// }