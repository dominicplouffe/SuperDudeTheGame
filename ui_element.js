function ui_element(el, top, left, height, width, zIndex, game) {
    this.set_dimension = function() {
        this.dimension = {
            'left': this.left(),
            'right': this.left() + this.width(),
            'top': this.top(),
            'bottom': this.top() + this.height(),
            'width': this.width(),
            'height': this.height()
        };
    };

    this.top = function() {
        var top = parseInt(this._el.css('top'), 10);
        return top;
    };

    this.left = function() {
        var left = parseInt(this._el.css('left'), 10);
        return left;
    };

    this.height = function() {
        var height = parseInt(this._el.css('height'), 10);
        return height;
    };

    this.width = function() {
        var width = parseInt(this._el.css('width'), 10);
        return width;
    };

    this.move_down = function() {
        var top = parseInt(this._el.css('top'), 10);
        top += this._game.rise_rate;

        if (top > this._game.barrier.down) {
            return;
        }

        this.dimension.top = top;
        this.dimension.bottom = this.dimension.top + this.dimension.height;
        this._el.css('top', top + 'px');
    };


    this.move_up = function() {
        var top = parseInt(this._el.css('top'), 10);
        top -= this._game.rise_rate;
        
        if (top < this._game.barrier.up) {
            return;
        }

        this.dimension.top = top;
        this.dimension.bottom = this.dimension.top + this.dimension.height;
        this._el.css('top', top + 'px');
    };

    this.shoot = function() {

        if (this._game.number_of_bullets > 0)
        {
            $('#bullet').css('left', this.dimension.right + 'px');
            $('#bullet').css('top', (this.dimension.top) + 'px');
            $('#bullet').show();

            this._game.number_of_bullets -= 1;
            this._game.render_bullets();
            this._game.shoot = true;
        }
    };

    this.jump = function(direction) {
        if (!this._game.in_jump) {
            this.left_start = this._game.pipes[0][0].left();

            this._game.in_jump = true;
            this._game.jump_start = this._game.player.top();
            this._game.player.jump_direction = direction;
        } else {

        }
    };

    this.stop_jump = function() {
        this._game.in_jump = false;
        this._game.jump_start = null;
    };

    this._do_jump = function() {

        if (this._game.player.jump_direction == UP) {
            this._game.player.move_up();
        } else if (this._game.player.jump_direction == DOWN) {
            this._game.player.move_down();
        }

        if (this.left_start - this._game.pipes[0][0].left() >= 100) {
            console.log(this._game.jump_start);
            console.log(this._game.player.top());
        }

        //Check for border
        if (this._game.player.top() < 10) {
            this._game.in_jump = false;
            this._game.jump_start = null;
        } else if (this._game.player.top() + this._game.player.height() > this._game.box.height - 10) {
            this._game.in_jump = false;
            this._game.jump_start = null;
        }
    };

    this._el = $(el);
    this._el.css('top', top + 'px');
    this._el.css('left', left + 'px');

    if (height.indexOf && height.indexOf('%') > 0) {
        this._el.css('height', height);
        this._el.css('width', width);
    } else {
        this._el.css('height', height + 'px');
        this._el.css('width', width + 'px');
    }
    

    this._el.css('position','absolute');
    this._el.css('overflow','hidden');
    this._el.css('z-index', zIndex);
    this.set_dimension();
    
    this._game = game;
}