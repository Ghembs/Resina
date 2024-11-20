let canvas, ctx, singleColor, effect, w, h;
let lastTime, fps, nextframe, timer;
const fontSize = 40;
const fontFamily = "Meiryo, monospace";
const words = "oligomero;abluzione;archeologia;lorica;sito;agente patogeno;ferita;danno;ematoma;" +
    "conservazione;distruzione;creazione;illuminazione;morte;anabolico;reagente;resina;destrutturazione;gravità;" +
    "cemento;fabbriche;fluido"

const characters = "アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテ" +
    "ネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789"; //ABCDEFGHIJKLMNOPQRSTUVWXYZ

function getRandInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

class Symbol {
    constructor(x, y, fontSize, canvasHeight, words, characters) {
        this.characters = characters;
        this.x = x;
        this.y = y;
        this.fontSize = fontSize;
        this.canvasHeight = canvasHeight;
        this.text = "";
        this.previousText = "";
        this.words = words.split(";");
        this.index = 0;
        this.word = this.words[getRandInt(0, this.words.length - 1)];
        this.drawWord = false;
    }

    draw(context) {
        context.fillStyle = "#D0F0D0";
        if (!this.drawWord) {// generating a random symbol from characters string
            this.text = this.characters.charAt(getRandInt(0, this.characters.length - 1));
            //drawing text
        } else {
            this.text = this.word.charAt(this.index);
            if (this.index <= this.word.length - 2) this.index += 1;
            else {
                this.drawWord = false;
                this.word = this.words[getRandInt(0, this.words.length - 1)];
                this.index = 0;
            }
        }
        context.textAlign = "center";
        context.font = this.fontSize + "px " + fontFamily;
        context.fillText(this.text, this.x * this.fontSize, this.y * this.fontSize);
        context.fillStyle = "#0aff0a";
        context.fillText(this.previousText, this.x * this.fontSize, (this.y - 1) * this.fontSize);
        this.previousText = this.text;
    }
    // resetting y-axis to 0 if it crosses the height of the window
    // otherwise incerementing y-axis value by 1
    update() {
        if ((this.y * this.fontSize > this.canvasHeight && Math.random() > 0.98) ||
            (this.y === 0 && Math.random() > 0.1)) {
            this.y = 0;
        } else {
            this.y += 1;
        }

        if (!this.drawWord) {
            this.drawWord = Math.random() < 0.1;
        }
    }
}

class Effect {
    constructor(canvasWidth, canvasHeight, fontSize) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.fontSize = fontSize;
        this.columns = canvasWidth / this.fontSize;
        this.symbols = [];
        this.#initialize();
    }

    #initialize() {
        // initializing symbols array with Symbol objects
        for (let i = 0; i < this.columns; i++) {
            this.symbols[i] = new Symbol(i, 0, this.fontSize, this.canvasHeight, words, characters);
        }
    }
}

function init () {
    canvas = document.querySelector("canvas");
    ctx = canvas.getContext("2d");
    canvas.font = fontSize + "px " + fontFamily;
//single color
    singleColor = "#0aff0a";
    const rgbHead = ["#F0FFF0", "#D0F0D0", "#80C080", "#40B040"];

    lastTime = 0;
    fps = 30;
    nextframe = 1000 / fps; //for fps = 50, nextFrame = 20
    timer = 0;

    resizeReset();
    animate(0);
}

function resizeReset() {
    canvas.width = w = window.innerWidth;
    canvas.height = h = window.innerHeight;
    effect = new Effect(w, h, fontSize);
}

function animate(timeStamp) {
    // checking paint time difference
    const deltaTime = timeStamp - lastTime;
    //updating lastTime = current elapsed time to  paint the screen
    lastTime = timeStamp;
    // if time exceeds nextframe value then paint
    // and reset timer to zero else add delta time
    if (timer > nextframe) {
        // drawing transparent rectangle over text to hide previous text
        ctx.fillStyle = "rgba(0,0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        // text color
        ctx.fillStyle = singleColor;
        //drawing text column
        effect.symbols.map((symbol) => {
            symbol.draw(ctx);
            symbol.update();
        });
        timer = 0;
    } else {
        timer += deltaTime;
    }

    requestAnimationFrame(animate);
}

window.addEventListener("DOMContentLoaded", init);
window.addEventListener("resize", resizeReset);