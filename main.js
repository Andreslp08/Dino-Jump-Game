

// key events
document.addEventListener("keydown", 
function(event){
    if(event.keyCode == 32 ){
        if( dinosaur.isDead == false ){
            jump();
            jumpSound.play();
        }
    }
});

document.addEventListener("keydown", 
function(event){
    if(event.keyCode == 77 ){
        if( dinosaur.isDead == false ){
            showPauseMenu(true);
        }
    }
});



//------------------------------------------------------------------
var dinosaurtexture;
var cactusTexture;
var cloudTexture;

//load textures
function loadTextures(){
    dinosaurtexture = new Image();
    dinosaurtexture.src = "Assets/Textures/Trex.png";
    cactusTexture = new Image();
    cactusTexture.src = "Assets/Textures/Cactus.png";
    cloudTexture = new Image();
    cloudTexture.src = "Assets/Textures/Cloud.png";
}
//------------------------------------------------------------------
var canvas, context; 
var scoreElement;
var canvasWidth = 600;
var canvasHeight = 600;
var jumpSound;
var gameOverSound;
var gameOver;
var music;
var gameOverScore;
var gameOverButtonRetry;
var paused = false;
var menuPause;
var menuPauseContinue;
var startGame = false;
var mainMenu;
var buttonStartGame;
var buttonExit;
var buttonBackToMainMenu;
var buttonBackToMenuP;
var scoreContainer;
var characterNames = ["T-Rex", "Diplodocus", "Stegosaurus", "Spinosaurus"];
var characterSkin = ["Assets/Textures/Trex.png", "Assets/Textures/Diplodocus.png", "Assets/Textures/Stegosaurus.png", "Assets/Textures/Spinosaurus.png"];
var dinosaurPreview;
var buttonLeft;
var buttonRight;
var characterPosition = 0;
var dinosaurName;
var clickSound;
//init 
function init(){
    startGame = false;
    mainMenu = document.getElementById("mainMenu");
    buttonStartGame = document.getElementById("buttonStart");
    buttonExit = document.getElementById("buttonExit");
    music = new Audio("Assets/Sounds/Music.wav");
    menuPause = document.getElementById("containerPause");
    menuPause.style.display = "none";   
    menuPauseContinue = document.getElementById("buttonContinue");
    buttonBackToMenuP = document.getElementById("buttonBackToMenuP");
    gameOver = document.getElementById("containerGameOver");
    gameOver.style.display = "none";
    buttonBackToMainMenu = document.getElementById("buttonBackToMenu");
    jumpSound = new Audio("Assets/Sounds/Jump.wav");
    gameOverSound = new Audio("Assets/Sounds/GameOver.wav");
    canvas = document.getElementById("canvas");
    canvas.style.display = "none";
    context = canvas.getContext("2d");
    scoreElement = document.getElementById("score");
    gameOverScore = document.getElementById("gameOverScore");
    gameOverButtonRetry = document.getElementById("buttonRetry");
    scoreContainer = document.getElementById("scoreContainer");
    scoreContainer.style.display = "none";
    buttonLeft = document.getElementById("buttonLeft");
    buttonRight = document.getElementById("buttonRight");
    dinosaurPreview = document.getElementById("dinosaurPreview");
    dinosaurName = document.getElementById("dinosaurName");
    clickSound = new Audio("Assets/Sounds/Click.wav");
    loadTextures();
    //start game
    buttonStartGame.addEventListener("click",
    function(){
        clickSound.play();
        showMenu(false);
    });
    // exit game
    buttonExit.addEventListener("click",
    function(){
        clickSound.play();
        window.close();
    });
    // on client press button to retry
    gameOverButtonRetry.addEventListener("click",
    function(){
        clickSound.play();
        restartGame();
    });
    // back to main menu (game over)
    buttonBackToMainMenu.addEventListener("click",
    function(){
        clickSound.play();
        restartGame();
        showMenu(true);
        showGameOverMenu(false);
    });
    // back to main menu (game over)
    buttonBackToMenuP.addEventListener("click",
    function(){
        clickSound.play();
        paused = false;
        restartGame();
        showMenu(true);
        showPauseMenu(false);
    });
    // continue with the game 
    menuPauseContinue.addEventListener("click",
    function(){
        clickSound.play();
        continueGame();
    });
    // change characters
    buttonLeft.addEventListener("click",function(){
        if(characterPosition > 0 ){
            clickSound.play();
            characterPosition--;
            selectCharacter(characterPosition);
        }
    });
    buttonRight.addEventListener("click",function(){
        if(characterPosition < characterNames.length-1 ){
            clickSound.play();
            characterPosition++;
            selectCharacter(characterPosition);
        }
    });
}

//------------------------------------------------------------------

//Clean canvas
function cleanCanvas(){
    context.clearRect(0,0,canvas.width, canvas.height);
}


//------------------------------------------------------------------
var level = {speed: 10, score:0}
var dinosaur = { x: 30, y: 500, speedY:0, gravity:2, jump:33, maxSpeedY: 9, isJumping: false, width: 100, height:100, isDead: false };
//draw T-rex
function drawDinosaur(){
    context.drawImage( dinosaurtexture,0,0, dinosaurtexture.width, dinosaurtexture.height, dinosaur.x, dinosaur.y, dinosaur.width,dinosaur.height);
    
}
//------------------------------------------------------------------
//Jump
function jump(){
    dinosaur.isJumping = true;
    //this control the multiple jumps, when the player press the button faster
    if( dinosaur.y >=500 ){
        dinosaur.speedY = dinosaur.jump;
    }
 }
