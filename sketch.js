// Teacher Training Program

// C9 to C21 

// Infinite Runner Game: Mario

// Introducing Game States
var PLAY = 0;
var END = 1;
var WON = 2;
var gameState = PLAY;

// Introducing Variables
var marioRunner, marioRunnerImg;

var bg, bgImg;

var obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var enemyGroup;

var coinImg, goldCoinsImg, starImg1, starImg2;
var creditGroup, coinBoxGroup, coinsGroup;

var invisibleGround;

var creditScore = 0;
var coinsCollected = 0;
var marioLives = 5;

var gameOver, gameOverImg;
var resetGame, resetGameImg;

var playerJoy, playerGift, playerJoyImg, playerGiftImg;
var playerLost, playerLostImg;

var gameOverSound;
var creditSound;
var winSound;

function preload() {

  bgImg = loadImage("assets/bgImg.png");

  obstacle1 = loadImage("assets/enemy.png");
  obstacle2 = loadImage("assets/mushroom1.png");
  obstacle3 = loadImage("assets/mushroom2.png");
  obstacle4 = loadImage("assets/mushroom3.png");
  obstacle5 = loadImage("assets/mushroom4.png");
  obstacle6 = loadImage("assets/stone.png");

  coinImg = loadImage("assets/coinBox.png");
  goldCoinsImg = loadImage("assets/goldCoins.png");
  starImg1 = loadImage("assets/star2.png");

  marioRunnerImg = loadImage("assets/marioRunner.png");

  playerJoyImg = loadImage("assets/SuperMarioJoy.gif");
  playerGiftImg = loadImage("assets/gift.png");

  playerLostImg = loadImage("assets/marioLost.png");
  marioFlyImg = loadImage("assets/marioFly.png");

  gameOverImg = loadImage("assets/game-over.png");
  resetGameImg = loadImage("assets/reset.png");

  gameOverSound = loadSound("assets/gameover_wav.wav");
  creditSound = loadSound("assets/win.mp3");
  winSound = loadSound("assets/winpoint2.mp3");

}

function setup() {
  createCanvas(800, 400);

  bg = createSprite(10, 10);
  bg.addImage(bgImg);

  marioRunner = createSprite(100, 350,20,20);
  marioRunner.addImage(marioRunnerImg);
  //marioRunner.debug = true;
  marioRunner.scale = 0.05;

  playerJoy = createSprite(200, 250);
  playerJoy.addImage(playerJoyImg);
  playerJoy.scale = 0.5;

  playerJoy.visible = false;

  playerGift = createSprite(600, 240);
  playerGift.addImage(playerGiftImg);
  playerGift.scale = 0.35;

  playerGift.visible = false;

  playerLost = createSprite(200, 280);
  playerLost.addImage(playerLostImg);
  playerLost.visible = false;

  invisibleGround = createSprite(400, 360, 800, 15);
  invisibleGround.visible = false;

  enemyGroup = new Group();
  creditGroup = new Group();
  coinBoxGroup = new Group();
  coinsGroup = new Group();

  gameOver = createSprite(400, 170);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  gameOver.visible = false;

  resetGame = createSprite(400, 230);
  resetGame.addImage(resetGameImg);
  resetGame.scale = 0.05;
  resetGame.visible = false;

  textFont("Trebuchet MS");
}

