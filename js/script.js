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

let playerBullet = []

let enemyShipRandomXValue;
let enemyShipRandomYValue;

let enemyShips = []

document.addEventListener("keydown", (e)=>{    
    if (e.key === "ArrowUp") {
        if (shipDirection !== "up") {
            rotatePlayerShip(playerShip, "up");
        }else{
            dx = 0;
            dy = -1;
            updatePlayerShip();
        }
    }
    else if (e.key === "ArrowDown") {
        if (shipDirection !== "down") {
            rotatePlayerShip(playerShip, "down");
        }else{
            dx = 0;
            dy = 1;
            updatePlayerShip();
        }
    }
    else if (e.key === "ArrowLeft") {
        if (shipDirection !== "left") {
            rotatePlayerShip(playerShip, "left");
        }else{
            dx = -1;
            dy = 0;
            updatePlayerShip();
        }
    }
    else if (e.key === "ArrowRight") {
        if (shipDirection !== "right") {
            rotatePlayerShip(playerShip, "right");
        }else{
            dx = 1;
            dy = 0;
            updatePlayerShip();
        }
    }else if(e.key === " "){
        firePlayerBullet(shipDirection);
    }
})

function rotatePlayerShip(ship, direction) {

    let { minX, maxX, minY, maxY } = getMinMaxCoordinates(ship);
    let uniqueX = [...new Set(ship.map(p => p.x))];
    let uniqueY = [...new Set(ship.map(p => p.y))];
    let avgUniqueX = uniqueX.reduce((sum, val) => sum + val, 0) / uniqueX.length;
    let avgUniqueY = uniqueY.reduce((sum, val) => sum + val, 0) / uniqueY.length;

    if (direction === "up") {
        ship[0].x = avgUniqueX;
        ship[0].y = minY;
        ship[1].x = minX;
        ship[1].y = minY+1;
        ship[2].x = minX+1;
        ship[2].y = minY+1;
        ship[3].x = minX+2;
        ship[3].y = minY+1;
        ship[4].x = minX;
        ship[4].y = minY+2;
        ship[5].x = minX+1;
        ship[5].y = minY+2;
        ship[6].x = minX+2;
        ship[6].y = minY+2;
    }else if (direction === "down"){
        ship[0].x = avgUniqueX;
        ship[0].y = maxY;
        ship[1].x = minX;
        ship[1].y = minY+1;
        ship[2].x = minX+1;
        ship[2].y = minY+1;
        ship[3].x = minX+2;
        ship[3].y = minY+1;
        ship[4].x = minX;
        ship[4].y = minY;
        ship[5].x = minX+1;
        ship[5].y = minY;
        ship[6].x = minX+2;
        ship[6].y = minY;
    }else if (direction === "left"){
        ship[0].x = minX;
        ship[0].y = avgUniqueY;
        ship[1].x = minX+1;
        ship[1].y = minY;
        ship[2].x = minX+2;
        ship[2].y = minY;
        ship[3].x = minX+1;
        ship[3].y = minY+1;
        ship[4].x = minX+2;
        ship[4].y = minY+1;
        ship[5].x = minX+1;
        ship[5].y = minY+2;
        ship[6].x = minX+2;
        ship[6].y = minY+2;
    }else if (direction === "right"){
        ship[0].x = maxX;
        ship[0].y = avgUniqueY;
        ship[1].x = minX;
        ship[1].y = minY;
        ship[2].x = minX+1;
        ship[2].y = minY;
        ship[3].x = minX;
        ship[3].y = minY+1;
        ship[4].x = minX+1;
        ship[4].y = minY+1;
        ship[5].x = minX;
        ship[5].y = minY+2;
        ship[6].x = minX+1;
        ship[6].y = minY+2;
    }

    drawGame();

    if (ship === playerShip) {
        shipDirection = direction;
    }
}

function drawGame(){
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "lime";
    for(let i = 0; i < playerShip.length; i++){
        ctx.fillRect(playerShip[i].x * gridSize , playerShip[i].y * gridSize, gridSize - 2, gridSize - 2);
    }

    ctx.fillStyle = "red";
    for (let i = 0; i < enemyShips.length; i++) {
        let ship = enemyShips[i];
        for (let j = 0; j < ship.length; j++) {
            ctx.fillRect(ship[j].x * gridSize, ship[j].y * gridSize, gridSize - 2, gridSize - 2);
        }
    }
}

function generateEnemies(){
    if(enemyShips.length >= 4) return;
    enemyShipRandomXValue = Math.floor(Math.random()*tileCountX);
    enemyShipRandomYValue = Math.floor(Math.random()*tileCountY);

    if(enemyShipRandomXValue < 1 || enemyShipRandomYValue < 1 || enemyShipRandomXValue > tileCountX-2 || enemyShipRandomYValue > tileCountY-2){
        generateEnemies();
        return;
    }

    for (let i = 0; i < enemyShips.length; i++) {
        let ship = enemyShips[i];
        for (let j = 0; j < ship.length; j++) {
            if(enemyShipRandomXValue == ship[j].x || enemyShipRandomYValue == ship[j].y){
                generateEnemies();
                return;
            }
        }
    }

    const newShip = [
        {x: enemyShipRandomXValue, y: enemyShipRandomYValue},
        {x: enemyShipRandomXValue + 1, y: enemyShipRandomYValue + 1},
        {x: enemyShipRandomXValue , y: enemyShipRandomYValue + 1},
        {x: enemyShipRandomXValue - 1, y: enemyShipRandomYValue + 1},
        {x: enemyShipRandomXValue + 1, y: enemyShipRandomYValue + 2},
        {x: enemyShipRandomXValue, y: enemyShipRandomYValue + 2},
        {x: enemyShipRandomXValue - 1, y: enemyShipRandomYValue + 2},
    ];

    for(let i = 0; i< newShip.length; i++){
        for(let j=0; j<playerShip.length; j++){
            if (newShip[i].x === playerShip[j].x && newShip[i].y === playerShip[j].y) {
                generateEnemies();
                return;
            }
        }
    }

    enemyShips.push(newShip);
}

