//The purpose of this walkthrough was to create a simple clone of the game Flappy Bird

//The walkthrough had no guided steps so it required a lot of trial and error and going back and playing with some of the constants that were created

//This tutorial was done prior to starting JavaScript in our cohort, now that I've learned more I intend to go back and play with some of the variables in order to create a more unique project.

//Rather than recreating Flappy Bird, my intention is to apply what I learned form this tutorial and the course materials in order to create a clone of the Oregon Trail by reading the original BASIC code that it was written in. 

const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext("2d");
//using the game container to make it blurry
//for end game blur
const gameContainer = document.getElementById('game-container');

const flappyImg = new Image();
flappyImg.src = 'assets/flappy_dunk.png';

//Game constants
const FLAP_SPEED = -5;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

//Bird Variables
let birdX = 50;
let birdY = 50;
let birdVelocity = -1;
let birdAcceleration = 0.1 ;

//Pipe Variables
let pipeX = 400;
let pipeY = canvas.height - 200;

//score and highscore variables
let scoreDiv = document.getElementById('display-score');
let score = 0;
let highScore = 0;

//boolean varaible checks for score incrase when passing through pipes
let scored = false;

//space key control for bird
document.body.onkeyup = function(e) {
  if (e.code == 'Space') {
    birdVelocity = FLAP_SPEED;
  }
}


// restart the game if we hit game-over
document.getElementById('restart-button').addEventListener('click', function() {
  hideEndMenu();
  resetGame();
  loop();
})

//TO DO: The high score counter is currently continuing even when a new game starts
//The high score counter should compute after the end game function happens and updates if the new 
//high score is > the old 
function increaseScore() {
  //increase score counter when we pass a pipe
  if(birdX > pipeX + PIPE_WIDTH &&
     (birdY < pipeY + PIPE_GAP || 
        birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) &&
        !scored) {
          score++;
          scoreDiv.innerHTML = score;
          scored = true;
        }

  //reset the flag when bird passes through pipes
  if (birdX < pipeX + PIPE_WIDTH) {
    scored = false;
  }      
}

function collisionCheck(){
  // Create bounding Boxes for the bird and the pipes

  const birdBox = {
    x: birdX,
    y: birdY,
    width: BIRD_WIDTH,
    height: BIRD_HEIGHT
  }

  const topPipeBox = {
    x: pipeX,
    y: pipeY - PIPE_GAP + BIRD_HEIGHT,
    width: PIPE_WIDTH,
    height: pipeY
  }

  const bottomPipeBox = {
    x: pipeX,
    y: pipeY + PIPE_GAP + BIRD_HEIGHT,
    width: PIPE_WIDTH,
    height: canvas.height - pipeY - PIPE_GAP
  }

  // Check for collision with upper pipe box
  if(birdBox.x + birdBox.width > topPipeBox.x && birdBox.x < topPipeBox.x + topPipeBox.width && birdBox.y < topPipeBox.y) {
    return true;
  }

  // Check for collision with lower pipe box
  if (birdBox.x + birdBox.width > bottomPipeBox.x && birdBox.x < bottomPipeBox.x + bottomPipeBox.width && birdBox.y + birdBox.height > bottomPipeBox.y) {
    return true;
  }

  //check if bird hits boundaries
  if (birdY < 0 || birdY + BIRD_HEIGHT > canvas.height) {
    return true;
  }

  return false;
}

function hideEndMenu() {
  document.getElementById('end-menu').style.display = 'none';
  gameContainer.classList.remove('backdrop-blur');


}

function showEndMenu (){
  document.getElementById('end-menu').style.display = 'block';
  gameContainer.classList.add('backdrop-blur');
  document.getElementById('end-score').innerHTML = score;
  if (highScore < score) {
    highScore = score;
  }
  document.getElementById('best-score').innerHTML = highScore;

}

//reset values to the beggining so we start
//with the bird at the starting position
function resetGame() {
  //Bird Variables
  birdX = 50;
  birdY = 50;
  birdVelocity = 0;
  birdAcceleration = 0.1;

//Pipe Variables
  pipeX = 400;
  pipeY = canvas.height - 200;

  
}

function endGame() {
  showEndMenu();

}

function loop() {
  //reset the ctx after loop iteration
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //Draw the bird
  ctx.drawImage(flappyImg, birdX, birdY);

  //Draw pipes
  
  ctx.fillStyle = '#333';
  ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
  ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

  //adding collision check to display our end-menu - game over
  //check will return true if collision 
  //or it will be false

  if (collisionCheck()) {
    endGame();
    return;
  }

  //moving pipes
  pipeX -= 1.5;

  //when pipe moves out of frame reset pipe

  if (pipeX < -50) {
    pipeX = 400;
    pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
  }

  //applying gravity to the bird to let it move

  birdVelocity += birdAcceleration;
  birdY += birdVelocity;

  //check to make sure you can call the function
  
  increaseScore()
  requestAnimationFrame(loop);
}

loop();

