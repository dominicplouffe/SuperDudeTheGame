
function set_level(level, game) {

    if (level === 1) {
        game.pipe_move_rate = 1;
        game.vertical_space = 45;
    } else if (level === 2) {
        game.pipe_move_rate = 2;
        game.vertical_space = 45;
    } else if (level === 3) {
        game.pipe_move_rate = 3;
        game.vertical_space = 70;
    }

    game.level = level;

}