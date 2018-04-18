let game = {
    win: ['0000', '1111'],
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
        let execute = [
            (x, y) => game.board.literal[x],
            (x, y) => {
                let seq = [];
                seq.push(game.board.literal[x][y]);
                for (let x2 = x + 1; x2 < game.board.literal.length; x2++) seq.push(game.board.literal[x2][y]);
                for (let x2 = x - 1; x2 >= 0; x2--) seq.unshift(game.board.literal[x2][y]);
                return seq;
            },
            (x, y) => {
                let seq = [];
                seq.push(game.board.literal[x][y]);
                for (let x2 = x + 1, y2 = y + 1; x2 < game.board.literal.length && y2 < game.board.literal[x2].length; x2++, y2++) seq.push(game.board.literal[x2][y2]);
                for (let x2 = x - 1, y2 = y - 1; x2 >= 0 && y2 >= 0; x2--, y2--) seq.unshift(game.board.literal[x2][y2]);
                return seq;
            },
            (x, y) => {
                let seq = [];
                seq.push(game.board.literal[x][y]);
                for (let x2 = x - 1, y2 = y + 1; x2 >= 0 && y2 < game.board.literal[x2].length; x2--, y2++) seq.push(game.board.literal[x2][y2]);
                for (let x2 = x + 1, y2 = y - 1; x2 < game.board.literal.length && y2 >= 0; x2++, y2--) seq.unshift(game.board.literal[x2][y2]);
                return seq;
            }
        ];
        let str = '';
        for (let i = 0; i < execute.length; i++) {
            str += execute[i](x, y).join('');
            if (i !== execute.length - 1) str += '/';
        }
        return str;
    }
};
for (let i = 0; i < game.board.dimensions.width; i++) game.board.literal.push([]);

document.body.addEventListener('keyup', (e) => {
    if (!game.end) {
        let key;
        if (e.keyCode >= 48 && e.keyCode <= 57) {
            for (let i = 0; i < 10; i++) {
                key = e.keyCode === i + 49 ? i : undefined;
                if (typeof key === 'undefined') key = 9;
                else break;
            }
            if (key < game.board.dimensions.width && game.board.literal[key].length < game.board.dimensions.height) {
                game.board.literal[key].push(game.turn), game.turnCount++;
                if (game.turnCount >= 4)
                    if (game.evaluate(key, game.board.literal[key][game.board.literal[key].length - 1]).includes(game.win[game.turn])) {
                        console.log('Player ' + (game.turn + 1) + ' Won.'), game.end = 1;
                    } else game.turnChange();
                else game.turnChange();
            }
        }
    }
});