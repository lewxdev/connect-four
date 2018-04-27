const game = {
    data: {
        flag: {
            turn: 0,
            end: 0,
            sfx: 1,
            music: 1
        },
        count: {
            turns: 0,
            games: 0
        },
        size: {
            height: 7,
            width: 9
        },
        player: [{
            wins: 0
        }, {
            wins: 0
        }],
        time: 0
    },
    audio: {
        music: new Audio('./src/audio/music.ogg'),
        sfx: new Audio('./src/audio/woosh.ogg')
    },
    board: [],
    drawBoard: () => {
        game.board = [];
        x('#base').innerHTML = '';
        for (let i = 0; i < game.data.size.width; i++) {
            let col = document.createElement('div');
            col.classList.add('col');
            x('#base').appendChild(col);
            col.on('click', () => game.logic(i));
            game.board.push([]);
            for (let j = 0; j < game.data.size.height; j++) {
                let pos = document.createElement('div');
                pos.classList.add('pos');
                x('.col')[i].appendChild(pos);
            }
        }
    },
    changeTurn: () => {
        if (game.data.flag.turn) {
            game.data.flag.turn = 0;
            setTimeout(() => {
                x('#p-1').classList.remove('highlight');
                x('#p-0').classList.add('highlight');
            }, 350);
        } else {
            game.data.flag.turn = 1;
            setTimeout(() => {
                x('#p-0').classList.remove('highlight');
                x('#p-1').classList.add('highlight');
            }, 350);
        }
    },
    evaluate: (x, y) => {
        let execute = [
            x => game.board[x],
            (x, y) => {
                let seq = [];
                seq.push(game.board[x][y]);
                for (let x2 = x + 1; x2 < game.board.length; x2++) {
                    seq.push(game.board[x2][y]);
                    if (typeof game.board[x2][y] === 'undefined') seq.push('/');
                }
                for (let x2 = x - 1; x2 >= 0; x2--) {
                    seq.unshift(game.board[x2][y]);
                    if (typeof game.board[x2][y] === 'undefined') seq.unshift('/');
                }
                return seq;
            },
            (x, y) => {
                let seq = [];
                seq.push(game.board[x][y]);
                for (let x2 = x + 1, y2 = y + 1; x2 < game.board.length && y2 < game.board[x2].length; x2++, y2++) {
                    seq.push(game.board[x2][y2]);
                    if (typeof game.board[x2][y2] === 'undefined') seq.push('/');
                }
                for (let x2 = x - 1, y2 = y - 1; x2 >= 0 && y2 >= 0; x2--, y2--) {
                    seq.unshift(game.board[x2][y2]);
                    if (typeof game.board[x2][y2] === 'undefined') seq.unshift('/');
                }
                return seq;
            },
            (x, y) => {
                let seq = [];
                seq.push(game.board[x][y]);
                for (let x2 = x - 1, y2 = y + 1; x2 >= 0 && y2 < game.board[x2].length; x2--, y2++) {
                    seq.push(game.board[x2][y2]);
                    if (typeof game.board[x2][y2] === 'undefined') seq.push('/');
                }
                for (let x2 = x + 1, y2 = y - 1; x2 < game.board.length && y2 >= 0; x2++, y2--) {
                    seq.unshift(game.board[x2][y2]);
                    if (typeof game.board[x2][y2] === 'undefined') seq.unshift('/');
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
    },
    popup: (handler, data) => {
        if (handler === 'new') {
            if (data.options) {
                x('#modal-options').style.cssText = 'visibility:visible';
                x('#confirm').on('click', data.auth);
                x('body').on('keyup', (e) => {
                    if (e.keyCode === 13) data.auth();
                });
            } else {
                x('#modal-options').style.cssText = 'visibility:hidden';
                if (typeof data.auth !== 'undefined') {
                    console.warn('No need for confirm function');
                }
            }
            x('#title').innerHTML = data.title;
            x('#text').innerHTML = data.text;
            setTimeout(() => location.href = '#popup', 350);
        } else if (handler === 'close') {
            game.data.popupID = null;
            location.href = '#';
            x('#title').innerHTML = '';
            x('#text').innerHTML = '';
        } else throw new Error('Invalid handler argument for Popup');
    },
    logic: (which) => {
        let pos = document.createElement('div');
        pos.classList.add('_of-' + game.data.flag.turn);
        if ((which < game.data.size.width && game.board[which].length < game.data.size.height) && !game.data.flag.end) {
            let thisPiece = x('.col')[which].getElementsByClassName('pos')[(game.data.size.height - 1) - game.board[which].length];
            thisPiece.appendChild(pos);
            game.board[which].push(game.data.flag.turn);
            pos.animate([{
                    transform: 'translateY(-' + (61.5 * (game.data.size.height - game.board[which].length)) + 'px)'
                },
                {
                    transform: 'translateY(0px)'
                }
            ], {
                duration: 75 * (game.data.size.height - game.board[which].length),
                easing: 'ease-in'
            });
            game.data.count.turns++;
            if (game.data.flag.sfx) {
                game.audio.sfx.play();
                setTimeout(() => {
                    game.audio.sfx.pause();
                    game.audio.sfx.currentTime = 0;
                }, 250);
            }
            if (game.data.count.turns >= 4)
                if (game.evaluate(which, game.board[which].length - 1).includes(['0000', '1111'][game.data.flag.turn])) {
                    game.data.count.turns = 0;
                    game.data.count.games++;
                    game.popup('new', {
                        options: false,
                        title: 'Game Over!',
                        text: 'Player ' + (game.data.flag.turn + 1) + ' Won.',
                    });
                    game.data.player[game.data.flag.turn].wins++;
                    x('#p-0').innerHTML = '';
                    x('#p-1').innerHTML = '';
                    let leaderIndex = game.data.player[0].wins > game.data.player[1].wins ? 0 : game.data.player[0].wins === game.data.player[1].wins ? null : 1;
                    if (leaderIndex !== null) x('#p-' + leaderIndex).innerHTML = String.fromCharCode(9734);
                    let ratio = game.data.player[game.data.flag.turn].wins + ':' + game.data.player[game.data.flag.turn === 0 ? 1 : 0].wins;
                    x('#_' + game.data.flag.turn).getElementsByClassName('ratio')[0].innerHTML = ratio;
                    x('#_' + (game.data.flag.turn === 0 ? 1 : 0)).getElementsByClassName('ratio')[0].innerHTML = ratio.split('').reverse().join('');
                    game.data.flag.end = 1;
                } else game.changeTurn();
            else game.changeTurn();
        }
    }
};
const initialData = Object.freeze({ ...game.data
});
['#close', '#deny', '#overlay'].forEach((el) => x(el).on('click', () => game.popup('close')));
x('body').on('keyup', (e) => {
    if (e.keyCode === 27 && x('#popup').offsetLeft >= 0) game.popup('close');
});

game.drawBoard();
x('#p-0').classList.add('highlight');

game.audio.music.loop = true;
game.audio.music.play();