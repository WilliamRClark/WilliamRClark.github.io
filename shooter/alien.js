var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Alien = (function (_super) {
    __extends(Alien, _super);
    function Alien(game, x, y) {
        var _this = _super.call(this, game, x, y, 'alien') || this;
        _this.currentAngle = 0;
        _this.pathLocation = 0;
        _this.xOrigin = x;
        _this.yOrigin = y;
        _this.animations.add('fly', [0, 1, 2, 3], 20, true);
        _this.animations.play('fly');
        game.physics.arcade.enable(_this);
        Alien.pathMap = game.cache.getJSON('CirclePath10');
        return _this;
    }
    Alien.create = function (game, group, x, y) {
        var newAlien = new Alien(game, x, y);
        group.add(newAlien);
        return newAlien;
    };
    Alien.prototype.move = function () {
        this.x += Alien.pathMap[this.pathLocation].X;
        this.y += Alien.pathMap[this.pathLocation].Y;
        this.pathLocation++;
        if (Alien.pathMap[this.pathLocation] == undefined) {
            this.pathLocation = 0;
        }
    };
    return Alien;
}(Phaser.Sprite));
