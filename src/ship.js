class Ship {
    constructor(name, length) {
        this.name = name;
        this.length = length;
        this.hits = [];
        this.sunk = false;
    }

    hit(shipName) {
        this.hits.push(shipName);
    }

    isSunk() {
        if (this.hits.length === this.length) {
            this.sunk = true;
        }
    }
}

module.exports = Ship;