function game_player() {

    var rise_rate = localStorage.getItem('rise_rate');
    if (rise_rate === null) this.rise_rate = 1; else this.rise_rate = parseInt(rise_rate, 10);

    var fall_rate = localStorage.getItem    ('fall_rate');
    if (fall_rate === null) this.fall_rate = 1; else this.fall_rate = parseInt(fall_rate, 10);

    this.coins = localStorage.getItem('coins');
    if (this.coins === null) this.coins = 0; else this.coins = parseInt(this.coins, 10);

    var shield_length = localStorage.getItem('shield_length');
    if (shield_length === null) this.shield_length = 5000; else this.shield_length = parseInt(shield_length, 10);

    this.speed_value = function() {
        return this.rise_rate * 250;
    };

    this.buy_speed = function() {
        if (this.coins < this.speed_value()) {
            return false;
        }

        this.coins -= this.speed_value();
        localStorage.setItem('coins', this.coins);

        this.rise_rate += 1;
        localStorage.setItem('rise_rate', this.rise_rate);

        this.fall_rate += 1;
        localStorage.setItem('fall_rate', this.fall_rate);

        return true;
    };

    this.sell_speed = function() {
        if (this.rise_rate  == 1) {
            return false;
        }

        this.coins += 250;
        localStorage.setItem('coins', this.coins);

        this.rise_rate -= 1;
        localStorage.setItem('rise_rate', this.rise_rate);

        this.fall_rate -= 1;
        localStorage.setItem('fall_rate', this.fall_rate);

        return true;
    };

    this.shield_value = function() {
        return (this.shield_length / 5000) * 250;
    };

    this.buy_shield = function() {
        if (this.coins < this.shield_value()) {
            return false;
        }

        this.coins -= this.shield_value();
        localStorage.setItem('coins', this.coins);

        this.shield_length += 5000;
        localStorage.setItem('shield_length', this.shield_length);

        return true;
    };

    this.sell_shield = function() {
        if (this.rise_rate  == 5000) {
            return false;
        }

        this.coins += 250;
        localStorage.setItem('coins', this.coins);

        this.shield_length -= 5000;
        localStorage.setItem('shield_length', this.shield_length);

        return true;
    };


}