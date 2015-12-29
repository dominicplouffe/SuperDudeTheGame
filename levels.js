
function set_level(level, game) {

    if (level === 1) {
        game.pipe_move_rate = 1;
        game.vertical_space = 45;
        game.max_pipe_height = 170;
    } else if (level === 2) {
        game.pipe_move_rate = 2;
        game.vertical_space = 45;
        game.max_pipe_height = 140;
    } else if (level === 3) {
        game.pipe_move_rate = 3;
        game.vertical_space = 70;
        game.max_pipe_height = 125;
    }

    game.level = level;

}