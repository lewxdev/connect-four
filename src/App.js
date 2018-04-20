import React, { Component } from 'react';
import './App.css';
var game = {
    win: ['0000', '1111'],
    board: {
        size: {
            width: 8, // Max: 10
            height: 6
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
};
for (let i = 0; i < game.board.size.width; i++) game.board.literal.push([]);

function Base(props) {
	return <div className='base' children={props.children} />
}

function Column(props) {
	let pos = [];
	for (let i = game.board.size.height - 1; i >= 0; i--) {
		let literal = <div className='pos' key={i} />;
		pos.push(literal);
	}
	return (
		<div className='col'>{pos}</div>
	);
}

function Board(props) {
	let cols = [];
	for (let i = 0; i < game.board.size.width; i++) cols.push(<Column key={i} />);
	return cols;
}

document.body.addEventListener('keyup', (e) => {
    if ((e.keyCode >= 48 && e.keyCode <= 57) && !game.end) {
        let key;
        for (let i = 0; i < 10; i++) {
            key = e.keyCode === i + 49 ? i : undefined;
			if (typeof key === 'undefined') key = 9;
			else break;
		}
        if (key < game.board.size.width && game.board.literal[key].length < game.board.size.height) {
			game.board.literal[key].push(game.turn);
			game.turnCount++;
            if (game.turnCount >= 4)
                if (game.evaluate(game.board.literal, key, game.board.literal[key].length - 1).includes(game.win[game.turn])) {
					console.log('Player ' + (game.turn + 1) + ' Won.');
					game.end = 1;
                } else game.changeTurn();
            else game.changeTurn();
        }
        console.log('key', key);
        console.log('baord', game.board.literal);
    }
});

class App extends Component {
	render() {
		return (
			<div className='game'>
				<Base>
					<Board />
				</Base>
			</div>
		);
	}
}

export default App;