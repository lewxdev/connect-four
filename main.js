let game = {
    board: {
        dimensions: {
            width: 8, // Max: 10
            height: 6
        },
        literal: []
    },
    end: 0,
    turn: 0,
    turnCount: 0,
    turnChange: () => game.turn = game.turn === 0 ? 1 : 0,
    evaluate: (x, y) => {
        function horz(x, y) {
            let seq = [];
            seq.push(board[x][y]);
            for (let x2 = x + 1; x2 < board.length; x2++) seq.push(board[x2][y]);
            for (let x2 = x - 1; x2 >= 0; x2--) seq.unshift(board[x2][y]);
            return seq;
        }

        function vert(x) {
            return board[x]
        };

        function pos(x, y) {
            let seq = [];
            seq.push(board[x][y]);
            for (let x2 = x + 1, y2 = y + 1; x2 < board.length && y2 < board[x2].length; x2++, y2++) seq.push(board[x2][y2]);
            for (let x2 = x - 1, y2 = y - 1; x2 >= 0 && y2 >= 0; x2--, y2--) seq.unshift(board[x2][y2]);
            return seq;
        }

        function neg(x, y) {
            let seq = [];
            seq.push(board[x][y]);
            for (let x2 = x - 1, y2 = y + 1; x2 >= 0 && y2 < board[x2].length; x2--, y2++) seq.push(board[x2][y2]);
            for (let x2 = x + 1, y2 = y - 1; x2 < board.length && y2 >= 0; x2++, y2--) seq.unshift(board[x2][y2]);
            return seq;
        }
        let execute = [
            horz(x, y), vert(x), pos(x, y), neg(x, y)
        ];
        let str = '';
        for (let i = 0; i < execute.length; i++) {
            str += execute[i].join('');
            if (i !== execute.length - 1) str += '/';
        }
        return str;
    }
};
const board = game.board.literal,
    boardHeight = game.board.dimensions.height,
    boardWidth = game.board.dimensions.width;
for (let i = 0; i < boardWidth; i++) board.push([]);

document.body.addEventListener('keyup', (e) => {
    if (!game.end) {
        let key,
            comp = ['0000', '1111'];
        if (e.keyCode >= 48 && e.keyCode <= 57) {
            for (let i = 0; i < 10; i++) {
                key = e.keyCode === i + 49 ? i : undefined;
                if (typeof key === 'undefined') key = 9;
                else break;
            }
            if (key < boardWidth && board[key].length < boardHeight) board[key].push(game.turn), game.turnCount++;
            if (game.turnCount >= 4)
                if (game.evaluate(key, board[key][board[key].length - 1]).includes(comp[game.turn])) {
                    console.log('Player ' + (game.turn + 1) + ' Won.'), game.end = 1;
                } else game.turnChange();
            else game.turnChange();
        }
    }
});