function draw() {

  background("steelblue");

  drawSprites();

  // Assign Behavior - Play State
  if (gameState === PLAY) {

    fill("black");
    textSize(15);
    text("Press Space to Jump", 50, 50);
    text("Collect Coins & Stars", 50, 70)

    push();
    fill("cream");
    strokeWeight(5);
    stroke(100, 112, 104);
    rectMode(CENTER);
    rect(730, 65, 80, 70);
    pop();

    fill("green");
    textSize(15);
    text("Stars : "+creditScore, 700, 50);

    fill("purple");
    text("Coins : "+coinsCollected, 700, 70);

    fill("crimson");
    text("Lives : "+marioLives, 700, 90);

    bg.visible = true;
    bg.velocityX = -2;

    if (bg.x < 100) {
      bg.x = bg.width/2;
    }

    console.log(marioRunner.y);

    if (keyDown("space")) {
      marioRunner.velocityY = -15;
    }

    marioRunner.velocityY += 0.5;

    marioRunner.collide(invisibleGround);
   
    spawnObstacles();
    spawnCredits();
    spawnCoins();

    if (creditGroup.isTouching(marioRunner)) {

      creditGroup.destroyEach();
      creditScore += 1;

      creditSound.play();

    }

    if (coinBoxGroup.isTouching(marioRunner)) {

      coinBoxGroup.destroyEach();

      coinsGroup.setVisibleEach(true);
      coinsGroup.setVelocityXEach(0);

    }

    if (coinsGroup.isTouching(marioRunner)) {

      coinsGroup.destroyEach();
      coinsCollected += 1;

      creditSound.play();

    }

    if (creditScore === 5 || coinsCollected === 2) {
      marioRunner.visible = false;
      enemyGroup.destroyEach();

      gameState = WON;

      winSound.play();

    }

    if (enemyGroup.isTouching(marioRunner)) {

      enemyGroup.destroyEach();
      creditGroup.destroyEach();
      coinsGroup.destroyEach();
      coinBoxGroup.destroyEach();

      if (marioLives > 0) {
        marioLives = marioLives - 1;
      }

      if (marioLives === 0) {
        gameState = END;

        gameOverSound.play();
      }

    }

  } 
  
  // Assign Behavior - END State

    if (gameState === END) {

      bg.velocityX = 0;
      bg.visible = false;
      marioRunner.visible = false;
      gameOver.visible = true;
      resetGame.visible = true;
      playerLost.visible = true;

    if (mousePressedOver(resetGame)){
      reset();
    }
  } 
  
  // Assign Behavior - WON State

  if (gameState === WON) {

      fill("crimson");
      textSize(30);
      text("CONGRATS!!", 320, 200);

      bg.velocityX = 0;

      playerJoy.visible = true;
      playerGift.visible = true;
    
  }

}

// Reset the Mario Game

function reset() {

  gameState = PLAY;

  gameOver.visible = false;
  resetGame.visible = false;

  marioRunner.visible = true;
  playerLost.visible = false;

  creditScore = 0;
  coinsCollected = 0;
  marioLives = 5;

}

// Spawn Coins | Credits | Obstacles

function spawnCoins() {

  if (frameCount % 600 === 0) {

    let coinBox = createSprite(600, 250);
    coinBox.velocityX = -3;

    coinBox.addImage(coinImg);
    coinBox.scale = 0.045;

    coinBox.lifetime = 850;
    coinBoxGroup.add(coinBox);

    coinBox.debug = true;

    let coins = createSprite(600, 250);
    coins.velocityX = -3;

    coins.x = coinBox.x;
    coins.y = coinBox.y;

    coins.visible = false;

    coins.addImage(goldCoinsImg);
    coins.scale = 0.045;

    coins.lifetime = 850;
    coinsGroup.add(coins);

  }

}

function spawnCredits() {

  if (frameCount % 400 === 0) {

    let credit = createSprite(0, 250);
    credit.velocityX = 1;

    credit.y = Math.round(random(150, 250));

    credit.addImage(starImg1);
    credit.scale = 0.045;

    credit.lifetime = 850;
    creditGroup.add(credit);

    //credit.debug = true;
    credit.setCollider("rectangle", 0, 0, credit.width, credit.height);
  }

}

function spawnObstacles() {
  let rand = Math.round(random(200, 300));

  if (frameCount % (rand + 50) === 0) {

    let obstacle = createSprite(800, 350);
    obstacle.velocityX = -3;

    obstacle.y = Math.round(random(300, 350));

    let randImg = Math.round(random(1, 6));

    switch (randImg) {
      case 1:
        obstacle.addImage(obstacle1);
        obstacle.scale = 0.065;
        break;
      case 2:
        obstacle.addImage(obstacle2);
        obstacle.scale = 0.030;
        break;
      case 3:
        obstacle.addImage(obstacle3);
        obstacle.scale = 0.035;
        break;
      case 4:
        obstacle.addImage(obstacle4);
        obstacle.scale = 0.045;
        break;
      case 5:
        obstacle.addImage(obstacle5);
        obstacle.scale = 0.035;
        break;
      case 6:
        obstacle.addImage(obstacle6);
        obstacle.scale = 0.065;
        break;
      default:
        break;
    }

    obstacle.lifetime = 400;
    enemyGroup.add(obstacle);
  }
}