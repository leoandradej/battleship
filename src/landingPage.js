const Gameboard = require('./gameBoard');

const playerGameboard = new Gameboard('player', 10);
const computerGameboard = new Gameboard('computer', 10);

const gameboardsContainer = document.querySelector('[data-gameboards-container]');

gameboardsContainer.append(playerGameboard.createGameboard);
gameboardsContainer.append(computerGameboard.createGameboard);

const rotateBtn = document.querySelector('.rotate-ship');

rotateBtn.addEventListener('click', playerGameboard.flip);

const startBtn = document.querySelector('.start-btn');

startBtn.addEventListener('click', playerGameboard.startGame);