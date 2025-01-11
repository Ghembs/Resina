let canvas, context, width, height;

let particles = {
    "gorgo": {balls: [], drawn: false},
    "me": {balls: [], drawn: false},
    "moise": {balls: [], drawn: false},
    "ricca": {balls: [], drawn: false},
    "ross": {balls: [], drawn: false}
};

let elCanvas, imgA, imgB;
let cursor = {}

const begin = () => {
    for (let name in particles){
        start(name).then(() => {
            canvas = document.getElementById(name);
            context = canvas.getContext("2d");
            canvas.width = 305;
            canvas.height = 215;
            width = canvas.width;
            height = canvas.height;
            let x, y, ix, iy, idx, r, g, b, alfa, colA, colB, colMap, particle, radius;

            const imgACanvas = document.createElement("canvas");
            const imgAContext = imgACanvas.getContext("2d");

            imgACanvas.width = imgA.width;
            imgACanvas.height = imgA.height;

            // const imgBCanvas = document.createElement("canvas");
            // const imgBContext = imgBCanvas.getContext("2d");
            //
            // imgBContext.width = imgB.width;
            // imgBContext.height = imgB.height;

            imgAContext.drawImage(imgA, 0, 0)
            //imgBContext.drawImage(imgB, 0, 0)

            elCanvas = canvas;
            cursor.pos = new Vector(9999, 9999);
            const imgAData = imgAContext.getImageData(0, 0, imgA.width, imgA.height).data;
            // //const imgBData = imgBContext.getImageData(0, 0, imgB.width, imgB.height).data;
            //
            const numCircles = 23;
            let dotRadius = 3;
            const gapCircle = 2;
            const gapDots = 1;
            let cirRadius = 0;
            const fitRadius = dotRadius;

            canvas.addEventListener('mousedown', onMouseDown)

            for (let i = 0; i < numCircles; i++) {
                const numFit = i ? Math.floor(2 * Math.PI * cirRadius / (fitRadius * 2 + gapDots)) : 1;
                const fitSlice = Math.PI * 2 / numFit;
                for (let j = 0; j < numFit; j++) {
                    const theta = fitSlice * j;

                    x = Math.cos(theta) * cirRadius;
                    y = Math.sin(theta) * cirRadius;
                    //x += width * 0.5;
                    //y += height * 0.5;

                    ix = Math.floor((x / 350) * imgA.width) + imgA.width / 2;
                    iy = Math.floor((y / 350) * imgA.height) + imgA.height / 2;
                    idx = ((iy * imgA.height) + ix) * 4;

                    r = imgAData[idx];
                    g = imgAData[idx + 1];
                    b = imgAData[idx + 2];
                    alfa = imgAData[idx + 3];
                    colA = `rgb(${r}, ${g}, ${b})`;

                    // const rb = imgBData[idx];
                    // const gb = imgBData[idx + 1];
                    // const bb = imgBData[idx + 2];
                    // const alfab = imgBData[idx + 3];
                    // colB = `rgb(${rb}, ${gb}, ${bb})`;
                    //
                    // colMap = colorInterpolate(colA, colB, 0.5);

                    radius = map(r, 0, 255, 1, 5);

                    particle = new Particle(x + width / 2, y + height / 2, radius,
                        getRndNumber(height / 10, height / 5), getRndNumber(0.02, 0.03), getRndNumber(0.002, 0.006),
                        getRndNumber(0.9, 0.97), 1, colA);
                    particles[name].balls.push(particle);
                }
                particles[name].context = context;

                cirRadius += fitRadius * 2 + gapCircle;
                dotRadius = (1 - (i / numCircles)) * fitRadius;
            }
            //draw()
            animate();
        })
    }
};

function draw () {
    //context.drawImage(imgACanvas, 0, 0);
    for (let cucciolo in particles) {
        if (particles[cucciolo].context && !particles[cucciolo].drawn) {
            particles[cucciolo].context.fillStyle = 'black';
            particles[cucciolo].context.fillRect(0, 0, width, height);
            particles[cucciolo].balls.sort((a, b) => a.scale - b.scale);

            const spippola = () => {
                return new Promise(function (resolve, reject) {
                    let defPos = true;
                    particles[cucciolo].balls.forEach((particle) => {
                        if (!particles[cucciolo].drawn) {
                            if (cursor.canvas && cucciolo !== cursor.canvas) {
                                particle.pos.x = particle.iPos.x;
                                particle.pos.y = particle.iPos.y;
                                particle.vel = new Vector(0, 0);
                                particle.acc = new Vector(0, 0);
                                particle.scale = 1;
                                particle.draw(particles[cucciolo].context);
                            }
                            else{
                                particle.update();
                                particle.draw(particles[cucciolo].context);
                                if (particle.pos.distance(particle.iPos) > 1) {
                                    defPos = false;
                                }
                            }
                        }
                    });
                    resolve(defPos);
                })
            }
            spippola().then((defPos)=> {
                if (!cursor.canvas && defPos) particles[cucciolo].drawn = true;
            });
        }
    }
}

