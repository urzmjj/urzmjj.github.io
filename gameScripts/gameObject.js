var gameObjects = [];
var currentId = 0;
function GameObject(position, scale, color) {
    let gameObject = {
        id: currentId,
        position: position,
        velocity: Vector2D(0, 0),
        scale: scale,
        color: color,
        solid: true,
        onUpdate: deltaTime => { },
        onCollision: other => { },
        g: 0.002,
        grounded: false,
        wallLeft: false,
        wallRight: false,
        ceiling: false
    };
    currentId++;
    gameObjects.push(gameObject);
    return gameObject;
}

function Player(position) {
    let player = GameObject(position, Vector2D(50, 50), "blue");
    player.walkSpeed = 0.5;
    player.jumpSpeed = 1.0;
    player.maxJumpTime = 1000;
    player.jumpTime = 0;
    player.wallJumpDirection = 0;
    player.wallJumpTime = 0;
    player.startJumpG = player.g;
    player.endJumpG = player.g * 2;
    player.onUpdate = deltaTime => {
        if (player.grounded) {
            player.jumpTime = 0;
            player.g = player.startJumpG;
        }
        player.velocity.x = 0;
        if ((controls.left.pressed || (player.wallJumpDirection < 0 && player.wallJumpTime > 0))&& !(player.wallJumpDirection > 0 && player.wallJumpTime > 0)) {
            player.velocity.x -= player.walkSpeed;
        }
        if ((controls.right.pressed || (player.wallJumpDirection > 0 && player.wallJumpTime > 0))&& !(player.wallJumpDirection < 0 && player.wallJumpTime > 0)) {
            player.velocity.x += player.walkSpeed;
        }
        if (controls.up.pressed) {
            if (player.grounded && player.jumpTime < player.maxJumpTime) {
                player.velocity.y = -player.jumpSpeed;
            }else if(player.wallLeft && !player.wallRight && player.wallJumpDirection <= 0){
                player.velocity.x += player.walkSpeed;
                player.wallJumpDirection = 1;
                player.wallJumpTime = 500;
                player.velocity.y = -player.jumpSpeed;
            }else if(!player.wallLeft && player.wallRight && player.wallJumpDirection >= 0){
                player.velocity.x -= player.walkSpeed;
                player.wallJumpDirection = -1;
                player.wallJumpTime = 500;
                player.velocity.y = -player.jumpSpeed;
            }
            if(player.jumpTime < player.maxJumpTime)
            {player.jumpTime += deltaTime;}
        } else {
            player.jumpTime = player.maxJumpTime;
            player.g = player.endJumpG;
        }
        player.wallJumpTime -= deltaTime;
        if(player.wallLeft || player.wallRight){
            player.velocity.y /= 2;
        }
        if(player.grounded){
            player.wallJumpDirection = 0;
        }
        if(player.y > 1080){
            player.reset = true;
            player.destroy = true;
        }
    };

    player.onCollision = other => {
        if (other.damage) {
            if(!other.canBeStompedOn){
                player.reset = true;
                player.destroy = true;
            }else{
                player.grounded = false;
                blockGameObject(player, other);
                if(player.grounded){
                    other.destroy = true;
                    player.velocity.y = -player.jumpSpeed;
                }else{
                    player.reset = true;
                    player.destroy = true;
                }
            }
        }
    };

    return player;
}

function Block(position, scale) {
    let block = GameObject(position, scale, "black");
    block.g = 0;
    return block;
}

function Camera() {
    let camera = GameObject(copyVector(player.position), Vector2D(0, 0));
    camera.g = 0;
    camera.solid = false;
    camera.followPresentage = 0.005;
    camera.onUpdate = deltaTime => {
        vectorMulNum(camera.velocity, 0);
        addVectors(camera.velocity, player.position);
        subVectors(camera.velocity, camera.position);
        vectorMulNum(camera.velocity, camera.followPresentage);
    };
    return camera;
}

function Enemy(position, maxWalkDistance, walkSpeed, canBeStompedOn) {
    let enemy = GameObject(position, Vector2D(50,50),"red");
    enemy.damage = true;
    enemy.canBeStompedOn = canBeStompedOn;
    enemy.walkSpeed = walkSpeed;
    enemy.maxWalkTime = maxWalkDistance/walkSpeed;
    enemy.time = 0;

    enemy.onUpdate = deltaTime => {
        enemy.velocity.x = enemy.walkSpeed;
        enemy.time += deltaTime;
        if (enemy.time >= enemy.maxWalkTime) {
            enemy.time = 0;
            enemy.walkSpeed *= -1;
        }
    }
    return enemy;
}