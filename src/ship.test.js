const Ship = require('./ship');

describe('Ship', () => {
  it('should create a ship with correct name and length', () => {
    const destroyer = new Ship('destroyer', 2);
    expect(destroyer.name).toBe('destroyer');
    expect(destroyer.length).toBe(2);
  });
});