var LEFT = 37;
var UP = 38;
var RIGHT = 39;
var DOWN = 40;
var SPACE = 32;

var game_instance = null;

window.onload = function(e) {
    game_instance = new game();

    $('.start_button_main').click(function() {

        var level = parseInt($(this).attr('level'), 10);
        set_game_screen(level);
    });

    $('#back_button').click(function() {
        set_home_screen();
    });
};

function set_game_screen(level) {
    $('#box').show();
    $('#main_menu_box').hide();

    set_level(level, game_instance);
    game_instance.start_game();
}

function set_home_screen() {
    $('#box').hide();
    $('#main_menu_box').show();
}

