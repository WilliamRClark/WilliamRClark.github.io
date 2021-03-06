var Game = (function () {
    function Game() {
        this.gameOver = false;
        this.game = new Phaser.Game(1280, 1024, Phaser.AUTO, 'content', { init: Game.init, preload: Game.preload, create: Game.create, update: Game.update });
        this.laserAudio = new LaserSoundSprite(this.game);
        this.effectAudio = new EffectsSoundSprite(this.game);
        Game.instance = this;
    }
    Game.init = function () {
        console.log("Phaser init()");
        var self = Game.instance;
        self.game.renderer.renderSession.roundPixels = true;
        self.game.physics.startSystem(Phaser.Physics.ARCADE);
    };
    Game.preload = function () {
        console.log("Phaser preload()");
        var self = Game.instance;
        self.game.load.json('CirclePath10', './assets/data/CirclePath10.json');
        self.game.load.image('background', './assets/images/back.png');
        self.game.load.image('foreground', './assets/images/fore.png');
        self.game.load.image('player', './assets/images/FighterBlue.png');
        self.game.load.spritesheet('kaboom', './assets/images/explode.png', 128, 128);
        self.game.load.spritesheet('alien', './assets/images/invader32x32x4.png', 32, 32);
        for (var i = 1; i <= 11; i++) {
            self.game.load.image('bullet' + i, './assets/images/bullet' + i + '.png');
        }
        self.game.load.bitmapFont('shmupfont', './assets/images/shmupfont.png', './assets/shmupfont.xml');
        self.laserAudio.preload();
        self.effectAudio.preload();
        self.game.load.audio("GameOver", "assets/sounds/Nevermore.mp3");
        self.explosions = self.game.add.group();
        self.explosions.createMultiple(30, 'kaboom');
    };
    Game.create = function () {
        console.log("Phaser create()");
        var self = Game.instance;
        self.laserAudio.create();
        self.effectAudio.create();
        self.game.load.spritesheet('kaboom', 'assets/images/explode.png', 128, 128);
        self.background = self.game.add.tileSprite(0, 0, self.game.width, self.game.height, 'background');
        self.background.autoScroll(-40, 0);
        self.speed = 300;
        self.weapons = [];
        self.weapons.push(new SingleBullet(self.game, self.laserAudio));
        self.weapons.push(new FrontAndBack(self.game, self.laserAudio));
        self.weapons.push(new ThreeWay(self.game, self.laserAudio));
        self.weapons.push(new EightWay(self.game, self.laserAudio));
        self.weapons.push(new ScatterShot(self.game, self.laserAudio));
        self.weapons.push(new Beam(self.game, self.laserAudio));
        self.weapons.push(new SplitShot(self.game, self.laserAudio));
        self.weapons.push(new Pattern(self.game, self.laserAudio));
        self.weapons.push(new Rockets(self.game, self.laserAudio));
        self.weapons.push(new ScaleBullet(self.game, self.laserAudio));
        self.weapons.push(new Combo1(self.game, self.laserAudio));
        self.weapons.push(new Combo2(self.game, self.laserAudio));
        self.currentWeapon = 0;
        for (var i = 1; i < self.weapons.length; i++) {
            self.weapons[i].visible = false;
        }
        self.player = self.game.add.sprite(64, 200, 'player');
        self.player.animations.add('kaboom');
        self.game.physics.arcade.enable(self.player);
        self.game.physics.arcade.checkCollision.down = true;
        self.game.physics.arcade.checkCollision.up = true;
        self.game.physics.arcade.checkCollision.left = true;
        self.game.physics.arcade.checkCollision.right = true;
        self.player.body.collideWorldBounds = true;
        self.currentAlienWave = new AlienWave(self.game);
        self.foreground = self.game.add.tileSprite(0, 0, self.game.width, self.game.height, 'foreground');
        self.foreground.autoScroll(-120, 0);
        self.weaponName = self.game.add.bitmapText(8, 900, 'shmupfont', "ENTER = Next Weapon", 24);
        self.stateText = self.game.add.text(self.game.world.centerX, self.game.world.centerY, ' ', { font: '84px Arial', fill: '#fff' });
        self.stateText.anchor.setTo(0.5, 0.5);
        self.stateText.visible = false;
        self.cursors = self.game.input.keyboard.createCursorKeys();
        self.game.input.keyboard.addKeyCapture([Phaser.Keyboard.SPACEBAR]);
        var changeKey = self.game.input.keyboard.addKey(Phaser.Keyboard.ENTER);
        changeKey.onDown.add(self.nextWeapon, self);
    };
    Game.update = function () {
        var self = Game.instance;
        self.player.body.velocity.set(0);
        if (self.gameOver == false) {
            if (self.cursors.left.isDown) {
                self.player.body.velocity.x = -self.speed;
            }
            else if (self.cursors.right.isDown) {
                self.player.body.velocity.x = self.speed;
            }
            if (self.cursors.up.isDown) {
                self.player.body.velocity.y = -self.speed;
            }
            else if (self.cursors.down.isDown) {
                self.player.body.velocity.y = self.speed;
            }
            if (self.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
                self.weapons[self.currentWeapon].fire(self.player);
            }
        }
        self.game.physics.arcade.overlap(self.currentAlienWave.aliens, self.player, function (alien, player) {
            Game.playerHitsAlien(alien, player);
        });
        self.game.physics.arcade.collide(self.weapons[self.currentWeapon], self.currentAlienWave.aliens, function (bullet, alien) {
            self.bulletHitsAlien(bullet, alien);
        });
        self.currentAlienWave.moveAliens();
    };
    Game.prototype.nextWeapon = function () {
        console.log('Changing weapon.');
        if (this.currentWeapon > 9) {
            this.weapons[this.currentWeapon].reset();
        }
        else {
            this.weapons[this.currentWeapon].visible = false;
            this.weapons[this.currentWeapon].callAll('reset', null, 0, 0);
            this.weapons[this.currentWeapon].setAll('exists', false);
        }
        this.currentWeapon++;
        if (this.currentWeapon === this.weapons.length) {
            this.currentWeapon = 0;
        }
        this.weapons[this.currentWeapon].visible = true;
        this.weaponName.text = this.weapons[this.currentWeapon].name;
    };
    Game.prototype.bulletHitsAlien = function (bullet, alien) {
        var self = Game.instance;
        console.log("Bullet hits alien");
        bullet.kill();
        alien.kill();
        Game.fireyDeath(alien);
        if (self.currentAlienWave.allDead() == true) {
            self.stateText.text = "TOTAL VICTORY !!!";
            self.stateText.visible = true;
            self.gameOver = true;
        }
    };
    Game.playerHitsAlien = function (player, alien) {
        var self = Game.instance;
        console.log("Player hits alien");
        player.kill();
        alien.kill();
        Game.fireyDeath(player);
        self.stateText.text = "GAME OVER !!!";
        self.stateText.visible = true;
        self.gameOver = true;
        var music = self.game.add.audio("GameOver");
        music.play();
    };
    Game.fireyDeath = function (dyingSprite) {
        var self = Game.instance;
        var fireyDeath = self.game.add.sprite(dyingSprite.body.x, dyingSprite.body.y, "kaboom");
        fireyDeath.anchor.setTo(0.5, 0.5);
        fireyDeath.animations.add('boom');
        fireyDeath.play('boom', 15, false, true);
        self.effectAudio.play(EffectsSoundSprite.ALIEN_DEATH);
    };
    return Game;
}());
window.onload = function () {
    var gameInstance = new Game();
};
