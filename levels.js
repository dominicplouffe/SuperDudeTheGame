
function set_level(level, game) {

    if (level === 1) {
        game.pipe_height_diff = 0.6;
        game.pipe_move_rate = 1;
    } else if (level === 2) {
        game.pipe_height_diff = 0.6;
        game.pipe_move_rate = 2;
    } else if (level === 3) {
        game.pipe_height_diff = 0.6;
        game.pipe_move_rate = 3;
    }

    game.level = level;

}