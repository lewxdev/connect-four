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
                for (let x2 = x + 1; x2 < arr.length; x2++) {
                    seq.push(arr[x2][y]);
                    if (typeof arr[x2][y] === 'undefined') seq.push('/');
                }
                for (let x2 = x - 1; x2 >= 0; x2--) {
                    seq.unshift(arr[x2][y]);
                    if (typeof arr[x2][y] === 'undefined') seq.unshift('/');
                }
                return seq;
            },
            (x, y) => {
                let seq = [];
                seq.push(arr[x][y]);
                for (let x2 = x + 1, y2 = y + 1; x2 < arr.length && y2 < arr[x2].length; x2++, y2++) {
                    seq.push(arr[x2][y2]);
                    if (typeof arr[x2][y2] === 'undefined') seq.push('/');
                }
                for (let x2 = x - 1, y2 = y - 1; x2 >= 0 && y2 >= 0; x2--, y2--) {
                    seq.unshift(arr[x2][y2]);
                    if (typeof arr[x2][y2] === 'undefined') seq.unshift('/');
                }
                return seq;
            },
            (x, y) => {
                let seq = [];
                seq.push(arr[x][y]);
                for (let x2 = x - 1, y2 = y + 1; x2 >= 0 && y2 < arr[x2].length; x2--, y2++) {
                    seq.push(arr[x2][y2]);
                    if (typeof arr[x2][y2] === 'undefined') seq.push('/');
                }
                for (let x2 = x + 1, y2 = y - 1; x2 < arr.length && y2 >= 0; x2++, y2--) {
                    seq.unshift(arr[x2][y2]);
                    if (typeof arr[x2][y2] === 'undefined') seq.unshift('/');
                }
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

for (let i = 0; i < game.board.size.width; i++) {
    let col = document.createElement('div');
    col.classList.add('col');
    document.getElementsByClassName('base')[0].appendChild(col);
    game.board.literal.push([]);
    for (let j = 0; j < game.board.size.height; j++) {
        let pos = document.createElement('div');
        pos.classList.add('pos');
        document.getElementsByClassName('col')[i].appendChild(pos);
    }
}

function logic(which) {
    let pos = document.createElement('div');
    pos.classList.add('_of-' + game.turn);
    if ((which < game.board.size.width && game.board.literal[which].length < game.board.size.height) && !game.end) {
        let thisPiece = document.getElementsByClassName('col')[which].getElementsByClassName('pos')[(game.board.size.height - 1) - game.board.literal[which].length];
        thisPiece.appendChild(pos);
        pos.animate([
            {transform: 'translateY(-' + (61.5 * (game.board.size.height - game.board.literal[which].length)) + 'px)'},
            {transform: 'translateY(0px)'}
        ], {
            duration: 75 * (game.board.size.height - game.board.literal[which].length),
            easing: 'ease-in'
        });
        game.board.literal[which].push(game.turn);
        game.turnCount++;
        if (game.turnCount >= 4)
            if (game.evaluate(game.board.literal, which, game.board.literal[which].length - 1).includes(game.win[game.turn])) {
                location.href = '#popup';
                document.getElementById('title').innerHTML = 'Game Over!';
                document.getElementById('text').innerHTML = 'Player ' + (game.turn + 1) + ' Won.';
                game.end = 1;
            } else game.changeTurn();
        else game.changeTurn();
    }
    setTimeout(() => {
        if (game.turn === 0) {
            document.getElementById('p-1').classList.remove('highlight');
            document.getElementById('p-0').classList.add('highlight');
        } else {
            document.getElementById('p-0').classList.remove('highlight');
            document.getElementById('p-1').classList.add('highlight');
        }
    }, 400);
}

for (let i = 0; i < document.getElementsByClassName('col').length; i++) document.getElementsByClassName('col')[i].addEventListener('click', () => logic(i));
document.getElementById('p-1').classList.remove('highlight');
document.getElementById('p-0').classList.add('highlight');

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

document.body.addEventListener('keyup', (e) => {
    if (e.keyCode === 27 && document.getElementById('popup').offsetLeft >= 0) {
        location.href = '#';
        document.getElementById('title').innerHTML = '';
        document.getElementById('text').innerHTML = '';
    }
});

document.getElementById('close').addEventListener('click', () => {
    document.getElementById('title').innerHTML = '';
    document.getElementById('text').innerHTML = '';
});