const yourShip = document.querySelector('.player-shooter');
const playArea = document.querySelector('#main-play-area');
const aliensImg = ['img/monster-1.png', 'img/monster-2.png', 'img/monster-3.png'];
const aliensPos = [0, 50, 100, 150, 200, 250, 300, 350, 400, 450];
const instructionsText = document.querySelector('.game-instructions');
const startButton = document.querySelector('.start-button');
const newLaser = document.createElement('img');
newLaser.src = 'img/shoot.png';
let alienInterval;
let isShooting = false;
let gameOverVar = false;


function flyShip(event) {
    if (event.key === 'ArrowUp') {
        event.preventDefault();
        moveUp();
    } else if (event.key === 'ArrowDown') {
        event.preventDefault();
        moveDown();
    }
    else if (event.key === " ") {
        event.preventDefault();
        fireLaser();
    }
}

let moveUp = () => {
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if (topPosition === "0px") {
        return
    } else {
        let position = parseInt(topPosition);
        position -= 50;
        yourShip.style.top = `${position}px`;
    }
}

let moveDown = () => {
    let topPosition = getComputedStyle(yourShip).getPropertyValue('top');
    if (topPosition === "450px") {
        return
    } else {
        let position = parseInt(topPosition);
        position += 50;
        yourShip.style.top = `${position}px`;
    }
}

let fireLaser = () => {
    if (isShooting == false) {
        isShooting = true;
        let laser = createLaserElement();
        playArea.appendChild(laser);
        moveLaser(laser);
        setTimeout(() => { isShooting = false }, 400);
    }
}

function createLaserElement() {
    let xPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('left'));
    let yPosition = parseInt(window.getComputedStyle(yourShip).getPropertyValue('top'));
    newLaser.classList.add('laser');
    newLaser.style.left = `${xPosition}px`;
    newLaser.style.top = `${yPosition - 10}px`;
    return newLaser;
}

function moveLaser(laser) {
    let laserInterval = setInterval(() => {
        let xPosition = parseInt(laser.style.left);
        let aliens = document.querySelectorAll('.alien');
        aliens.forEach((alien) => {
            if (checkLaserCollision(laser, alien)) {
                alien.src = 'img/explosion.png';
                alien.classList.remove('alien');
                alien.classList.add('dead-alien');
            }
        })
        if (xPosition === 348) {
            clearInterval(laserInterval);
            laser.remove();
        } else {
            laser.style.left = `${xPosition + 8}px`;
        }
    }, 10);
}

function createAliens() {
    let newAlien = document.createElement('img');
    let alienSprite = aliensImg[Math.floor(Math.random() * aliensImg.length)];
    newAlien.src = alienSprite;
    newAlien.classList.add('alien');
    newAlien.classList.add('alien-transition');
    newAlien.style.left = '356px';
    newAlien.style.top = `${aliensPos[Math.floor(Math.random() * aliensPos.length)]}px`;
    playArea.appendChild(newAlien);
    moveAlien(newAlien);
}

function moveAlien(alien) {
    
    let moveAlienInterval = setInterval(() => {
        if(gameOverVar==true || Array.from(alien.classList).includes('dead-alien') ){
            clearInterval(moveAlienInterval);
            setTimeout(()=> alien.remove(),500);
            }
        let xPosition = parseInt(window.getComputedStyle(alien).getPropertyValue('left'));
        
        if (xPosition <= 50) {
                gameOver();
        } else {
            alien.style.left = `${xPosition - 4}px`;
        }
    }, 30);
}

function checkLaserCollision(laser, alien) {
    let laserTop = parseInt(laser.style.top);
    let laserLeft = parseInt(laser.style.left);
    let alienTop = parseInt(alien.style.top);
    let alienLeft = parseInt(alien.style.left);
    let alienBottom = alienTop - 30;
    if (laserLeft != 340 && laserLeft + 40 >= alienLeft) {
        if (laserTop <= alienTop && laserTop >= alienBottom) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

startButton.addEventListener('click', (event) => {
    playGame();
})

function playGame() {
    gameOverVar=false;
    isShooting = false;
    startButton.style.display = 'none';
    instructionsText.style.display = 'none';
    window.addEventListener('keydown', flyShip);
    createAliens();
    alienInterval = setInterval(() => {
        createAliens();
    }, 2400);
}

function gameOver() {
    gameOverVar=true;
    window.removeEventListener('keydown', flyShip);
    clearInterval(alienInterval);
    let aliens = document.querySelectorAll('.alien');
    aliens.forEach((alien) => alien.remove());
    let lasers = document.querySelectorAll('.laser');
    lasers.forEach((laser) => laser.remove());
    setTimeout(() => {
        alert('game over!');
        yourShip.style.top = "250px";
        startButton.style.display = "block";
        instructionsText.style.display = "block";
    });
}

