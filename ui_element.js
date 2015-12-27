function ui_element(el, top, left, height, width, zIndex, game) {
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

    this._game = game;

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

        this._el.css('top', top + 'px');
    };


    this.move_up = function() {
        var top = parseInt(this._el.css('top'), 10);
        top -= this._game.rise_rate;
        
        if (top < this._game.barrier.up) {
            return;
        }

        this._el.css('top', top + 'px');
    };

    //  this.fall = function() {
    //     if (this._game.in_jump) return;
    //     var top = parseInt(this._el.css('top'), 10);
    //     top += this._game.fall_rate;

    //     if (top > this._game.barrier.down) {
    //         return;
    //     }

    //     this._el.css('top', top + 'px');
    // }

    this.jump = function(direction) {
        if (!this._game.in_jump) {
            this._game.in_jump = true;
            this._game.jump_start = this._game.player.top();
            this._game.player.jump_direction = direction;
        }
    };

    this._do_jump = function() {

        if (this._game.player.jump_direction == UP) {
            this._game.player.move_up();

            if (this._game.player.top() <= this._game.jump_start - this._game.jump_height) {
                this._game.in_jump = false;
                this._game.jump_start = null;
            }
        } else if (this._game.player.jump_direction == DOWN) {
            this._game.player.move_down();

            if (this._game.player.top() >= this._game.jump_start + this._game.jump_height) {
                this._game.in_jump = false;
                this._game.jump_start = null;
            }
        }

        //Check for border
        if (this._game.player.top() < 10) {
            this._game.in_jump = false;
            this._game.jump_start = null;
        } else if (this._game.player.top() + this._game.player.height() > this._game.box.height - 10) {
            this._game.in_jump = false;
            this._game.jump_start = null;
        }
        
        var g = this._game;

        
        // } else if (this._game.player.top() > this._game.jump_start - this._game.jump_height) {
            
        // } else {
        //     this._game.in_jump = false;
        //     this._game.jump_start = null;
        // }
    };
}