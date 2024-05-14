const Ship = require('./ship');

describe('#hit', () => {
    test('it increases the hits of a ship', () => {
        const destroyer = new Ship('destroyer', 2);
        destroyer.hit('destroyer');

        expect(destroyer.hits.length).toBe(1);
    })
})

describe('#isSunk', () => {
    test('it evaluates if a ship is sunk', () => {
        const destroyer = new Ship('destroyer', 2);
        destroyer.hit('destroyer');
        destroyer.hit('destroyer');
        destroyer.isSunk();

        expect(destroyer.sunk).toBe(true);
    })
})