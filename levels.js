
function set_level(level, game) {

    if (level === 1) {
        game.default_move_rate = 2;
        // game.pipe_move_rate = 2;
        game.vertical_space = 120;
    } else if (level === 2) {
        game.default_move_rate = 3;
        // game.pipe_move_rate = 3;
        game.vertical_space = 100;
    } else if (level === 3) {
        game.default_move_rate = 4;
        // game.pipe_move_rate = 4;
        game.vertical_space = 70;
    }

    game.level = level;

}