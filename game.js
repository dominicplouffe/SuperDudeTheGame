function game() {

    this.get_barrier = function(el, player) {

        var barrier = {};
        barrier.up = 0;
        barrier.left = 0;
        barrier.down = el.height() - player.height();
        barrier.right = el.width() - player.width();

        return barrier;
    }

    
    this.animate = function() {

        if (this.in_jump) {
            this.player._do_jump();
        } else {
            this.player.fall();
        }

        if (g.pipes.length > 0) {
            this.move_pipes();

            var last_pipe = this.pipes[this.pipes.length-1];
            if (last_pipe[0].left() == this.box.width() - (last_pipe[0].width() + this.horizontal_space + 1)) {
                this.insert_pipe();
            }
        }

        this.is_game_over();
    }

    this.insert_pipe = function() {

        var pipe_id_down = 'pipe_down' + g.pipe_count;
        var pipe_id_up = 'pipe_up' + g.pipe_count;
        var html = '<img src="images/pipe.png" class="in_game_element" id="' + pipe_id_down + '" />';
        html += '<img src="images/pipe.png" class="in_game_element" id="' + pipe_id_up + '" />';

        g.box._el.append(html);

        var left = g.box.width() + 1;

        //Down Pipe
        var up_down_max = this.box.height() / 2;
        if (g.pipes.length > 0){
            up_down_max = g.pipes[g.pipes.length-1][0].top() * 0.2;
        }
        

        var pipe_height = 50 + Math.floor((Math.random() * up_down_max) + 1);
        var pipe_down = new ui_element($('#' + pipe_id_down), 0, 0, pipe_height, 60, g.zIndex, g);
        var top = g.box.height() - pipe_down.height();
        pipe_down._el.css('left', left + 'px');
        pipe_down._el.css('top', top + 'px');

        //Up Pipe
        pipe_height = this.box.height() - pipe_height - this.vertical_space;
        var pipe_up = new ui_element($('#' + pipe_id_up), 0, 0, pipe_height, 60, g.zIndex, g);
        pipe_up._el.css('left', left + 'px');
        pipe_up._el.rotate(180);
        

        g.pipe_count += 1;
        g.zIndex += 1;
        g.pipes.push([pipe_down, pipe_up]);

    }

    this.move_pipes = function() {
        for (var i = 0; i < this.pipes.length; i++) {
            var pipe = this.pipes[i];

            left = pipe[0].left();
            left -= this.pipe_move_rate;
            pipe[0]._el.css('left', left + 'px');
            pipe[1]._el.css('left', left + 'px');
            

            if (left < 0 - pipe[0].width()) {
                this.pipes.shift();
            }
        }
    }

    this.get_dimension = function(el) {
        return {
            'left': el.left(),
            'right': el.left() + el.width(),
            'top': el.top(),
            'bottom': el.top() + el.height()
        }
    }

    this.colide_with_pipes = function(player, pipe_down, pipe_up) {
        var player_dim = this.get_dimension(player);
        var pipe_down_dim = this.get_dimension(pipe_down);
        var pipe_up_dim = this.get_dimension(pipe_up);

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

        if (pipe_down_dim.right < player_dim.left && !pipe_down.counted) {
            pipe_down.counted = true;
            this.points += 1;
            this.set_points(this.points);

            this.level = parseInt(this.points / this.points_per_level, 10) + 1;
            this.pipe_move_rate = this.level;
        }
    };

    this.is_game_over = function() {
        if (g.player.top() >= g.box.height() - g.player.height() - 1) {
            this.game_over = true;
        }

        for (var i = 0; i < this.pipes.length; i++) {
            var pipe = this.pipes[i];
            this.colide_with_pipes(this.player, pipe[0], pipe[1]);
        }

        if (this.game_over) {
            clearInterval(this.game_interval_id);
            $('#start_button').show();
        }
    };

    this.set_points = function(points) {
        this.points = points;
        $('#num_points').html(points);


    };

    this.start_game = function() {
        $('#start_button').hide();
        $('.in_game_element').hide();

        this.pipes = [];
        this.in_jump = false;
        this.jump_start = null;
        this.player = new ui_element($('#player'), 115, 75, 30, 40, 3, this);

        this.game_interval_id = setInterval(function() { game_instance.animate();}, 10);
        this.game_over = false;
        this.set_points(0);

        this.insert_pipe();
    }

    //CONFIGURATION OPTIONS
    this.vertical_space = 80;
    this.horizontal_space = 100;
    this.player_give = 10;
    this.rise_rate = 2;
    this.fall_rate = 1;
    this.pipe_move_rate = 1;
    this.jump_height = 40;
    this.level = 1;
    this.points_per_level = 10;


    this.game_interval_id = null;
    this.game_over = true;
    this.points = 0;
    

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
        this.box._el.on('touchend',function (e){
            g.player.jump();
        });
    } else {
        this.box._el.on('click',function (e){
            if (!g.game_over){
                g.player.jump();
            }
        });
    }

    $('#start_button').css('left', (this.box.width() / 2) - (parseInt($('#start_button').css('width'), 10) / 2 ));
    $('#start_button').css('top', (this.box.height() / 2) - (parseInt($('#start_button').css('height'), 10) / 2 ));

    $('#start_button').click(function() {
        g.start_game();
    });
}