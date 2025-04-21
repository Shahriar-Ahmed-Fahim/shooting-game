let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

const gridSize = 15;
const tileCountX = canvas.width / gridSize;
const tileCountY = canvas.height / gridSize;

let dx = 0;
let dy = 0;

let shipDirection = "up";
let numOfEnemy = 0;

let playerShip = [
    {x: tileCountX / 2, y: tileCountY / 2},
    {x: (tileCountX / 2) + 1, y: (tileCountY / 2) + 1},
    {x: (tileCountX / 2), y: (tileCountY / 2) + 1},
    {x: (tileCountX / 2) - 1, y: (tileCountY / 2) + 1},
    {x: (tileCountX / 2) + 1, y: (tileCountY / 2) + 2},
    {x: (tileCountX / 2), y: (tileCountY / 2) + 2},
    {x: (tileCountX / 2) - 1, y: (tileCountY / 2) + 2},
]

let enemyShipRandomXValue;
let enemyShipRandomYValue;

let enemyShips = []

document.addEventListener("keydown", (e)=>{
    if (e.key === "ArrowUp") {
        if (shipDirection !== "up") {
            rotatePlayerShip("up");
        }else{
            dx = 0;
            dy = -1;
            updatePlayerShip();
        }
    }
    else if (e.key === "ArrowDown") {
        if (shipDirection !== "down") {
            rotatePlayerShip("down");
        }else{
            dx = 0;
            dy = 1;
            updatePlayerShip();
        }
    }
    else if (e.key === "ArrowLeft") {
        if (shipDirection !== "left") {
            rotatePlayerShip("left");
        }else{
            dx = -1;
            dy = 0;
            updatePlayerShip();
        }
    }
    else if (e.key === "ArrowRight") {
        if (shipDirection !== "right") {
            rotatePlayerShip("right");
        }else{
            dx = 1;
            dy = 0;
            updatePlayerShip();
        }
    }
})

function rotatePlayerShip(direction) {
    let minX = playerShip[0].x;
    let maxX = playerShip[0].x;
    let minY = playerShip[0].y;
    let maxY = playerShip[0].y;

    for (let i = 1; i < playerShip.length; i++) {
        if (playerShip[i].x < minX) minX = playerShip[i].x;
        if (playerShip[i].x > maxX) maxX = playerShip[i].x;
        if (playerShip[i].y < minY) minY = playerShip[i].y;
        if (playerShip[i].y > maxY) maxY = playerShip[i].y;
    }

    let uniqueX = [...new Set(playerShip.map(p => p.x))];
    let uniqueY = [...new Set(playerShip.map(p => p.y))];
    let avgUniqueX = uniqueX.reduce((sum, val) => sum + val, 0) / uniqueX.length;
    let avgUniqueY = uniqueY.reduce((sum, val) => sum + val, 0) / uniqueY.length;

    if (direction === "up") {
        playerShip[0].x = avgUniqueX;
        playerShip[0].y = minY;
        playerShip[1].x = minX;
        playerShip[1].y = minY+1;
        playerShip[2].x = minX+1;
        playerShip[2].y = minY+1;
        playerShip[3].x = minX+2;
        playerShip[3].y = minY+1;
        playerShip[4].x = minX;
        playerShip[4].y = minY+2;
        playerShip[5].x = minX+1;
        playerShip[5].y = minY+2;
        playerShip[6].x = minX+2;
        playerShip[6].y = minY+2;
    }else if (direction === "down"){
        playerShip[0].x = avgUniqueX;
        playerShip[0].y = maxY;
        playerShip[1].x = minX;
        playerShip[1].y = minY+1;
        playerShip[2].x = minX+1;
        playerShip[2].y = minY+1;
        playerShip[3].x = minX+2;
        playerShip[3].y = minY+1;
        playerShip[4].x = minX;
        playerShip[4].y = minY;
        playerShip[5].x = minX+1;
        playerShip[5].y = minY;
        playerShip[6].x = minX+2;
        playerShip[6].y = minY;
    }else if (direction === "left"){
        playerShip[0].x = minX;
        playerShip[0].y = avgUniqueY;
        playerShip[1].x = minX+1;
        playerShip[1].y = minY;
        playerShip[2].x = minX+2;
        playerShip[2].y = minY;
        playerShip[3].x = minX+1;
        playerShip[3].y = minY+1;
        playerShip[4].x = minX+2;
        playerShip[4].y = minY+1;
        playerShip[5].x = minX+1;
        playerShip[5].y = minY+2;
        playerShip[6].x = minX+2;
        playerShip[6].y = minY+2;
    }else if (direction === "right"){
        playerShip[0].x = maxX;
        playerShip[0].y = avgUniqueY;
        playerShip[1].x = minX;
        playerShip[1].y = minY;
        playerShip[2].x = minX+1;
        playerShip[2].y = minY;
        playerShip[3].x = minX;
        playerShip[3].y = minY+1;
        playerShip[4].x = minX+1;
        playerShip[4].y = minY+1;
        playerShip[5].x = minX;
        playerShip[5].y = minY+2;
        playerShip[6].x = minX+1;
        playerShip[6].y = minY+2;
    }

    drawGame();

    shipDirection = direction;
}

function drawGame(){
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "lime";
    for(let i = 0; i < playerShip.length; i++){
        ctx.fillRect(playerShip[i].x * gridSize , playerShip[i].y * gridSize, gridSize - 2, gridSize - 2);
    }

    drawEnemies();
}

function drawEnemies(){

    ctx.fillStyle = "red";
    for (let i = 0; i < enemyShips.length; i++) {
        let ship = enemyShips[i];
        for (let j = 0; j < ship.length; j++) {
            let part = ship[j];
            ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize - 2, gridSize - 2);
        }
    }
}

function generateEnemies(){
    if(enemyShips.length >= 4) return;
    enemyShipRandomXValue = Math.floor(Math.random()*tileCountX);
    enemyShipRandomYValue = Math.floor(Math.random()*tileCountY);
    const newShip = [
        {x: enemyShipRandomXValue / 2, y: enemyShipRandomYValue / 2},
        {x: (enemyShipRandomXValue / 2) + 1, y: (enemyShipRandomYValue / 2) + 1},
        {x: (enemyShipRandomXValue / 2), y: (enemyShipRandomYValue / 2) + 1},
        {x: (enemyShipRandomXValue / 2) - 1, y: (enemyShipRandomYValue / 2) + 1},
        {x: (enemyShipRandomXValue / 2) + 1, y: (enemyShipRandomYValue / 2) + 2},
        {x: (enemyShipRandomXValue / 2), y: (enemyShipRandomYValue / 2) + 2},
        {x: (enemyShipRandomXValue / 2) - 1, y: (enemyShipRandomYValue / 2) + 2},
    ];

    enemyShips.push(newShip);
}

function updatePlayerShip(){
    const head = {x: playerShip[0].x + dx, y: playerShip[0].y + dy};

    if(head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
        return;
    }

    for(let i = 0; i < playerShip.length; i++){
        playerShip[i].x += dx;
        playerShip[i].y += dy;
    }
    drawGame();
}


function gameLoop(){
    drawGame();
    setTimeout(gameLoop, 100); 
}

function getEnemies() {
    if(enemyShips.length < 4) generateEnemies();

    setTimeout(getEnemies(), 5000);
}



gameLoop();
setTimeout(() => {
    generateEnemies();
}, 1000);

getEnemies();

