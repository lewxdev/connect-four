export function Game() {
	this.data = {
		flag: {
			turn: 0,
			end: 0
		},
		count: {
			turns: 0,
			games: 0,
			players: 0
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
	};
	this.board = [];

	this.drawBoard();
	document.querySelector('#p-0').classList.toggle('highlight');
	['#close', '#deny', '#overlay'].forEach((el) => {
		document.querySelector(el).addEventListener('click', () => this.popup('close'));
	});
	document.querySelector('body').addEventListener('keyup', (e) => {
		if (e.keyCode === 27 && document.querySelector('#popup').offsetLeft >= 0) this.popup('close');
	});

	this.popup('new', {
		options: false,
		title: 'Player Count',
		text: '<div id="player-options"><div id="opt-1">i</div><div id="opt-2">ii</div></div>'
	});
	document.querySelector('#opt-1').addEventListener('click', () => {
		this.data.count.players = 1;
		this.popup('close');
	});
	document.querySelector('#opt-2').addEventListener('click', () => {
		this.data.count.players = 2;
		this.popup('close');
	});
}

Game.prototype.popup = function (handler, data) {
	if (handler === 'new') {
		if (data.options) {
			document.querySelector('#modal-options').style.cssText = 'visibility:visible';
			document.querySelector('#confirm').addEventListener('click', data.auth);
			document.body.addEventListener('keyup', (e) => {
				if (e.keyCode === 13) data.auth();
			});
		} else {
			document.querySelector('#modal-options').style.cssText = 'visibility:hidden';
			if (typeof data.auth !== 'undefined') console.warn('No need for confirm function');
		}
		document.querySelector('#title').innerHTML = data.title;
		document.querySelector('#text').innerHTML = data.text;
		setTimeout(() => location.href = '#popup', 350);
	} else if (handler === 'close') {
		location.href = '#';
		document.querySelector('#title').innerHTML = '';
		document.querySelector('#text').innerHTML = '';
	} else throw new Error('Invalid handler argument for popup');
}

Game.prototype.evaluate = function (x, y, type) {
	let execute = [
		(x) => {
			return this.board[x]
		},
		(x, y) => {
			let seq = [];
			seq.push(this.board[x][y]);
			for (let x2 = x + 1; x2 < this.board.length; x2++) {
				seq.push(this.board[x2][y]);
				if (typeof this.board[x2][y] === 'undefined') seq.push('/');
			}
			for (let x2 = x - 1; x2 >= 0; x2--) {
				seq.unshift(this.board[x2][y]);
				if (typeof this.board[x2][y] === 'undefined') seq.unshift('/');
			}
			return seq;
		},
		(x, y) => {
			let seq = [];
			seq.push(this.board[x][y]);
			for (let x2 = x + 1, y2 = y + 1; x2 < this.board.length && y2 < this.board[x2].length; x2++ , y2++) {
				seq.push(this.board[x2][y2]);
				if (typeof this.board[x2][y2] === 'undefined') seq.push('/');
			}
			for (let x2 = x - 1, y2 = y - 1; x2 >= 0 && y2 >= 0; x2-- , y2--) {
				seq.unshift(this.board[x2][y2]);
				if (typeof this.board[x2][y2] === 'undefined') seq.unshift('/');
			}
			return seq;
		},
		(x, y) => {
			let seq = [];
			seq.push(this.board[x][y]);
			for (let x2 = x - 1, y2 = y + 1; x2 >= 0 && y2 < this.board[x2].length; x2-- , y2++) {
				seq.push(this.board[x2][y2]);
				if (typeof this.board[x2][y2] === 'undefined') seq.push('/');
			}
			for (let x2 = x + 1, y2 = y - 1; x2 < this.board.length && y2 >= 0; x2++ , y2--) {
				seq.unshift(this.board[x2][y2]);
				if (typeof this.board[x2][y2] === 'undefined') seq.unshift('/');
			}
			return seq;
		},
	];
	let str = '';
	if (type === 'all')
		for (let i = 0; i < execute.length; i++) {
			str += execute[i](x, y).join('');
			str += i !== execute.length - 1 ? '/' : '';
		}
	else for (let [key, index] of new Map([['hor', 0], ['ver', 1], ['dxy', 2], ['dyx', 3]])) {
		if (type === key) str = execute[index];
	}
	return str;
}

Game.prototype.changeTurn = function () {
	this.data.flag.turn = this.data.flag.turn === 0 ? 1 : 0;
	setTimeout(() => {
		for (let i of [0, 1]) document.querySelector('#p-' + i).classList.toggle('highlight');
	}, 350);
}

Game.prototype.logic = function (xIndex) {
	if (!this.data.flag.end)
		if (this.board[xIndex].length < this.data.size.height) {
			let animationModifier = this.data.size.height - this.board[xIndex].length;
			document.newElement('div', {
				classList: ['_of-' + this.data.flag.turn],
				insert: {
					elem: document.querySelectorAll('.col')[xIndex].querySelectorAll('.pos')[(this.data.size.height - 1) - this.board[xIndex].length],
					pos: 'beforeend'
				}
			}).animate([
				{ transform: 'translateY(-' + (61.5 * animationModifier) + 'px)' },
				{ transform: 'translateY(0px)' }
			], {
				duration: 75 * animationModifier,
				easing: 'ease-in'
			});
			this.board[xIndex].push(this.data.flag.turn);
			this.data.count.turns++;
			if (this.data.count.turns >= 4)
				if (this.evaluate(xIndex, this.board[xIndex].length - 1, 'all').includes(['0000', '1111'][this.data.flag.turn])) {
					this.data.player[this.data.flag.turn].wins++;
					this.data.count.turns = 0;
					this.data.count.games++;
					this.popup('new', {
						options: false,
						title: 'Game Over!',
						text: 'Player ' + (this.data.flag.turn + 1) + ' Won.',
					});
					for (let i of [0, 1]) document.querySelector('#p-' + i).innerHTML = '';
					let leaderIndex = this.data.player[0].wins > this.data.player[1].wins ? 0
						: this.data.player[0].wins < this.data.player[1].wins ? 1 : null;
					if (leaderIndex !== null) document.querySelector('#p-' + leaderIndex).innerHTML = String.fromCharCode(9734);
					let ratio = this.data.player[this.data.flag.turn].wins + ':' + this.data.player[this.data.flag.turn === 0 ? 1 : 0].wins;
					document.querySelector('#_' + this.data.flag.turn).querySelector('.ratio').innerHTML = ratio;
					document.querySelector('#_' + (this.data.flag.turn === 0 ? 1 : 0)).querySelector('.ratio').innerHTML = ratio.split('').reverse().join('');
					this.data.flag.end = 1;
				}
			this.changeTurn();
			if (this.data.count.players === 1) {
				setTimeout(() => {
					if (this.data.flag.turn === 1)
						this.logic(Math.floor(Math.random() * this.data.size.width));
				}, 1200);
			}
		}
}

Game.prototype.drawBoard = function () {
	this.board = [];
	document.querySelector('#base').innerHTML = '';
	for (let xIndex = 0; xIndex < this.data.size.width; xIndex++) {
		this.board.push([]);
		document.newElement('div', {
			classList: ['col'],
			insert: {
				elem: document.querySelector('#base'),
				pos: 'beforeend'
			}
		}).addEventListener('click', () => this.logic(xIndex));
		for (let yIndex = 0; yIndex < this.data.size.height; yIndex++) {
			document.newElement('div', {
				classList: ['pos'],
				insert: {
					elem: document.querySelectorAll('.col')[xIndex],
					pos: 'beforeend'
				}
			});
		}
	}
}