import { Game } from "./game/main.js";
let game = new Game();

let exe = {
    settings: () => {
        game.popup('new', {
            options: false,
            title: 'Game Settings',
            text: '<div>Width <input id="opt-width" type="range" min="4" max="10" value="' + game.data.size.width + '" /></div><div>Height <input id="opt-height" type="range" min="4" max="8" value="' + game.data.size.height + '" /></div>'
        });
        ['width', 'height'].forEach((el) => {
            document.querySelector('#opt-' + el).addEventListener('change', () => {
                game.data.size[el] = Number(document.querySelector('#opt-' + el).value);
                game.drawBoard();
            });
        });
    },
    reset: () => {
        function onConfirm() {
            for (let el of document.querySelectorAll('.indicator')) el.innerHTML = '';
            for (let el of document.querySelectorAll('.ratio')) el.innerHTML = '0:0';
			game = new Game();
            game.popup('close');
        }
        game.popup('new', {
            options: true,
            title: 'Reset Game',
            text: 'Are you sure you want to reset?',
            auth: onConfirm
        });
    },
    new: () => {
        function onConfirm() {
            game.data.flag.end = game.data.count.turns = 0;
            game.data.flag.turn = game.data.player[1].wins > game.data.player[0].wins ? 1 : 0
            game.drawBoard();
            game.popup('close');
            if (game.data.count.players === 1) {
                setTimeout(() => {
                    if (game.data.flag.turn === 1) game.logic(Math.floor(Math.random() * game.data.size.width));
                }, 1200);
            }
        }
        if (!game.data.flag.end) {
            if (game.data.count.turns === 0) {
                game.popup('new', {
                    options: false,
                    title: '&#9888; Silly You',
                    text: 'The game hasn\'t started yet!'
                });
            } else {
                game.popup('new', {
                    options: true,
                    title: 'New Game',
                    text: 'End your progress and start a new game?',
                    auth: onConfirm
                });
            }
        } else {
            game.popup('new', {
                options: true,
                title: 'New Game',
                text: 'Start a new game?',
                auth: onConfirm
            });
        }
    },
    sfx: () => {
        game.data.flag.sfx = game.data.flag.sfx ? 0 : 1;
        if (game.data.flag.sfx) game.audio.sfx.play();
        setTimeout(() => {
            game.audio.sfx.pause();
            game.audio.sfx.currentTime = 0;
        }, 250);
    }
}

// Event Listeners
// Hotkeys
document.querySelector('body').addEventListener('keyup', (e) => {
    // Gameplay via Number Keys
    let key = e.keyCode >= 49 && e.keyCode <= 57 ? e.keyCode - 49 : e.keyCode === 48 ? 9 : undefined;
    if (key < game.data.size.width) game.logic(key);
    // Settings Menu
    if (e.keyCode === 83) exe.settings();
    // Reset Confirmation
    if (e.keyCode === 82) exe.reset();
    // New Game Confirmation
    if (e.keyCode === 78) exe.new();
    // Toggle SFX
    if (e.keyCode === 70) exe.sfx();
});
document.querySelector('#settings').addEventListener('click', () => exe.settings());
document.querySelector('#reset').addEventListener('click', () => exe.reset());
document.querySelector('#new').addEventListener('click', () => exe.new());
document.querySelector('#sfx').addEventListener('click', () => exe.sfx());