//------------------------------------------------------------------
//gravity
function gravity(){
    if( dinosaur.isJumping == true  ){
        dinosaur.speedY -= dinosaur.gravity;
        dinosaur.y -= dinosaur.speedY;


    }
    if( dinosaur.y > 500 ){
        dinosaur.isJumping == false;
        dinosaur.speedY = 0;
        dinosaur.y = 500;
    }
}
//------------------------------------------------------------------
var cactus = { x: canvasWidth, y:500, width:70, height:100 };
//draw Cactus
function drawCactus(){
    context.drawImage( cactusTexture,0,0, cactusTexture.width, cactusTexture.height, cactus.x, cactus.y, cactus.width,cactus.height);
}
//------------------------------------------------------------------
//move cactus 
function moveCactus(){
    if(cactus.x <= 0 - cactusTexture.width ){
        cactus.x = canvasWidth;
        increaseDifficulty();
    }else{
        cactus.x -= level.speed;
    }
}
//------------------------------------------------------------------
var cloud = { x: canvasWidth, y:150 };
//draw Cactus
function drawCloud(){
    context.drawImage( cloudTexture,0,0, cloudTexture.width, cloudTexture.height, cloud.x, cloud.y, 100,100);
}
//------------------------------------------------------------------
//move cactus 
function moveCloud(){
    if(cloud.x <= 0 - cloudTexture.width ){
        cloud.x = canvasWidth;
    }
    cloud.x -= level.speed-6;
}
//------------------------------------------------------------------
// detect collision
function collision(){
    if (cactus.x < dinosaur.x + dinosaur.width &&
        cactus.x + cactus.width > dinosaur.x &&
        cactus.y < dinosaur.y + dinosaur.height &&
        cactus.height + cactus.y > dinosaur.y) {
        dinosaur.isDead = true;
        gameOverSound.play();
        gameOverScore.innerHTML = "Your score: " + level.score;
        level.score = 0;
        level.speed = 10;
        scoreElement.innerHTML = level.score;
     }
}
//------------------------------------------------------------------
function showGameOverMenu( tof ){
    if( tof == true ){
        gameOver.style.display = "block";
    }
    else{
        gameOver.style.display = "none";
    }
}
//change score
function changeScore(){
    if( cactus.x == canvasWidth ){
        level.score++;
        scoreElement.innerHTML = level.score;
     }
}
//restart game
function restartGame(){
    dinosaur.isDead = false;
    cactus.x = canvasWidth;
    cloud.x = canvasWidth;
    dinosaur.y = 500;
    dinosaur.isJumping = false;
}
//------------------------------------------------------------------
// pause game
function showPauseMenu(tof){
    if( tof == true ){
        paused = true;
        canvas.style.webkitFilter = "blur(5px)";
        canvas.style.transition = "all .5s"
        menuPause.style.display = "block";

    }
    else{
        menuPause.style.display = "none";
        canvas.style.webkitFilter = "blur(0px)";
        canvas.style.transition = "all .5s"
    }
}
//------------------------------------------------------------------
//continue with the game
function continueGame(){
    paused = false;
    showPauseMenu(false);
}
//------------------------------------------------------------------
//Show main manu
function showMenu(tof){
    if(tof == true ){
        startGame = false;
        mainMenu.style.display = "block";
        canvas.style.display = "none";
        showHud(false);
    }
    else{
        startGame = true;
        mainMenu.style.display = "none";
        canvas.style.display = "block";
        showHud(true);
    }

}
//------------------------------------------------------------------
// show hud
function showHud(tof){
    if( tof == true ){
        scoreContainer.style.display = "block";
    }
    else{
        scoreContainer.style.display = "none";
    }
}
//------------------------------------------------------------------
// select character
function selectCharacter(position){
    var character = characterNames[position];
    dinosaurName.innerHTML = character;
    dinosaurtexture.src = characterSkin[position];
    dinosaurPreview.src = characterSkin[position];

}
//------------------------------------------------------------------
//Increase difficulty
function increaseDifficulty(){
    level.speed += 0.5;
}
//------------------------------------------------------------------
// dead filter
function deadFilter(){
    if( dinosaur.isDead == true ){
        context.filter = 'grayscale(100%)';
        canvas.style.backgroundColor = "333"; 
        canvas.style.transition = "all .3s"
    }
    else{
        context.filter = 'grayscale(0%)';
        canvas.style.backgroundColor = "00B7FF";
    }
}
//------------------------------------------------------------------
var FPS = 60;
//main loop
setInterval(function(){
    if(dinosaur.isDead == false ){
            music.play();
            music.volume = 0.07;
            showGameOverMenu(false);
            main();
    }
    else{
        music.pause();
        music.currentTime = 0;
        showGameOverMenu(true);
    }
    if( paused == true ){
        music.volume = 0.0;
    }
}, 1000/FPS);

function main(){

    if(characterPosition > 0 ){
       buttonLeft.disabled = false;
    }
    else{
        buttonLeft.disabled = true;
    }
    if(characterPosition < characterNames.length-1 ){
        buttonRight.disabled = false;
    }
    else{
        buttonRight.disabled = true;
    }
    if(paused == false && startGame == true ){
        cleanCanvas();
        gravity();
        collision();
        changeScore();
        deadFilter();
        drawDinosaur();
        drawCactus();
        moveCactus();
        drawCloud();
        moveCloud();
    }
}