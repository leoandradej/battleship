/**
 * @jest-environment jsdom
 */


const Gameboard = require('./gameBoard');
const Player = require('./player');
const Ship = require('./ship');

describe('Gameboard', () => {
  let gameboard;

  beforeEach(() => {
  document.body.innerHTML = `
    <div data-gameboards-container>
      <div id="player">
        ${Array.from({ length: 100 }, (_, i) => `<div class="cell" id="${i}"></div>`).join('')}
      </div>
      <div id="computer">
        ${Array.from({ length: 100 }, (_, i) => `<div class="cell" id="${i}"></div>`).join('')}
      </div>
    </div>
    <div data-display-info></div>
  `;
  gameboard = new Gameboard(true); // pass true for "test mode"

});


  describe('createGameboard', () => {
    it('should create two gameboards with 100 cells each', () => {
      const playerBoard = document.getElementById('player');
      const computerBoard = document.getElementById('computer');

      expect(playerBoard).not.toBeNull();
      expect(computerBoard).not.toBeNull();
      expect(playerBoard.children.length).toBe(100);
      expect(computerBoard.children.length).toBe(100);
    });
  });

  describe('placeShip', () => {
    it('should place a ship horizontally for player', () => {
        document.body.innerHTML = `
          <div data-gameboards-container>
            <div id="player">
              ${Array.from({ length: 100 }, (_, i) => `<div class="cell" id="${i}"></div>`).join('')}
            </div>
            <div id="computer">
              ${Array.from({ length: 100 }, (_, i) => `<div class="cell" id="${i}"></div>`).join('')}
            </div>
          </div>
          <div data-display-info></div>
        `;
      
        const gameboard = new Gameboard(true); // prevent overwriting manual DOM
        const ship = new Ship('destroyer', 2);
        gameboard.angle = 0; // force horizontal
        const startId = 5; // a valid horizontal start
      
        gameboard.placeShip('player', ship, startId);
      
        const playerCells = document.querySelectorAll('#player div');
      
        expect(playerCells[startId].classList.contains('destroyer')).toBe(true);
        expect(playerCells[startId + 1].classList.contains('destroyer')).toBe(true);
    });
      

    it('should place a ship vertically for player', () => {
        document.body.innerHTML = `
            <div data-gameboards-container>
            <div id="player">
                ${Array.from({ length: 100 }, (_, i) => `<div class="cell" id="${i}"></div>`).join('')}
            </div>
            <div id="computer">
                ${Array.from({ length: 100 }, (_, i) => `<div class="cell" id="${i}"></div>`).join('')}
            </div>
            </div>
            <div data-display-info></div>
        `;
        
        const gameboard = new Gameboard(true);
        const ship = new Ship('submarine', 3);
        gameboard.angle = 90;
        const startId = 10; // valid vertical start (10, 20, 30)
        
        gameboard.placeShip('player', ship, startId);
        
        const playerCells = document.querySelectorAll('#player div');
        
        expect(playerCells[startId].classList.contains('submarine')).toBe(true);
        expect(playerCells[startId + 10].classList.contains('submarine')).toBe(true);
        expect(playerCells[startId + 20].classList.contains('submarine')).toBe(true);
    });      
  });

  describe('checkScore', () => {
    it('should recognize when player sinks computer ship', () => {
      const displayInfo = document.querySelector('[data-display-info]');

      gameboard.player.hits = ['destroyer', 'destroyer'];
      gameboard.checkScore('player', gameboard.player.hits, gameboard.player.sunkShips);

      expect(displayInfo.textContent).toContain("YOU HAVE SUNK COMPUTER'S DESTROYER!");
      expect(gameboard.player.sunkShips).toContain('destroyer');
    });

    it('should declare player winner when all computer ships are sunk', () => {
      const displayInfo = document.querySelector('[data-display-info]');

      // Simulate sinking all ships
      gameboard.player.sunkShips = ['destroyer', 'submarine', 'cruiser', 'battleship', 'carrier'];
      gameboard.checkScore('player', [], gameboard.player.sunkShips);

      expect(displayInfo.textContent).toBe("YOU HAVE SUNK ALL COMPUTER'S SHIPS. YOU WON!");
      expect(gameboard.gameOver).toBe(true);
    });

    it('should declare computer winner when all player ships are sunk', () => {
      const displayInfo = document.querySelector('[data-display-info]');

      // Simulate computer sinking all player's ships
      gameboard.computer.sunkShips = ['destroyer', 'submarine', 'cruiser', 'battleship', 'carrier'];
      gameboard.checkScore('computer', [], gameboard.computer.sunkShips);

      expect(displayInfo.textContent).toBe('COMPUTER HAS SUNK ALL YOUR SHIPS. YOU LOSE!');
      expect(gameboard.gameOver).toBe(true);
    });
  });
});
