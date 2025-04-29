const gameCanvas = document.getElementById("game-canvas");
const gameContext = gameCanvas.getContext("2d");
gameCanvas.width = window.innerWidth;
gameCanvas.height = window.innerHeight;

var previousTimeStamp = 0;
var maxDeltaTime = 20;

var player;
var camera;

function drawGameObject(gameObject) {
    gameContext.fillStyle = gameObject.color;
    let positionOnScreen = copyVector(gameObject.position);
    subVectors(positionOnScreen, camera.position);
    positionOnScreen.x += gameCanvas.width / 2;
    positionOnScreen.y += gameCanvas.height / 2;
    gameContext.fillRect(positionOnScreen.x, positionOnScreen.y,
        gameObject.scale.x, gameObject.scale.y);
}

function drawGameScreen() {
    gameContext.clearRect(0, 0, gameCanvas.width, gameCanvas.height);
    gameObjects.forEach(drawGameObject);
}

window.addEventListener('load', () => {
    player = Player(Vector2D(140,200));
    camera = Camera();
    Block(Vector2D(10, 400), Vector2D(500, 60));
    Block(Vector2D(410, 260), Vector2D(500, 60));
    Block(Vector2D(1110, 120), Vector2D(60, 500));
    Block(Vector2D(610, 620), Vector2D(500, 60));
    Block(Vector2D(970, 240), Vector2D(60, 300));
    Block(Vector2D(1200, 0), Vector2D(600, 60));
    Block(Vector2D(520, 500), Vector2D(60, 60));
    Enemy(Vector2D(460,-100), 300, 0.3, true);
    Enemy(Vector2D(1200,-100), 550, 0.1, true);
    Enemy(Vector2D(1200,-150), 550, 0.1, true);
    Enemy(Vector2D(1200,-200), 550, 0.1, true);
    Enemy(Vector2D(1200,-250), 550, 0.1, true);
    window.requestAnimationFrame(frame);
});

function frame(timeStamp) {
    if (!previousTimeStamp) {
        previousTimeStamp = timeStamp;
    }
    let deltaTime = timeStamp - previousTimeStamp;
    if (deltaTime > maxDeltaTime) {
        deltaTime = maxDeltaTime;
    }
    updateGameObjects(deltaTime);
    if(player.reset){
        player = Player(Vector2D(140,200));
    }
    gameObjects = gameObjects.filter(gameObject => {
        return !gameObject.destroy;
    });
    drawGameScreen();
    window.requestAnimationFrame(frame);
}