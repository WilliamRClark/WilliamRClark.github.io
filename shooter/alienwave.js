var AlienWave = (function () {
    function AlienWave(game) {
        var self = this;
        this.aliens = game.add.group();
        Alien.create(game, this.aliens, 100, 100);
        Alien.create(game, this.aliens, 200, 400);
        Alien.create(game, this.aliens, 200, 300);
        Alien.create(game, this.aliens, 400, 100);
        Alien.create(game, this.aliens, 400, 800);
        Alien.create(game, this.aliens, 100, 400);
    }
    AlienWave.prototype.moveAliens = function () {
        this.aliens.forEach(function (alien) {
            if (alien.alive == false) {
                return;
            }
            alien.move();
        }, this);
    };
    AlienWave.prototype.allDead = function () {
        return (this.aliens.countLiving() < 1);
    };
    return AlienWave;
}());
;
