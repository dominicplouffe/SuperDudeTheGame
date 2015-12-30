var LEFT = 37;
var UP = 38;
var RIGHT = 39;
var DOWN = 40;
var SPACE = 32;

var game_instance = null;
var player_instance = null;

window.onload = function(e) {
    game_instance = new game();
    player_instance = new game_player();

    $('.start_button_main').click(function() {

        var level = parseInt($(this).attr('level'), 10);
        set_game_screen(level);
    });

    $('.back_button').click(function() {
        set_home_screen();
    });

    $('#character_button').click(function() {
        set_character_screen();
    });

    $('.button_attribute').click(function() {
        var attribute = $(this).attr('attribute');
        var valid = false;

        if (attribute == 'speed' && $(this).hasClass('increase')) {
            var valid = player_instance.buy_speed();
        } else if (attribute == 'speed' && $(this).hasClass('decrease')) {
            var valid = player_instance.sell_speed();
        } else if (attribute == 'shield' && $(this).hasClass('increase')) {
            var valid = player_instance.buy_shield();
        } else if (attribute == 'shield' && $(this).hasClass('decrease')) {
            var valid = player_instance.sell_shield();
        }

        if (valid) {
            set_character_screen();
        }
    });
};

function set_game_screen(level) {
    $('#box').show();
    $('#main_menu_box').hide();
    $('#character_box').hide();

    set_level(level, game_instance);
    game_instance.start_game();
}

function set_home_screen() {
    $('#box').hide();
    $('#character_box').hide();
    $('#main_menu_box').show();
}

function set_character_screen() {
    $('#box').hide();
    $('#character_box').show();
    $('#main_menu_box').hide();

    $('.num_coins').html(player_instance.coins);
    $('#speed_attribute_value').html(player_instance.rise_rate);
    $('#speed_cost').html(player_instance.speed_value());

    $('#shield_attribute_value').html(player_instance.shield_length / 5000);
    $('#shield_cost').html(player_instance.shield_value());
    
    if (player_instance.coins < player_instance.speed_value() || player_instance.rise_rate == 5) {
        $('.increase[attribute="speed"]').attr('disabled', 'true');
    } else {
        $('.increase[attribute="speed"]').removeAttr('disabled');
    }

    if (player_instance.rise_rate == 1) {
        $('.decrease[attribute="speed"]').attr('disabled', 'true');
    } else {
        $('.decrease[attribute="speed"]').removeAttr('disabled');
    }

    if (player_instance.coins < player_instance.shield_value() || player_instance.shield_length == 25000) {
        $('.increase[attribute="shield"]').attr('disabled', 'true');
    } else {
        $('.increase[attribute="shield"]').removeAttr('disabled');
    }

    if (player_instance.shield_length == 5000) {
        $('.decrease[attribute="shield"]').attr('disabled', 'true');
    } else {
        $('.decrease[attribute="shield"]').removeAttr('disabled');
    }
}