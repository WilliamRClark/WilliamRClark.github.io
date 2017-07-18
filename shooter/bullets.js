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
var Bullet = (function (_super) {
    __extends(Bullet, _super);
    function Bullet(game, key) {
        var _this = _super.call(this, game, 0, 0, key) || this;
        _this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;
        _this.anchor.set(0.5);
        _this.checkWorldBounds = true;
        _this.outOfBoundsKill = true;
        _this.exists = false;
        _this.tracking = false;
        _this.scaleSpeed = 0;
        return _this;
    }
    Bullet.prototype.fire = function (x, y, angle, speed, gx, gy) {
        gx = gx || 0;
        gy = gy || 0;
        this.reset(x, y);
        this.scale.set(1);
        this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);
        this.angle = angle;
        this.body.gravity.set(gx, gy);
    };
    Bullet.prototype.update = function () {
        if (this.tracking) {
            this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
        }
        if (this.scaleSpeed > 0) {
            this.scale.x += this.scaleSpeed;
            this.scale.y += this.scaleSpeed;
        }
    };
    return Bullet;
}(Phaser.Sprite));
