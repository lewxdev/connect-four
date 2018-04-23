import React, { Component } from 'react';
import './App.css';

document.body.addEventListener('keyup', (e) => {
    if ((e.keyCode >= 48 && e.keyCode <= 57) && !this.state.end) {
        let key;
        for (let i = 0; i < 10; i++) {
            key = e.keyCode === i + 49 ? i : undefined;
            if (typeof key === 'undefined') key = 9;
            else break;
        }
        if (key < this.state.board.size.width && this.state.board.literal[key].length < this.state.board.size.height) {
            this.state.board.literal[key].push(this.state.turn);

            this.state.turnCount++;
            if (this.state.turnCount >= 4)
                if (this.state.evaluate(this.state.board.literal, key, this.state.board.literal[key].length - 1).includes(this.state.win[this.state.turn])) {
                    console.log('Player ' + (this.state.turn + 1) + ' Won.');
                    this.state.end = 1;
                } else this.state.changeTurn();
            else this.state.changeTurn();
        }
        console.log('key', key);
        console.log('baord', this.state.board.literal);
    }
});

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
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
            turnCount: 0
        }
        for (let i = 0; i < this.state.board.size.width; i++) this.state.board.literal.push([]);
    }
    changeTurn() {
        this.setState({
            turn: this.state.turn === 0 ? 1 : 0
        });
    };
    evaluate(arr, x, y) {
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
    Column(props) {
        let pos = [];
        for (let i = this.state.board.size.height - 1; i >= 0; i--) {
            let literal = <div className='pos' key={i} />;
            pos.push(literal);
        }
        return <div className='col'>{pos}</div>;
    }
    Board(props) {
        let cols = [];
        for (let i = 0; i < this.state.board.size.width; i++) cols.push(this.Column({key: i}));
        return cols;
    }
    render() {
        return ( 
            <div className='game' >
                <div className='base'>
                    {this.Board()}
                </div>
            </div>
        );
    }
}

export default App;