function game() {

    this.get_barrier = function(el, player) {

        var barrier = {};
        barrier.up = 0;
        barrier.left = 0;
        barrier.down = el.height() - player.height();
        barrier.right = el.width() - player.width();

        return barrier;
    };

    
    this.animate = function() {

        if (this.is_invisible) {
            var d = new Date();
            if (d - this.invisible_start > 10000) {
                this.is_invisible = false;
                this.invisible_start = null;
                this.player._el.removeClass('player_shield');
            }
        }

        if (this.in_jump) {
            this.player._do_jump();
        }

        if (g.pipes.length > 0) {
            this.move_pipes();

            var last_pipe = this.pipes[this.pipes.length-1];
            if (this.box.width() - last_pipe[0].left() >= last_pipe[0].width() + this.horizontal_space) {
                this.insert_pipe();
            }
        }

        this.is_game_over();
    };

    this.insert_pipe = function() {

        var pipe_id_down = 'pipe_down' + g.pipe_count;
        var pipe_id_up = 'pipe_up' + g.pipe_count;
        var space_id = 'space' + g.pipe_count;
        var html = '<div class="in_game_element" id="' + pipe_id_down + '"><img src="images/pipe_end.png" /><img src="images/pipe.png" class="pipe_image" id="inner_' + pipe_id_down + '" /></div>';
        html += '<div class="in_game_element" id="' + pipe_id_up + '"><img src="images/pipe_end.png" /><img src="images/pipe.png" class="pipe_image" id="inner_' + pipe_id_up + '" /></div>';
        html += '<div class="in_game_element" id="' + space_id + '"></div>';

        g.box._el.append(html);

        var left = g.box.width() + 1;

        //Down Pipe
        var up_down_max = this.box.height() / 2;
        if (g.pipes.length > 0){
            up_down_max = g.pipes[g.pipes.length-1][0].top() * this.pipe_height_diff;
        }
        
        var pipe_height = 50 + Math.floor((Math.random() * (up_down_max - 26)) + 1);
        var pipe_down = new ui_element($('#' + pipe_id_down), 0, 0, pipe_height, 60, g.zIndex, g);
        $('#inner_' + pipe_id_down).css('height', pipe_height);

        var top = g.box.height() - pipe_down.height();
        pipe_down._el.css('left', left + 'px');
        pipe_down._el.css('top', top + 'px');

        //Up Pipe
        pipe_height = this.box.height() - pipe_height - this.vertical_space;
        var pipe_up = new ui_element($('#' + pipe_id_up), 0, 0, pipe_height - 26, 60, g.zIndex, g);
        $('#inner_' + pipe_id_up).css('height', pipe_height);
        pipe_up._el.css('left', left + 'px');
        pipe_up._el.rotate(180);

        //Space
        var space_height = this.box.height() - pipe_up.height() - pipe_down.height();
        var space = new ui_element($('#' + space_id), pipe_height - 26, 0, space_height, 60, g.zIndex, g);
        space._el.css('left', left + 'px');
        this.add_objects_to_space(space);
        
        g.pipe_count += 1;
        g.zIndex += 1;
        g.pipes.push([pipe_down, pipe_up, space]);
    };

    this.move_pipes = function() {
        for (var i = 0; i < this.pipes.length; i++) {
            var pipe = this.pipes[i];

            var left = pipe[0].left();
            left -= this.pipe_move_rate;
            pipe[0]._el.css('left', left + 'px');
            pipe[1]._el.css('left', left + 'px');
            pipe[2]._el.css('left', left + 'px');
            

            if (left < 0 - pipe[0].width()) {
                pipe = this.pipes.shift();
                var pipe_up = pipe[0]._el[0];
                var pipe_down = pipe[1]._el[0];
                var space = pipe[2]._el[0];

                pipe_up.parentNode.removeChild(pipe_up);
                pipe_down.parentNode.removeChild(pipe_down);
                space.parentNode.removeChild(space);
            }
        }
    };

    this.get_dimension = function(el) {
        return {
            'left': el.left(),
            'right': el.left() + el.width(),
            'top': el.top(),
            'bottom': el.top() + el.height()
        };
    };

    this.colide_with_pipes = function(player, pipe_down, pipe_up) {

        var player_dim = this.get_dimension(player);
        var pipe_down_dim = this.get_dimension(pipe_down);
        var pipe_up_dim = this.get_dimension(pipe_up);

        if (!this.is_invisible) {
            if (pipe_down_dim.right > player_dim.right) {
                if (player_dim.right - this.player_give > pipe_down_dim.left) {
                    if (player_dim.bottom - this.player_give > pipe_down_dim.top) {
                        this.game_over = true;
                    }
                }
            }

            if (pipe_up_dim.right > player_dim.right) {
                if (player_dim.right - this.player_give > pipe_up_dim.left) {
                    if (player_dim.top < pipe_up_dim.bottom - this.player_give) {
                        this.game_over = true;
                    }
                }
            }
        }

        if (pipe_down_dim.right < player_dim.left && !pipe_down.counted) {
            pipe_down.counted = true;
            this.points += 1;
            this.set_points(this.points);
            set_level(parseInt(this.points / this.points_per_level, 10) + 1, this);
        }
    };

    this.colide_with_space = function(player, space) {
        var player_dim = this.get_dimension(player);
        var space_dim = this.get_dimension(space);

        if (player_dim.right >= space_dim.left) {
            if (space.coin) {
                space.coin = false;
                space._el.empty();

                this.coins += 1;
                this.set_coins(this.coins);
                this.sounds.coins.play();
            } else if (space.shield) {
                space.shield = false;
                space._el.empty();

                this.is_invisible = true;
                this.sounds.shields.play();

                this.player._el.addClass('player_shield');
                this.invisible_start = new Date();
            }
        }
    };

    this.is_game_over = function() {
        if (g.player.top() >= g.box.height() - g.player.height() - 1) {
            this.game_over = true;
        }

        for (var i = 0; i < this.pipes.length; i++) {
            var pipe = this.pipes[i];
            this.colide_with_pipes(this.player, pipe[0], pipe[1]);
            this.colide_with_space(this.player, pipe[2]);
        }

        if (this.game_over) {
            clearInterval(this.game_interval_id);
            clearInterval(this.coin_interval_id);
            $('#start_button').show();
        }
    };

    this.set_points = function(points) {
        this.points = points;
        $('#num_points').html(points);
    };

    this.set_coins = function(coins) {
        this.coins = coins;
        $('#num_coins').html(coins);

        localStorage.setItem('coins', this.coins);
    };

    this.animate_coin = function() {
        var coins = $('.coin');

        for (var i = 0; i < coins.length; i++) {
            var coin = $(coins[i]);
            var background_pos = parseInt(coin.css('background-position'), 10) + 50;
            coin.css('background-position', background_pos + 'px');
        }
    };

    this.add_objects_to_space = function(space) {
        random_val = Math.floor(Math.random() * 4);

        if (random_val === 1) {
            space._el.html('<div class="coin"></div>');
            space.coin = true;
            return;
        }

        random_val = Math.floor(Math.random() * 30);

        if (random_val == 10) {
            space._el.html('<div class="shield"></div>');
            space.shield = true;
            return;
        }
    };

    this.start_game = function() {
        $('#start_button').hide();
        $('.in_game_element').hide();

        this.add_debug('starting game');

        this.pipes = [];
        this.in_jump = false;
        this.jump_start = null;
        this.player = new ui_element($('#player'), 115, 75, 30, 40, 3, this);

        this.add_debug('done player');

        this.game_interval_id = setInterval(function() { game_instance.animate();}, 10);
        // this.coin_interval_id = setInterval(function() { game_instance.animate_coin();}, 100);

        this.add_debug('intervals => ' + this.game_interval_id + ' ' + this.coin_interval_id);
        this.game_over = false;
        this.level = 0;

        var coins = localStorage.getItem('coins');
        if (coins === null) coins = 0; else coins = parseInt(coins, 10);

        this.set_coins(coins);
        this.set_points(0);
        set_level(1, this);

        this.add_debug('Inserting pipe');

        this.insert_pipe();
    };

    this.add_debug = function(txt) {
        var html = $('#super_dude_debug').html();
        html += txt + '<br/>';

        $('#super_dude_debug').html(html);

    };

    //CONFIGURATION OPTIONS
    this.vertical_space = 60;
    this.horizontal_space = 100;
    this.player_give = 10;
    this.rise_rate = 5;
    this.fall_rate = 5;
    this.pipe_move_rate = 1;
    this.jump_height = 20;
    this.level = 0;
    this.points_per_level = 10;
    this.pipe_height_diff = 0.2;

    this.game_interval_id = null;
    this.coin_interval_id = null;
    this.game_over = true;
    this.points = 0;
    this.is_invisible = false;
    this.invisible_start = null;

    //SOUND
    this.sounds = {
        'coins': new Audio('sounds/coin.wav'),
        'shields': new Audio('sounds/shield.wav'),
    };

    var g = this;

    this.box = new ui_element($('#box'), 0, 0, '100%', '100%', 0, this);
    this.background = new ui_element($('#background'), 0, 0, '100%', '100%', 1, this);
    this.background2 = new ui_element($('#background2'), 0, 1100, 250, 550, 2, this);
    this.player = new ui_element($('#player'), 115, 75, 30, 40, 3, this);

    this.barrier = this.get_barrier(this.box, this.player);
    this.in_jump = false;
    this.jump_start = null;
    this.pipe_count = 0;
    this.zIndex = 10;
    this.pipes = [];

    if ($.browser.mobile) {
        $('.click_box').on('touchstart',function (e){
            var is_left = $(this).hasClass('left');
            if (!g.game_over){
                if (is_left) {
                    g.player.jump(UP);
                } else {
                    g.player.jump(DOWN);
                }
                
            }
        });
    } else {
        $('body').keydown(function(e) {
            if (!g.game_over){
                if (e.keyCode == UP) {
                    g.player.jump(UP);
                } else if (e.keyCode == DOWN) {
                    g.player.jump(DOWN);
                }
            }
        }); 
    }
    
    // $('.click_box').on('click', function(e) {
    //     var is_left = $(this).hasClass('left');
    //     if (!g.game_over){
    //         if (is_left) {
    //             g.player.jump(UP);
    //         } else {
    //             g.player.jump(DOWN);
    //         }
            
    //     }
    // });

    $('#start_button').css('left', (this.box.width() / 2) - (parseInt($('#start_button').css('width'), 10) / 2 ));
    $('#start_button').css('top', (this.box.height() / 2) - (parseInt($('#start_button').css('height'), 10) / 2 ));

    $('#start_button').click(function() {
        g.start_game();
    });
}