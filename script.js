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

function generateClouds() {
    for (var i = 0; i < 5; i++) {
        var x = Math.random() * myGameArea.canvas.width;
        var y = Math.random() * myGameArea.canvas.height;
        clouds.push(new component(100, 50, cloudImg, x, y));
    }
}

function generateStars() {
    for (var i = 0; i < 20; i++) { // Adicionando 20 estrelas
        var x = Math.random() * myGameArea.canvas.width;
        var y = Math.random() * myGameArea.canvas.height;
        stars.push(new component(5, 5, starImg, x, y)); // Tamanho das estrelas definido como 5x5
    }
}

function updateGameArea() {
    myGameArea.clear();

    if (isExplosion) {
        drawExplosion();
    } else {
        if (leftPressed && myGamePiece.x > 0) {
            myGamePiece.x -= 5; // Movendo mais rápido
        }
        if (rightPressed && myGamePiece.x < myGameArea.canvas.width - myGamePiece.width) {
            myGamePiece.x += 5; // Movendo mais rápido
        }

        if (aPressed && enemyGamePiece.x > 0) {
            enemyGamePiece.x -= 2; // Movendo mais devagar
        }
        if (dPressed && enemyGamePiece.x < myGameArea.canvas.width - enemyGamePiece.width) {
            enemyGamePiece.x += 2; // Movendo mais devagar
        }

        if (checkCollision(myGamePiece, enemyGamePiece)) {
            isExplosion = true;
            explosionFrame = 0;
            explosionSound.play(); // Reproduz o som de explosão
        }

        myGamePiece.update();
        enemyGamePiece.update();
    }

    // Desenha e move nuvens
    for (var i = 0; i < clouds.length; i++) {
        if (!clouds[i].newPos()) {
            clouds.splice(i, 1); // Remove a nuvem se sair da tela
            i--; // Decrementa o índice para evitar saltar uma nuvem após a remoção
        }
        clouds[i].update();
    }

    // Desenha e move estrelas
    for (var i = 0; i < stars.length; i++) {
        stars[i].y += 0.5; // Alterando a velocidade de descida das estrelas
        if (stars[i].y > myGameArea.canvas.height) {
            stars[i].y = -5; // Reposicionando estrelas quando saem da tela
            stars[i].x = Math.random() * myGameArea.canvas.width;
        }
        stars[i].update();
    }

    // Atualiza a posição dos tiros e remove os tiros que saem da tela
    updateTiros();

    requestAnimationFrame(updateGameArea);
}

function keyDownHandler(event) {
    if (event.key === "ArrowLeft") {
        leftPressed = true;
    } else if (event.key === "ArrowRight") {
        rightPressed = true;
    } else if (event.key === "a" || event.key === "A") {
        aPressed = true;
    } else if (event.key === "d" || event.key === "D") {
        dPressed = true;
    } else if (event.key === " ") { // Se a tecla pressionada for a barra de espaço
        if (!spacePressed) { // Verifica se a tecla de espaço não estava pressionada antes (evita múltiplos tiros com uma única pressão)
            fire(); // Chama a função para disparar um tiro
            spacePressed = true; // Define spacePressed como verdadeiro para indicar que a tecla de espaço está sendo pressionada
        }
    }
}

function keyUpHandler(event) {
    if (event.key === "ArrowLeft") {
        leftPressed = false;
    } else if (event.key === "ArrowRight") {
        rightPressed = false;
    } else if (event.key === "a" || event.key === "A") {
        aPressed = false;
    } else if (event.key === "d" || event.key === "D") {
        dPressed = false;
    } else if (event.key === " ") { // Se a tecla de espaço for liberada
        spacePressed = false; // Define spacePressed como falso para indicar que a tecla de espaço não está mais pressionada
    }
}

function fire() {
    var tiroX = myGamePiece.x + myGamePiece.width / 2; // Posição X inicial do tiro (centro da nave)
    var tiroY = myGamePiece.y; // Posição Y inicial do tiro (topo da nave)
    tiros.push(new component(5, 10, tiroImg, tiroX, tiroY, true)); // Cria um novo tiro e o adiciona ao array de tiros
    tiroSound.play(); // Reproduz o som de tiro
}

function updateTiros() {
    for (var i = 0; i < tiros.length; i++) {
        var tiro = tiros[i];
        if (!tiro.newPos()) {
            tiros.splice(i, 1); // Remove o tiro se sair da tela
            i--; // Decrementa o índice para evitar saltar um tiro após a remoção
        } else {
            // Verifica a colisão entre o tiro e a nave inimiga
            if (checkCollision(tiro, enemyGamePiece)) {
                isExplosion = true; // Ativa a explosão
                explosionFrame = 0;
                tiros.splice(i, 1); // Remove o tiro
                i--; // Decrementa o índice para evitar problemas com o loop
                explosionSound.play(); // Reproduz o som de explosão
            } else {
                tiro.update(); // Atualiza a posição do tiro
            }
        }
    }
}

function checkCollision(piece1, piece2) {
    return !(piece1.x > piece2.x + piece2.width ||
        piece1.x + piece1.width < piece2.x ||
        piece1.y > piece2.y + piece2.height ||
        piece1.y + piece1.height < piece2.y);
}

function drawExplosion() {
    var ctx = myGameArea.context;
    var sx = (explosionFrame % framesPerRow) * explosionFrameWidth;
    var sy = Math.floor(explosionFrame / framesPerRow) * explosionFrameHeight;
    var x = enemyGamePiece.x + (enemyGamePiece.width - explosionRenderWidth) / 2; // Posição X da explosão na nave inimiga
    var y = enemyGamePiece.y + (enemyGamePiece.height - explosionRenderHeight) / 2; // Posição Y da explosão na nave inimiga

    ctx.drawImage(explosionImg, sx, sy, explosionFrameWidth, explosionFrameHeight, x, y, explosionRenderWidth, explosionRenderHeight);

    explosionFrame++;
    if (explosionFrame >= totalExplosionFrames) {
        isExplosion = false;
        myGamePiece = new component(50, 50, naveImg, 225, 900); // Reposiciona a nave do jogador
        enemyGamePiece = new component(50, 50, naveInimigaImg, 225, 0); // Reposiciona a nave inimiga
    }
}

startGame(); // Inicia o jogo quando a página carrega
