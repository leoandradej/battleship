const Player = require('./player');

describe('Player', () => {
    it('should create a player with correct name and empty hits/sunkShips', () => {
      const player = new Player('player1');
      expect(player.name).toBe('player1');
      expect(player.hits).toEqual([]);
      expect(player.sunkShips).toEqual([]);
    });
  });