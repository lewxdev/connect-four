let game = {
    turn: 0,
    board: {
        spread: [],
        dimensions: {
            width: 8, // Max: 10
            height: 6
        }
    }
};
const boardHeight = game.board.dimensions.height,
    boardWidth = game.board.dimensions.width;

for (let i = 0; i < boardHeight; i++) {
    game.board.spread.push([]);
    game.board.spread[i].length = boardWidth;
    game.board.spread[i].fill({
        piece: 0,
        color: null
    });
}

document.body.addEventListener('keyup', (e) => {
    if (e.keyCode >= 48 && e.keyCode <= 57) {
        let key;
        for (let i = 0; i < 10; i++) {
            key = e.keyCode === i + 49 ? i : undefined;
            if (key === undefined) key = 9;
            else break;
        }
        for (let i = boardHeight - 1; i >= 0; i--) {
            if (game.board.spread[i][key].piece === 0) {
                game.turn = game.turn === 0 ? 1 : 0;
                game.board.spread[i][key].piece = 1;
                game.board.spread[i][key].color = game.turn;
                break;
            }
        }
    }
});