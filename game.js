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
            if (d - this.invisible_start > this.shield_length) {
                this.is_invisible = false;
                this.invisible_start = null;
                this.player._el.removeClass('player_shield');
            }
        }

        if (this.in_jump) {
            this.player._do_jump();
        }

        if (this.shoot) {
            this.move_bullet();
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
        var pipe_height = this.get_pipe_height(g);
        this.last_pipe_height = pipe_height;

        var pipe_down = new ui_element($('#' + pipe_id_down), 0, 0, pipe_height, 60, g.zIndex, g);
        $('#inner_' + pipe_id_down).css('height', pipe_height);

        var top = g.box.height() - pipe_down.height() - this.floor_height;
        pipe_down._el.css('left', left + 'px');
        pipe_down._el.css('top', top + 'px');
        pipe_down.set_dimension();

        //Up Pipe
        pipe_height = this.box.height() - pipe_height - this.vertical_space;
        var pipe_up = new ui_element($('#' + pipe_id_up), 0, 0, pipe_height - this.pipe_end_height, 60, g.zIndex, g);
        $('#inner_' + pipe_id_up).css('height', pipe_height);
        pipe_up._el.css('left', left + 'px');
        pipe_up._el.rotate(180);
        pipe_up.set_dimension();

        //Space
        var space_height = this.box.height() - pipe_up.height() - pipe_down.height() - this.floor_height;
        var space = new ui_element($('#' + space_id), pipe_height - this.pipe_end_height, 0, space_height, 60, g.zIndex, g);
        space._el.css('left', left + 'px');
        space.set_dimension();
        this.add_objects_to_space(space);
        
        g.pipe_count += 1;
        g.zIndex += 1;
        g.pipes.push([pipe_down, pipe_up, space]);
    };

    this.get_pipe_height = function(g) {
        var up_down_max = this.box.height() / 2;
        if (g.pipes.length > 0){
            up_down_max = g.pipes[g.pipes.length-1][0].top();
        }
    
        var pipe_height = null;
        if (g.pipe_count == 0) {
            pipe_height = 50 + Math.floor((Math.random() * (up_down_max - this.pipe_end_height)) + 1);
        } else {

            var minimum_height = 75;
            var maximum_height = this.box.dimension.height - 155;
            
            var diff = minimum_height + Math.floor((Math.random() * 100));

            if (g.pipe_count % 2 == 0) {
                pipe_height = this.last_pipe_height + diff;
            } else {
                pipe_height = this.last_pipe_height - diff;
            }

            if (pipe_height < minimum_height) {
                pipe_height = minimum_height + Math.floor(Math.random() * 50);
            }

            if (pipe_height > maximum_height) {
                pipe_height = maximum_height;
            }
        }

        return pipe_height;
    };

    this.move_pipes = function() {
        for (var i = 0; i < this.pipes.length; i++) {
            var pipe = this.pipes[i];

            var left = pipe[0].dimension.left;
            left -= this.pipe_move_rate;
            pipe[0]._el.css('left', left + 'px');
            pipe[1]._el.css('left', left + 'px');
            pipe[2]._el.css('left', left + 'px');

            pipe[0].dimension.left = left;
            pipe[1].dimension.left = left;
            pipe[2].dimension.left = left;
            
            if (left < 0 - pipe[0].dimension.width) {
                pipe = this.pipes.shift();
                var pipe_up = pipe[0]._el[0];
                var pipe_down = pipe[1]._el[0];
                var space = pipe[2]._el[0];

                pipe_up.parentNode.removeChild(pipe_up);
                pipe_down.parentNode.removeChild(pipe_down);
                space.parentNode.removeChild(space);
            }

            this.colide_with_pipes(this.player, pipe[0], pipe[1]);
            this.colide_with_space(this.player, pipe[2]);
        }
    };

    this.colide_with_pipes = function(player, pipe_down, pipe_up) {

        var player_dim = player.dimension;
        var pipe_down_dim = pipe_down.dimension;
        var pipe_up_dim = pipe_up.dimension;

        if (!this.is_invisible) {
            if (!pipe_down.is_blown) {
                if (pipe_down_dim.left + pipe_down_dim.width > player_dim.left + player_dim.width) {
                    if ((player_dim.left + player_dim.width) - this.player_give > pipe_down_dim.left) {
                        if (player_dim.bottom - this.player_give > pipe_down_dim.top) {
                            this.game_over = true;
                        }
                    }
                }
            }

            if (!pipe_up.is_blown) {
                if (pipe_up_dim.left + pipe_up_dim.width > player_dim.left + player_dim.width) {
                    if ((player_dim.left + player_dim.width) - this.player_give > pipe_up_dim.left) {
                        if (player_dim.left < (player_dim.left + player_dim.width)) {
                            if (player_dim.top < pipe_up_dim.bottom - this.player_give) {
                                this.game_over = true;
                            }
                        }
                    }
                }
            }
        }

        if (pipe_down_dim.left + pipe_down_dim.width < player_dim.left && !pipe_down.counted) {
            pipe_down.counted = true;
            
            this.points += 1;
            this.set_points(this.points);
            this.pipe_move_rate = this.default_move_rate + parseInt(this.points / this.points_per_level, 10);
        }
    };

    this.move_bullet = function() {
        var bullet = $('#bullet');
        var bullet_left = parseInt(bullet.css('left'), 10) + 3;
        bullet.css('left', bullet_left + 'px');

        var bullet_right = bullet_left + parseInt(bullet.css('width'), 10);
        var bullet_top = parseInt(bullet.css('top'), 10);

        for (var i = 0; i < this.pipes.length; i++) {
            var pipe = this.pipes[i];
            var pipe_down = pipe[0];
            var pipe_up = pipe[1];
            var pipe_down_dim = pipe_down.dimension;
            var pipe_up_dim = pipe_up.dimension;

            if (bullet_right >= pipe_up_dim.left && !pipe_up.is_blown) {
                if (bullet_top < pipe_up_dim.height && !pipe_down.counted) {
                    this.shoot = false;
                    this.add_explosion(pipe_up);
                    bullet.hide();
                }
            }

            if (bullet_right >= pipe_down_dim.left && !pipe_down.is_blown) {
                if (bullet_top > pipe_down_dim.top && !pipe_down.counted) {
                    this.shoot = false;
                    this.add_explosion(pipe_down);
                    bullet.hide();
                }
            }
        }
    };

    this.colide_with_space = function(player, space) {
        var player_dim = player.dimension;
        var space_dim = space.dimension;

        if (player_dim.right >= space_dim.left) {
            if (player_dim.top > space_dim.top & player_dim.top < space_dim.top + space_dim.height) {
                if (space.coin) {
                    space.coin = false;
                    space._el.empty();

                    this.gp.coins += 1;
                    this.set_coins(this.gp.coins);
                    this.play_sound('coins');
                } else if (space.shield) {
                    space.shield = false;
                    space._el.empty();

                    this.is_invisible = true;
                    this.play_sound('shields');

                    this.player._el.addClass('player_shield');
                    this.invisible_start = new Date();
                }
            }
        }
    };

    this.is_game_over = function() {
        if (g.player.top() >= g.box.height() - g.player.height() - 1) {
            this.game_over = true;
        }

        if (this.game_over) {
            this.set_highscore(this.highscore);

            clearInterval(this.game_interval_id);
            clearInterval(this.coin_interval_id);

            $('.outer_info').show();
        }
    };

    this.set_points = function(points) {
        this.points = points;
        $('#num_points').html(points);

        if (points > this.highscore) {
            this.highscore = points;
        }
    };

    this.set_coins = function(coins) {
        this.gp.coins = coins;
        $('.num_coins').html(coins);

        localStorage.setItem('coins', coins);
    };

    this.set_highscore = function(highscore) {
        $('#num_highscore').html(highscore);
        localStorage.setItem('highscore' + this.level, highscore);
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

    this.animate_explosion = function(el) {

        var g = this;
        var explosion = $(el._el.children()[0]);
        var background_pos = parseInt(explosion.css('background-position'), 10) + 64;
        explosion.css('background-position', background_pos + 'px');

        if (background_pos / 64 < 15) {
            setTimeout(function() { g.animate_explosion(el);}, 100);
        } else {
            el._el.empty();
        }
    };

    this.add_explosion = function(pipe) {

        pipe.is_blown = true;
        pipe._el.empty();
        pipe._el.html('<div class="explosion"></div>');

        var g = this;

        setTimeout(function() { g.animate_explosion(pipe);}, 100);
    };

    this.render_bullets = function() {
        var bullets = $('#bullets');
        bullets.empty();

        var html = '';
        var left = 0;
        for (var i = 0; i < this.number_of_bullets; i++) {
            html += '<div class="bullet" style="left: ' + left + 'px;"></div>';
            left += 32;
        }

        bullets.html(html);
    };

    this.play_sound = function(sound_name) {
        var sound = this.sounds[sound_name];

        // Reset the sound, then play it
        if(sound.readyState) {
            sound.pause();
            sound.currentTime = 0;
        }
        sound.play();
    };

    this.start_game = function() {
        $('.outer_info').hide();
        $('.in_game_element').hide();

        this.gp = new game_player();
        this.rise_rate = this.gp.rise_rate;
        this.fall_rate = this.gp.fall_rate;
        this.shield_length = this.gp.shield_length;

        if (this.level == 1 && this.rise_rate < 2) {
            this.rise_rate = 2;
            this.fall_rate = 2;
        }

        this.add_debug('starting game');

        this.pipes = [];
        this.in_jump = false;
        this.jump_start = null;
        this.player = new ui_element($('#player'), 115, 75, 50, 50, 3, this);

        this.add_debug('done player');

        this.game_interval_id = setInterval(function() { game_instance.animate();}, 10);
        this.coin_interval_id = setInterval(function() { game_instance.animate_coin();}, 100);

        this.add_debug('intervals => ' + this.game_interval_id + ' ' + this.coin_interval_id);
        this.game_over = false;
        this.number_of_bullets = 3;
        this.pipe_move_rate = this.default_move_rate;

        this.set_points(0);
        this.set_coins(this.gp.coins);

        this.highscore = localStorage.getItem('highscore' + this.level);
        if (this.highscore === null) this.highscore = 0; else this.highscore = parseInt(this.highscore, 10);
        this.set_highscore(this.highscore);

        this.render_bullets();

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
    this.horizontal_space = 150;
    this.pipe_move_rate = 1;
    this.level = 0;
    this.points_per_level = 50;
    this.shield_length = 5000;

    this.jump_height = 20;
    this.number_of_bullets = 3;
    this.player_give = 10;
    this.rise_rate = 1;
    this.fall_rate = 1;

    //GAME VARIABLES
    this.game_interval_id = null;
    this.coin_interval_id = null;
    this.game_over = true;
    this.points = 0;
    this.is_invisible = false;
    this.invisible_start = null;
    this.in_jump = false;
    this.jump_start = null;
    this.pipe_count = 0;
    this.zIndex = 10;
    this.pipes = [];
    this.last_pipe_height = 0;

    this.highscore = 0;

    //SOUNDS
    this.sounds = {
        'coins': new Audio('sounds/coin.mp3'),
        'shields': new Audio('sounds/shield.wav'),
    };

    var g = this;

    //ELEMENTS
    this.box = new ui_element($('#box'), 0, 0, '100%', '100%', 0, this);
    this.background = new ui_element($('#background'), 0, 0, '100%', '100%', 1, this);
    this.background2 = new ui_element($('#background2'), 0, 1100, 250, 550, 2, this);
    this.player = new ui_element($('#player'), 115, 75, 30, 40, 3, this);
    this.floor_height = parseInt($('#floor').css('height'), 10);
    this.barrier = this.get_barrier(this.box, this.player);
    this.pipe_end_height = 26;

    this.gp = new game_player();

    this.set_coins(this.gp.coins);
    this.render_bullets();

    var isiPad = navigator.userAgent.match(/iPad/i) != null;

    if ($.browser.mobile || isiPad) {
        $('.click_box').on('touchstart',function (e){
            var is_left = $(this).hasClass('left');
            var is_right = $(this).hasClass('right-bottom');
            if (!g.game_over){
                if (is_left) {
                    g.player.jump(DOWN);
                } else if (is_right) {
                    g.player.jump(UP);
                } else {
                    if (!g.shoot) {
                        g.player.shoot();
                    }
                }
            }
        });

        $('.click_box').on('touchend',function (e){
            var is_left = $(this).hasClass('left');
            if (!g.game_over){
                g.player.stop_jump();
            }
        });
    } else {
        $('body').keydown(function(e) {
            if (!g.game_over){
                if (e.keyCode == UP) {
                    g.player.jump(UP);
                } else if (e.keyCode == DOWN) {
                    g.player.jump(DOWN);
                } else if (e.keyCode == SPACE) {
                    if (!g.shoot) {
                        g.player.shoot();
                    }
                }
            }
        });

        $('body').keyup(function(e) {
            if (!g.game_over){
                g.player.stop_jump();
            }
        });
    }

    $('#start_button').click(function() {
        g.start_game();
    });
}