let canvas, ctx, w, h, trees;
let branchChance = [0.08, 0.09, 0.1, 0.11, 0.12, 0.15, 0.3];
let branchAngles = [20, 25, 30, 35, 40, 45];

function degToRad(deg) {
    return deg * Math.PI / 180;
}

function getRandomInt(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

function init() {
    canvas = document.querySelector("#canvas");
    ctx = canvas.getContext("2d");

    ctx.fillStyle = `rgba(0, 0, 0, 1)`;
    ctx.fillRect(0, 0, w, 10);

    let header = document.getElementsByTagName("header")[0];
    let parser = new DOMParser();
    resizeReset();
}

function resizeReset() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;

    trees = [];
    animationLoop();
    trees.push(new Tree());
    //drawGround();
}

function drawGround() {
    ctx.fillStyle = `rgba(0, 0, 0, 1)`;
    ctx.fillRect(0, h - 10, w, 10);
}

function animationLoop() {
    drawScene();
    requestAnimationFrame(animationLoop);
}

function drawScene() {
    trees.map((t) => {
        if (t.branchs[0].radius >= 0) {
            t.update();
            t.draw();
        }
    })
}

function addTree(e) {
    trees.push(new Tree(e.x));
}

class Tree {
    constructor(x) {
        this.x = (x)? x : w * 0.5;
        this.y = h / 2;
        this.branchs = [];
        for (let i = 0; i < 8; i++) {
            this.addBranch(this.x, this.y, getRandomInt(3, 7), i * 45 + getRandomInt(-15, 15));
        }
    }

    addBranch(x, y, radius, angle) {
        this.branchs.push(new Branch(x, y, radius, angle));
    }

    draw(){
        this.branchs.map((b) => {
            b.draw();
        })
    }
    update(){
        this.branchs.map((b) => {
            b.update();
            if (b.radius > 0 && b.progress > 0.01 && Math.random() < b.branchChance && b.branchCount < 4) {
                this.addBranch(b.x, b.y, b.radius-1,
                    b.angle+branchAngles[getRandomInt(0, branchAngles.length -1)] * b.branchDirection);
                b.branchCount++;
                // cambiare direzione qua favorisce una relativa simmetria dell'albero
                b.branchDirection *= -1;
            }
        })
    }
}

class Branch {
    constructor(x, y, radius, angle) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.angle = angle;
        this.branchReset();
    }

    branchReset() {
        this.sx = this.x;
        this.sy = this.y;
        // varia la distanza fra i pallini che vanno a comporre il ramo
        // TODO parametrizzare il fattore moltiplicativo per far apparire alberi più piccoli ma altrettanto
        //  ramificati che sembrano più lontani, magari riducendo ulteriormente l'opacità
        this.length = 30 * this.radius;
        this.progress = 0;
        // la probabilità incrementale di generare nuovi rami, al diminuire della dimensione del pallino
        this.branchChance = branchChance[7 - this.radius];
        this.branchCount = 0;
        this.branchDirection = Math.random() < 0.5 ? -1 : 1;
    }

    draw(){
        if (this.radius <= 0) return;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(38, 76, 92, 0.5)`;
        ctx.fill();
        ctx.closePath();
    }
    update(){
        if (this.radius <= 0) return;
        let radian = degToRad(this.angle);
        // seno e coseno dell'angolo per pesare la velocità di crescita in una direzione
        this.x = this.sx + this.length * this.progress * Math.sin(radian);
        this.y = this.sy + this.length * this.progress * Math.cos(radian);
        // diviso per il raggio o meno non cambia la lunghezza effettiva ma varia il numero di pallini disegnati
        // TODO parametrizzare il valore proporzionalmente al parametro di length e magari al raggio e al parametro
        //  rispetto al quale emergono i rami, per variare gli alberi senza che appaiano pallini vistosi
        this.progress += 0.05 / this.radius;

        if (this.progress > 1) {
            this.radius -= 1;
            // non ho visto grande differenza fra fare floor ma * 3 o semplicemente * 2 quindi per risparmiare bruh
            //let numero = (Math.floor(Math.random() * 3) - 1) * 10
            let numeroDiverso = (Math.random() * 2 - 1) * 10
            this.angle += numeroDiverso;
            this.branchReset();
        }
    }
}

window.addEventListener("DOMContentLoaded", init);
//window.addEventListener("click", addTree)
window.addEventListener("resize", resizeReset);