function animate () {
    requestAnimationFrame(animate);
    draw();
}

const map = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;

function getRndNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function getRgb(color) {
    let [r, g, b] = color.replace('rgb(', '')
        .replace(')', '')
        .split(',')
        .map(str => Number(str));
    return {
        r,
        g,
        b
    }
}

function colorInterpolate(colorA, colorB, intval) {
    const rgbA = getRgb(colorA),
        rgbB = getRgb(colorB);
    const colorVal = (prop) =>
        Math.round(rgbA[prop] * (1 - intval) + rgbB[prop] * intval);
    return {
        r: colorVal('r'),
        g: colorVal('g'),
        b: colorVal('b'),
    }
}

async function start (pic) {
    imgA = await loadImage("http://localhost:8081/assets/" + pic + ".jpeg");
    //imgB = await loadImage("https://www.nationalgeographic.it/upload/ngi-hero/cover-1695799828548-Panda.jpeg");
    //imgA = document.getElementById("picricca");
    //imgB = document.getElementById("picricca");
    //begin();
}

window.addEventListener("DOMContentLoaded", begin);
//start();

function onMouseDown(e) {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    cursor.canvas = e.target.id;
    particles[cursor.canvas].drawn = false;

    onMouseMove(e);
}

function onMouseMove(e) {
    const x = e.offsetX //(e.offsetX / elCanvas.offsetWidth) * elCanvas.width;
    const y = e.offsetY //(e.offsetY / elCanvas.offsetHeight) * elCanvas.height;

    cursor.pos.x = x;
    cursor.pos.y = y;
}

function onMouseUp() {
    window.removeEventListener("mousemove", onMouseMove);
    window.removeEventListener("mouseup", onMouseUp);

    cursor.pos.x = 9999;
    cursor.pos.y = 9999;
    cursor.canvas = null;
}

async function loadImage(url){
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
        img.src = url;
        img.crossOrigin = "anonymous";
    })
}

class Vector {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    distance (vec) {
        let dx = this.x - vec.x;
        let dy = this.y - vec.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    sum (vec) {
        this.x += vec.x;
        this.y += vec.y;
    }
}

class Particle {
    constructor(x, y, radius = 10, minDist = 100, push = 0.02,
                pull = 0.004, drag = 0.95, scale = 1, color = colors[0]) {
        this.pos = new Vector(x, y);
        this.acc = new Vector(0, 0);
        this.vel = new Vector(0, 0);
        this.iPos = new Vector(x, y);
        this.radius = radius;
        this.minDist = minDist;
        this.push = push;
        this.drag = drag;
        this.pull = pull;
        this.scale = scale;
        this.colorMap = color;
        this.color = "white";
    }

    update() {
        // pull force
        this.acc.x = (this.iPos.x - this.pos.x) * this.pull;
        this.acc.y = (this.iPos.y - this.pos.y) * this.pull;
        let dist = this.pos.distance(this.iPos);

        this.scale = map(dist, 0, 200, 1, 5);
        //this.color = colors[Math.floor(math.mapRange(dist, 0, 200, 0,
        //    colors.length - 1, true))]
        this.color = this.colorMap //(map(dist, 0, 200, 0, 1, true))

        // push force
        dist = this.pos.distance(cursor.pos);
        if (dist < this.minDist) {
            const distDelta = this.minDist - dist;
            this.acc.x += (this.pos.x - cursor.pos.x) / dist * distDelta * this.push;
            this.acc.y += (this.pos.y - cursor.pos.y) / dist * distDelta * this.push;
        }

        this.vel.sum(this.acc);
        this.vel.x *= this.drag;
        this.vel.y *= this.drag;
        this.pos.sum(this.vel);
    }

    draw (context) {
        context.save();
        context.translate(this.pos.x, this.pos.y);
        context.fillStyle = this.color;

        context.beginPath();
        context.arc(0, 0, this.radius * this.scale, 0, Math.PI * 2);
        context.fill();
        context.restore();
    }
}