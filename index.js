const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;
const keys = {
    d: {
        pressed: false,
    },
    a: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
    ArrowLeft: {
        pressed: false,
    },
    ArrowRight: {
        pressed: false,
    },
    ArrowUp: {
        pressed: false,
    },
};

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imgSrc: "./img/background.png",
});
const shop = new Sprite({
    position: {
        x: 600,
        y: 128,
    },
    imgSrc: "./img/shop.png",
    scale: 2.75,
    framesMax: 6,
});

const enemy = new Fighter({
    name: "Kenji",
    position: {
        x: (canvas.width / 3) * 2,
        y: 330,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    speed: 7,
    jump: 20,
    offset: {
        x: -50,
        y: 0,
    },
    imgSrc: "./img/kenji/Idle.png",
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167,
    },
    sprites: {
        idle: {
            imgSrc: "./img/kenji/Idle.png",
            framesMax: 4,
        },
        run: {
            imgSrc: "./img/kenji/Run.png",
            framesMax: 8,
        },
        jump: {
            imgSrc: "./img/kenji/Jump.png",
            framesMax: 2,
        },
        fall: {
            imgSrc: "./img/kenji/Fall.png",
            framesMax: 2,
        },
        attack1: {
            imgSrc: "./img/kenji/Attack1.png",
            framesMax: 4,
        },
        takeHit: {
            imgSrc: "./img/kenji/Take hit.png",
            framesMax: 3,
        },
        death: {
            imgSrc: "./img/kenji/Death.png",
            framesMax: 7,
        },
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50,
        },
        width: 170,
        height: 50,
    },
    att1: {
        damage: 15,
        dFrame: 2,
        knockBack: 35,
    },
});
const player = new Fighter({
    name: "Samurai Mack",
    position: {
        x: canvas.width / 3 - 50,
        y: 330,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    imgSrc: "./img/samuraiMack/Idle.png",
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157,
    },
    sprites: {
        idle: {
            imgSrc: "./img/samuraiMack/Idle.png",
            framesMax: 8,
        },
        run: {
            imgSrc: "./img/samuraiMack/Run.png",
            framesMax: 8,
        },
        jump: {
            imgSrc: "./img/samuraiMack/Jump.png",
            framesMax: 2,
        },
        fall: {
            imgSrc: "./img/samuraiMack/Fall.png",
            framesMax: 2,
        },
        attack1: {
            imgSrc: "./img/samuraiMack/Attack1.png",
            framesMax: 6,
        },
        takeHit: {
            imgSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
            framesMax: 4,
        },
        death: {
            imgSrc: "./img/samuraiMack/Death.png",
            framesMax: 6,
        },
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50,
        },
        width: 160,
        height: 50,
    },
});

countdownTimer();

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    c.fillStyle = "rgba(255, 255, 255, 0.15)";
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;

    //player 1 movement
    if (keys.a.pressed && player.lastKey === "a") {
        player.velocity.x = player.speed * -1;
        player.switchSprite("run");
    } else if (keys.d.pressed && player.lastKey === "d") {
        player.velocity.x = player.speed;
        player.switchSprite("run");
    } else player.switchSprite("idle");
    //player 1 jump
    if (player.velocity.y < 0) {
        player.switchSprite("jump");
    } else if (player.velocity.y > 0) {
        player.switchSprite("fall");
    }
    //player 2 movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
        enemy.velocity.x = enemy.speed * -1;
        enemy.switchSprite("run");
    } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
        enemy.velocity.x = enemy.speed;
        enemy.switchSprite("run");
    } else enemy.switchSprite("idle");
    //player 2 jump
    if (enemy.velocity.y < 0) {
        enemy.switchSprite("jump");
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite("fall");
    }
    //collision detection
    if (
        collision({
            rectangle1: player,
            rectangle2: enemy,
        }) &&
        player.isAttacking &&
        player.framesCurrent === player.att1.dFrame
    ) {
        enemy.takeHit(player.att1.damage);
        enemy.velocity.x += player.att1.knockBack;
        enemy.velocity.y -= 2;
        player.isAttacking = false;
        gsap.to("#enemyHealth", {
            width: enemy.health + "%",
        });
    }
    //miss
    if (player.isAttacking && player.framesCurrent === player.att1.dFrame) {
        player.isAttacking = false;
    }
    //enemy collision detection
    if (
        collision({
            rectangle1: enemy,
            rectangle2: player,
        }) &&
        enemy.isAttacking &&
        enemy.framesCurrent === enemy.att1.dFrame
    ) {
        player.takeHit(enemy.att1.damage);
        player.velocity.x -= enemy.att1.knockBack;
        player.velocity.y -= 2;
        enemy.isAttacking = false;
        gsap.to("#playerHealth", {
            width: player.health + "%",
        });
    }

    if (enemy.isAttacking && enemy.framesCurrent === enemy.att1.dFrame) {
        enemy.isAttacking = false;
    }

    //end game state
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timerId });
    }
}

animate();

window.addEventListener("keydown", (event) => {
    //player 1
    if (!player.dead) {
        switch (event.key) {
            case "d":
                keys.d.pressed = true;
                player.lastKey = "d";
                break;
            case "a":
                keys.a.pressed = true;
                player.lastKey = "a";
                break;
            case "w":
                player.velocity.y === 0
                    ? (player.velocity.y += player.jump * -1)
                    : null;
                break;
            case " ":
                player.attack();
                break;
        }
    }
    //player two
    if (!enemy.dead) {
        switch (event.key) {
            case "ArrowRight":
                keys.ArrowRight.pressed = true;
                enemy.lastKey = "ArrowRight";
                break;
            case "ArrowLeft":
                keys.ArrowLeft.pressed = true;
                enemy.lastKey = "ArrowLeft";
                break;
            case "ArrowUp":
                enemy.velocity.y === 0
                    ? (enemy.velocity.y += enemy.jump * -1)
                    : null;
                break;
            case "ArrowDown":
                enemy.attack();
                break;
        }
    }
});
window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "d":
            keys.d.pressed = false;
            break;
        case "a":
            keys.a.pressed = false;
            break;
        case "w":
            keys.w.pressed = false;
            break;

        case "ArrowRight":
            keys.ArrowRight.pressed = false;
            break;
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false;
            break;
        case "ArrowUp":
            keys.ArrowUp.pressed = false;
            break;
    }
});
