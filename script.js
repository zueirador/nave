var myGamePiece;
var enemyGamePiece;
var clouds = [];
var stars = [];
var tiros = []; // Array para armazenar os tiros
var naveImg = new Image();
naveImg.src = "nave.png";
var naveInimigaImg = new Image();
naveInimigaImg.src = "nave_inimiga.png";
var explosionImg = new Image();
explosionImg.src = "explosion.png";
var cloudImg = new Image();
cloudImg.src = "cloud.png";
var starImg = new Image(); // Adicionando imagem da estrela
starImg.src = "star.png"; // Coloque o caminho correto para a imagem da estrela
var tiroImg = new Image(); // Adicionando imagem do tiro
tiroImg.src = "tiro.png"; // Coloque o caminho correto para a imagem do tiro

var leftPressed = false;
var rightPressed = false;
var aPressed = false;
var dPressed = false;
var spacePressed = false; // Variável para controlar se a tecla de espaço está pressionada

var isExplosion = false;
var explosionFrame = 0;
var explosionFrameWidth = 170.67; // Tamanho do quadro individual da explosão
var explosionFrameHeight = 192;
var explosionRenderWidth = 64;
var explosionRenderHeight = 64;
var totalExplosionFrames = 6;
var framesPerRow = 3;

var backgroundMusic = new Audio("musica-acao.mp3");
backgroundMusic.loop = true;
backgroundMusic.volume = 0.5; // Defina o volume desejado (de 0 a 1)

var tiroSound = new Audio("tiro.mp3");
var explosionSound = new Audio("explosao.mp3");

function startGame() {
    console.log("O jogo está começando!");
    myGamePiece = new component(50, 50, naveImg, 225, 900); // Nave do jogador na parte inferior
    enemyGamePiece = new component(50, 50, naveInimigaImg, 225, 0); // Nave inimiga na parte superior
    myGameArea.start();
    generateClouds();
    generateStars(); // Adicionando estrelas ao iniciar o jogo
    document.addEventListener("keydown", keyDownHandler, false);
    document.addEventListener("keyup", keyUpHandler, false);
    playBackgroundMusic(); // Inicia a reprodução da música de fundo
}

function playBackgroundMusic() {
    backgroundMusic.play();
}

var myGameArea = {
    canvas: document.getElementById("myCanvas"),
    start: function () {
        this.context = this.canvas.getContext("2d");
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        requestAnimationFrame(updateGameArea);
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.fillStyle = "black";
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

function component(width, height, image, x, y, isTiro = false) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.image = image;
    this.isTiro = isTiro; // Indica se é um tiro ou não

    this.update = function () {
        var ctx = myGameArea.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    this.newPos = function () {
        if (this.isTiro) { // Movimenta o tiro para cima
            this.y -= 5; // Velocidade do tiro (altere conforme necessário)
            if (this.y + this.height < 0) {
                return false; // Retorna falso se o tiro sair da tela para removê-lo posteriormente
            }
        } else { // Movimenta a nave normal
            this.y += 1;
            if (this.y > myGameArea.canvas.height) {
                this.y = -this.height;
            }
        }
        return true; // Retorna verdadeiro para manter o componente na tela
    }
}
