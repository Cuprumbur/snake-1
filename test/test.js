var LeeAlgorithm = require("../src/leeAlgorithm");
var assert = require('assert');
// let Figures =
// {
// StartPosition: 0,
// EmptySpace: -1,
// Destination: -2,
// Path: -3,
// Barrier: -4,
// }

describe('Array', function () {
    describe('#indexOf()', function () {
        it('find path', function () {
            var array = [
                [-1, -1, -1],
                [-2, -1, -1],
                [-1, -1, 0]
            ];

            let t = new LeeAlgorithm(array)
            console.log(t.Path);
            assert.equal(true, t.PathFound);
            assert.equal(4, t.Path.length);
        });

        it('find path', function () {
            var array = [
                [-1, -1, -1],
                [-1, -1, -2],
                [0, -1, -1]
            ];

            let t = new LeeAlgorithm(array)
            console.log(t.Path);
            assert.equal(true, t.PathFound);
            assert.equal(4, t.Path.length);
        });

        it('no finded path', function () {
            var array = [
                [-4, -1, -1],
                [-1, -4, -2],
                [0, -1, -4]
            ];

            let t = new LeeAlgorithm(array)
            assert.equal(false, t.PathFound);
        });
    });
});
