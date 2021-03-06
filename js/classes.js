class Sprite {
    constructor({
        position,
        imgSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 },
    }) {
        this.position = position;
        this.width = 50;
        this.height = 150;
        this.image = new Image();
        this.image.src = imgSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.offset = offset;
    }
    animateFrames() {
        this.framesElapsed++;
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++;
            } else this.framesCurrent = 0;
        }
    }
    draw() {
        c.drawImage(
            // c.scale(1, 1)
            this.image,
            //crop location
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            //image size
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale
        );
    }
    // mirrorDraw() {
    //     c.scale(-1, 1);
    //     c.drawImage(
    //         this.image,
    //         //crop location
    //         this.framesCurrent * (this.image.width / this.framesMax),
    //         0,
    //         this.image.width / this.framesMax,
    //         this.image.height,
    //         //image size
    //         this.position.x - this.offset.x,
    //         this.position.y - this.offset.y,
    //         (this.image.width / this.framesMax) * this.scale,
    //         this.image.height * this.scale
    //     );
    // }
    update() {
        this.draw();
        this.animateFrames();
    }
    // mirrorUpdate() {
    //     c.setTransform(1, 0, 0, 1, 0, 0);
    //     this.mirrorDraw();
    //     this.animateFrames();
    // }
}
class Fighter extends Sprite {
    constructor({
        name,
        health = 100,
        position,
        velocity,
        speed = 5,
        jump = 15,
        imgSrc,
        scale = 1,
        framesMax = 1,
        offset = { x: 0, y: 0 },
        sprites,
        attackBox = { offset: {}, width: undefined, height: undefined },
        att1 = { damage: 20, dFrame: 4, knockBack: 100 },
    }) {
        super({
            imgSrc,
            scale,
            framesMax,
            position,
            offset,
        });
        this.name = name;
        this.health = health;
        this.velocity = velocity;
        this.speed = speed;
        this.jump = jump;
        this.width = 50;
        this.height = 150;
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y,
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height,
        };
        this.isAttacking;
        this.att1 = att1;
        this.framesCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = 5;
        this.sprites = sprites;
        this.dead = false;

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imgSrc;
        }
    }
    attack() {
        this.switchSprite("attack1");
        this.isAttacking = true;
    }
    switchSprite(sprite) {
        if (this.image === this.sprites.death.image) {
            if (this.framesCurrent === this.sprites.death.framesMax - 1)
                this.dead = true;
            return;
        }
        if (
            this.image === this.sprites.takeHit.image &&
            this.framesCurrent < this.sprites.takeHit.framesMax - 1
        )
            return;
        if (
            this.image === this.sprites.attack1.image &&
            this.framesCurrent < this.sprites.attack1.framesMax - 1
        )
            return;
        switch (sprite) {
            case "idle":
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case "run":
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case "jump":
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case "fall":
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case "attack1":
                if (this.image !== this.sprites.attack1.image) {
                    this.image = this.sprites.attack1.image;
                    this.framesMax = this.sprites.attack1.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case "takeHit":
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image;
                    this.framesMax = this.sprites.takeHit.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case "death":
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image;
                    this.framesMax = this.sprites.death.framesMax;
                    this.framesCurrent = 0;
                }
                break;
        }
    }
    takeHit(dam) {
        if (this.sprites !== "takeHit") {
            this.health - dam <= 0 ? (this.health = 0) : (this.health -= dam);
            this.health === 0
                ? this.switchSprite("death")
                : this.switchSprite("takeHit");
        } else return;
    }
    update() {
        this.draw();
        if (!this.dead) this.animateFrames();
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;
        //uncomment to draw the attack boxes
        // c.fillRect(
        //     this.attackBox.position.x,
        //     this.attackBox.position.y,
        //     this.attackBox.width,
        //     this.attackBox.height
        // );

        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;
        if (
            this.position.y + this.height + this.velocity.y >=
            canvas.height - 96
        ) {
            this.velocity.y = 0;
            this.position.y = 330;
        } else this.velocity.y += gravity;

        // if (this.position.x <= canvas.position.x + 3) {
        //     this.velocity.x = 0;
        //     this.position.x = canvas.position.x + 3;
        // }
    }
}
