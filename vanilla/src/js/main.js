var game = {
    win: ['0000', '1111'],
    board: {
        size: {
            width: 9, // Max: 10
            height: 7
        },
        literal: []
    },
    end: 0,
    turn: 0,
    turnCount: 0,
    changeTurn: () => game.turn = game.turn === 0 ? 1 : 0,
    evaluate: (arr, x, y) => {
        let execute = [
            x => arr[x],
            (x, y) => {
                let seq = [];
                seq.push(arr[x][y]);
                for (let x2 = x + 1; x2 < arr.length; x2++)
                    seq.push(arr[x2][y]);
                for (let x2 = x - 1; x2 >= 0; x2--)
                    seq.unshift(arr[x2][y]);
                return seq;
            },
            (x, y) => {
                let seq = [];
                seq.push(arr[x][y]);
                for (let x2 = x + 1, y2 = y + 1; x2 < arr.length && y2 < arr[x2].length; x2++, y2++)
                    seq.push(arr[x2][y2]);
                for (let x2 = x - 1, y2 = y - 1; x2 >= 0 && y2 >= 0; x2--, y2--)
                    seq.unshift(arr[x2][y2]);
                return seq;
            },
            (x, y) => {
                let seq = [];
                seq.push(arr[x][y]);
                for (let x2 = x - 1, y2 = y + 1; x2 >= 0 && y2 < arr[x2].length; x2--, y2++)
                    seq.push(arr[x2][y2]);
                for (let x2 = x + 1, y2 = y - 1; x2 < arr.length && y2 >= 0; x2++, y2--)
                    seq.unshift(arr[x2][y2]);
                return seq;
            },
        ];
        let str = '';
        for (let i = 0; i < execute.length; i++) {
            str += execute[i](x, y).join('');
            str += i !== execute.length - 1 ? '/' : '';
        }
        return str;
    }
}
var doc = {
    game: document.getElementsByClassName('game')[0],
    base: document.getElementsByClassName('base')[0]
}

for (let i = 0; i < game.board.size.width; i++) {
    let col = document.createElement('div');
    col.className = 'col';
    doc.base.appendChild(col);
    game.board.literal.push([]);
    for (let j = 0; j < game.board.size.height; j++) {
        let pos = document.createElement('div');
        pos.className = 'pos';
        document.getElementsByClassName('col')[i].appendChild(pos);
    }
}

doc = {
    ...doc,
    col: document.getElementsByClassName('col')
}

function logic(which) {
    if ((which < game.board.size.width && game.board.literal[which].length < game.board.size.height) && !game.end) {
        let thisPiece = doc.col[which].getElementsByClassName('pos')[(game.board.size.height - 1) - game.board.literal[which].length];
        game.board.literal[which].push(game.turn);
        thisPiece.className += ' player-' + (game.turn + 1);
        game.turnCount++;
        if (game.turnCount >= 4)
            if (game.evaluate(game.board.literal, which, game.board.literal[which].length - 1).includes(game.win[game.turn])) {
                alert('Player ' + (game.turn + 1) + ' Won.');
                game.end = 1;
            } else game.changeTurn();
        else game.changeTurn();
    }
}

for (let i = 0; i < doc.col.length; i++) doc.col[i].addEventListener('click', () => logic(i));

document.body.addEventListener('keyup', (e) => {
    if (e.keyCode >= 48 && e.keyCode <= 57) {
        let key;
        for (let i = 0; i < 10; i++) {
            key = e.keyCode === i + 49 ? i : undefined;
            if (typeof key === 'undefined') key = 9;
            else break;
        }
        logic(key);
    }
});