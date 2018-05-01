let exe = {
    settings: () => {
        let audioState = game.data.flag.music ? 'Music On' : 'Music Off';
        game.popup('new', {
            options: false,
            title: 'Game Settings',
            text: '<div>Width <input id="opt-width" type="range" min="4" max="10" value="' + game.data.size.width + '" /></div><div>Height <input id="opt-height" type="range" min="4" max="8" value="' + game.data.size.height + '" /></div><div id="toggle-music" style="text-align:center">' + audioState + '</div>'
        });
        ['width', 'height'].forEach((el) => {
            x('#opt-' + el).on('change', () => {
                game.data.size[el] = Number(x('#opt-' + el).value);
                game.drawBoard();
            });
        });
        x('#toggle-music').on('click', () => {
            game.data.flag.music = game.data.flag.music ? 0 : 1;
            if (game.data.flag.music) {
                x('#toggle-music').innerHTML = 'Music On';
                game.audio.music.volume = 1;
            } else {
                x('#toggle-music').innerHTML = 'Music Off';
                game.audio.music.volume = 0;
            }
        });
    },
    reset: () => {
        function onConfirm() {
            for (let el of x('.indicator')) el.innerHTML = '';
            for (let el of x('.ratio')) el.innerHTML = '0:0';
            game.data = initialData;
            game.drawBoard();
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
x('body').on('keyup', (e) => {
    // Gameplay via Number Keys
    let key = e.keyCode >= 49 && e.keyCode <= 57 ? e.keyCode - 49 : e.keyCode === 48 ? 9 : undefined;
    if (typeof key !== 'undefined') {
        game.logic(key);
        if (game.data.count.players === 1) {
            setTimeout(() => {
                if (game.data.flag.turn === 1) game.logic(Math.floor(Math.random() * game.data.size.width));
            }, 1200);
        }
    };
    // Settings Menu
    if (e.keyCode === 83) exe.settings();
    // Reset Confirmation
    if (e.keyCode === 82) exe.reset();
    // New Game Confirmation
    if (e.keyCode === 78) exe.new();
    // Toggle SFX
    if (e.keyCode === 70) exe.sfx();
});
x('#settings').on('click', () => exe.settings());
x('#reset').on('click', () => exe.reset());
x('#new').on('click', () => exe.new());
x('#sfx').on('click', () => exe.sfx());