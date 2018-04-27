let exe = {
    settings: () => {
        game.popup('new', {
            options: false,
            title: 'Game Settings',
            text: '<div>Width <input id="opt-width" type="range" min="4" max="10" value="' + game.data.size.width + '" /></div><div>Height <input id="opt-height" type="range" min="4" max="8" value="' + game.data.size.height + '" /></div>'
        });
        ['width', 'height'].forEach((el) => {
            x('#opt-' + el).on('change', () => {
                game.data.size[el] = Number(x('#opt-' + el).value);
                game.drawBoard();
            });
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
            game.drawBoard();
            game.popup('close');
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
    }
}

// Event Listeners
// Hotkeys
x('body').on('keyup', (e) => {
    // Gameplay via Number Keys
    let key = e.keyCode >= 49 && e.keyCode <= 57 ? e.keyCode - 49 : e.keyCode === 48 ? 9 : undefined;
    if (typeof key !== 'undefined') game.logic(key);
    // Settings Menu
    if (e.keyCode === 83) exe.settings();
    // Reset Confirmation
    if (e.keyCode === 82) exe.reset();
    // New Game Confirmation
    if (e.keyCode === 78) exe.new();
});
x('#settings').on('click', () => exe.settings());
x('#reset').on('click', () => exe.reset());
x('#new').on('click', () => exe.new());
x('#sfx').on('click', () => {});