function updatePlayerShip(){
    const head = {x: playerShip[0].x + dx, y: playerShip[0].y + dy};

    if(head.x < 0 || head.x >= tileCountX || head.y < 0 || head.y >= tileCountY) {
        return;
    }

    let tempPlayerShip = playerShip.map(p => ({ x: p.x + dx, y: p.y + dy }));

    if(playerEnemyOverlap(tempPlayerShip)) return;

    for(let i = 0; i < playerShip.length; i++){
        playerShip[i].x += dx;
        playerShip[i].y += dy;
    }
    drawGame();
}


function gameLoop(){
    drawGame();
    if(enemyShips.length == 0) generateEnemies();
    setTimeout(gameLoop, 100); 
}

function getMinMaxCoordinates(arr) {

    let minX = arr[0].x;
    let maxX = arr[0].x;
    let minY = arr[0].y;
    let maxY = arr[0].y;

    for (let i = 1; i < arr.length; i++) {
        if (arr[i].x < minX) minX = arr[i].x;
        if (arr[i].x > maxX) maxX = arr[i].x;
        if (arr[i].y < minY) minY = arr[i].y;
        if (arr[i].y > maxY) maxY = arr[i].y;
    }

    return { minX, maxX, minY, maxY };
}

function playerEnemyOverlap(tempShip){
    let { minX: PminX, maxX: PmaxX, minY: PminY, maxY: PmaxY } = getMinMaxCoordinates(tempShip);
    for (let i = 0; i < enemyShips.length; i++) {
        let ship = enemyShips[i];
        let { minX: EminX, maxX: EmaxX, minY: EminY, maxY: EmaxY } = getMinMaxCoordinates(ship);

        if((inMiddle(EminY, EmaxY, PmaxY) || inMiddle(EminY, EmaxY, PminY)) && (inMiddle(EminX, EmaxX, PmaxX) || inMiddle(EminX, EmaxX, PminX))){
            return true;
        }

        if([EminX, EmaxX].includes([PminX, PmaxX]) && [EminY, EmaxY].includes([PminY, PmaxY]) ) return true;
        // console.log([PminX, PmaxX, PminY, PmaxY], [EminX, EmaxX, EminY, EmaxY]);
    }
    
    return false;

}

function inMiddle(lowerBound, upperBound, corrdinate){
    if(lowerBound <= corrdinate && upperBound >= corrdinate) return true;
    else return false;
}

function firePlayerBullet(direction){
    playerBullet.push({
        x: playerShip[0].x,
        y: playerShip[0].y,
        dir: direction
    });
}

function updateBullet(bullet){
    let index = playerBullet.indexOf(bullet);

    if(bullet.dir === "up"){
        bullet.y -= 1;
        if(bullet.y < 0) playerBullet.splice(index, 1);
    }else if(bullet.dir === "down"){
        bullet.y += 1;
        if(bullet.y > tileCountY) playerBullet.splice(index, 1);
    }else if(bullet.dir === "left"){
        bullet.x -= 1;
        if(bullet.x < 0) playerBullet.splice(index, 1);
    }else if(bullet.dir === "right"){
        bullet.x += 1;
        if(bullet.x > tileCountX) playerBullet.splice(index, 1);
    }


    for(let i = 0; i<enemyShips.length; i++){
        let ship = enemyShips[i];
        let shipIndex = enemyShips.indexOf(ship);
        for(let j = 0; j < ship.length; j++){
            // console.log(`Bullet ${bullet.x, bullet.y} Enemy : ${ship[j].x, ship[j].y}`);
            if(bullet.x == ship[j].x && bullet.y == ship[j].y){
                playerBullet.splice(index, 1);
                enemyShips.splice(shipIndex, 1);
            }
        }
    }

}


function drawbullet(){
    ctx.fillStyle = "blue";
    for(let i = 0; i < playerBullet.length; i++){
        ctx.fillRect(playerBullet[i].x * gridSize, playerBullet[i].y * gridSize, gridSize - 2, gridSize - 2);
        updateBullet(playerBullet[i]);
    }
    setTimeout(drawbullet, 100); 
}


gameLoop();
drawbullet();

setInterval(generateEnemies, Math.random()*3000);

setInterval(()=>{
    let enemeyRandomIndex = Math.floor(Math.random()*enemyShips.length);
    let dir = ["up", 'down', "left", "right"];
    rotatePlayerShip(enemyShips[enemeyRandomIndex], dir[Math.floor(Math.random()*4)]);
}, Math.random()*5000);