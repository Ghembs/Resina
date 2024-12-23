let canvas, ctx, articles, dots, maxDistance, fontSize;
const urlSpore = `${localhost}/posts?categories=7`;
const queryString = new URLSearchParams(window.location.search);
const urlArticle = `${localhost}/posts?slug=` + queryString.get("article");

/*
 * A speed-improved perlin and simplex noise algorithms for 2D.
 *
 * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 * Converted to Javascript by Joseph Gentle.
 *
 * Version 2012-03-09
 *
 * This code was placed in the public domain by its original author,
 * Stefan Gustavson. You may use it as you see fit, but
 * attribution is appreciated.
 *
 */

(function(global){
    let module = global.noise = {};

    function Grad(x, y, z) {
        this.x = x; this.y = y; this.z = z;
    }

    Grad.prototype.dot2 = function(x, y) {
        return this.x*x + this.y*y;
    };

    Grad.prototype.dot3 = function(x, y, z) {
        return this.x*x + this.y*y + this.z*z;
    };

    let grad3 = [new Grad(1,1,0),new Grad(-1,1,0),new Grad(1,-1,0),new Grad(-1,-1,0),
        new Grad(1,0,1),new Grad(-1,0,1),new Grad(1,0,-1),new Grad(-1,0,-1),
        new Grad(0,1,1),new Grad(0,-1,1),new Grad(0,1,-1),new Grad(0,-1,-1)];

    let p = [151,160,137,91,90,15,
        131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,
        190, 6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,
        88,237,149,56,87,174,20,125,136,171,168, 68,175,74,165,71,134,139,48,27,166,
        77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,
        102,143,54, 65,25,63,161, 1,216,80,73,209,76,132,187,208, 89,18,169,200,196,
        135,130,116,188,159,86,164,100,109,198,173,186, 3,64,52,217,226,250,124,123,
        5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,
        223,183,170,213,119,248,152, 2,44,154,163, 70,221,153,101,155,167, 43,172,9,
        129,22,39,253, 19,98,108,110,79,113,224,232,178,185, 112,104,218,246,97,228,
        251,34,242,193,238,210,144,12,191,179,162,241, 81,51,145,235,249,14,239,107,
        49,192,214, 31,181,199,106,157,184, 84,204,176,115,121,50,45,127, 4,150,254,
        138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180];
    // To remove the need for index wrapping, double the permutation table length
    let perm = new Array(512);
    let gradP = new Array(512);

    // This isn't a very good seeding function, but it works ok. It supports 2^16
    // different seed values. Write something better if you need more seeds.
    module.seed = function(seed) {
        if(seed > 0 && seed < 1) {
            // Scale the seed out
            seed *= 65536;
        }

        seed = Math.floor(seed);
        if(seed < 256) {
            seed |= seed << 8;
        }

        for(let i = 0; i < 256; i++) {
            let v;
            if (i & 1) {
                v = p[i] ^ (seed & 255);
            } else {
                v = p[i] ^ ((seed>>8) & 255);
            }

            perm[i] = perm[i + 256] = v;
            gradP[i] = gradP[i + 256] = grad3[v % 12];
        }
    };

    module.seed(0);

    /*
    for(let i=0; i<256; i++) {
      perm[i] = perm[i + 256] = p[i];
      gradP[i] = gradP[i + 256] = grad3[perm[i] % 12];
    }*/

    // Skewing and unskewing factors for 2, 3, and 4 dimensions
    let F2 = 0.5*(Math.sqrt(3)-1);
    let G2 = (3-Math.sqrt(3))/6;

    let F3 = 1/3;
    let G3 = 1/6;

    // 2D simplex noise
    module.simplex2 = function(xin, yin) {
        let n0, n1, n2; // Noise contributions from the three corners
        // Skew the input space to determine which simplex cell we're in
        let s = (xin+yin)*F2; // Hairy factor for 2D
        let i = Math.floor(xin+s);
        let j = Math.floor(yin+s);
        let t = (i+j)*G2;
        let x0 = xin-i+t; // The x,y distances from the cell origin, unskewed.
        let y0 = yin-j+t;
        // For the 2D case, the simplex shape is an equilateral triangle.
        // Determine which simplex we are in.
        let i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
        if(x0>y0) { // lower triangle, XY order: (0,0)->(1,0)->(1,1)
            i1=1; j1=0;
        } else {    // upper triangle, YX order: (0,0)->(0,1)->(1,1)
            i1=0; j1=1;
        }
        // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
        // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
        // c = (3-sqrt(3))/6
        let x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
        let y1 = y0 - j1 + G2;
        let x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords
        let y2 = y0 - 1 + 2 * G2;
        // Work out the hashed gradient indices of the three simplex corners
        i &= 255;
        j &= 255;
        let gi0 = gradP[i+perm[j]];
        let gi1 = gradP[i+i1+perm[j+j1]];
        let gi2 = gradP[i+1+perm[j+1]];
        // Calculate the contribution from the three corners
        let t0 = 0.5 - x0*x0-y0*y0;
        if(t0<0) {
            n0 = 0;
        } else {
            t0 *= t0;
            n0 = t0 * t0 * gi0.dot2(x0, y0);  // (x,y) of grad3 used for 2D gradient
        }
        let t1 = 0.5 - x1*x1-y1*y1;
        if(t1<0) {
            n1 = 0;
        } else {
            t1 *= t1;
            n1 = t1 * t1 * gi1.dot2(x1, y1);
        }
        let t2 = 0.5 - x2*x2-y2*y2;
        if(t2<0) {
            n2 = 0;
        } else {
            t2 *= t2;
            n2 = t2 * t2 * gi2.dot2(x2, y2);
        }
        // Add contributions from each corner to get the final noise value.
        // The result is scaled to return values in the interval [-1,1].
        return 70 * (n0 + n1 + n2);
    };

    // 3D simplex noise
    module.simplex3 = function(xin, yin, zin) {
        let n0, n1, n2, n3; // Noise contributions from the four corners

        // Skew the input space to determine which simplex cell we're in
        let s = (xin+yin+zin)*F3; // Hairy factor for 2D
        let i = Math.floor(xin+s);
        let j = Math.floor(yin+s);
        let k = Math.floor(zin+s);

        let t = (i+j+k)*G3;
        let x0 = xin-i+t; // The x,y distances from the cell origin, unskewed.
        let y0 = yin-j+t;
        let z0 = zin-k+t;

        // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
        // Determine which simplex we are in.
        let i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
        let i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
        if(x0 >= y0) {
            if(y0 >= z0)      { i1=1; j1=0; k1=0; i2=1; j2=1; k2=0; }
            else if(x0 >= z0) { i1=1; j1=0; k1=0; i2=1; j2=0; k2=1; }
            else              { i1=0; j1=0; k1=1; i2=1; j2=0; k2=1; }
        } else {
            if(y0 < z0)      { i1=0; j1=0; k1=1; i2=0; j2=1; k2=1; }
            else if(x0 < z0) { i1=0; j1=1; k1=0; i2=0; j2=1; k2=1; }
            else             { i1=0; j1=1; k1=0; i2=1; j2=1; k2=0; }
        }
        // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
        // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
        // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
        // c = 1/6.
        let x1 = x0 - i1 + G3; // Offsets for second corner
        let y1 = y0 - j1 + G3;
        let z1 = z0 - k1 + G3;

        let x2 = x0 - i2 + 2 * G3; // Offsets for third corner
        let y2 = y0 - j2 + 2 * G3;
        let z2 = z0 - k2 + 2 * G3;

        let x3 = x0 - 1 + 3 * G3; // Offsets for fourth corner
        let y3 = y0 - 1 + 3 * G3;
        let z3 = z0 - 1 + 3 * G3;

        // Work out the hashed gradient indices of the four simplex corners
        i &= 255;
        j &= 255;
        k &= 255;
        let gi0 = gradP[i+   perm[j+   perm[k   ]]];
        let gi1 = gradP[i+i1+perm[j+j1+perm[k+k1]]];
        let gi2 = gradP[i+i2+perm[j+j2+perm[k+k2]]];
        let gi3 = gradP[i+ 1+perm[j+ 1+perm[k+ 1]]];

        // Calculate the contribution from the four corners
        let t0 = 0.6 - x0*x0 - y0*y0 - z0*z0;
        if(t0<0) {
            n0 = 0;
        } else {
            t0 *= t0;
            n0 = t0 * t0 * gi0.dot3(x0, y0, z0);  // (x,y) of grad3 used for 2D gradient
        }
        let t1 = 0.6 - x1*x1 - y1*y1 - z1*z1;
        if(t1<0) {
            n1 = 0;
        } else {
            t1 *= t1;
            n1 = t1 * t1 * gi1.dot3(x1, y1, z1);
        }
        let t2 = 0.6 - x2*x2 - y2*y2 - z2*z2;
        if(t2<0) {
            n2 = 0;
        } else {
            t2 *= t2;
            n2 = t2 * t2 * gi2.dot3(x2, y2, z2);
        }
        let t3 = 0.6 - x3*x3 - y3*y3 - z3*z3;
        if(t3<0) {
            n3 = 0;
        } else {
            t3 *= t3;
            n3 = t3 * t3 * gi3.dot3(x3, y3, z3);
        }
        // Add contributions from each corner to get the final noise value.
        // The result is scaled to return values in the interval [-1,1].
        return 32 * (n0 + n1 + n2 + n3);

    };

    // ##### Perlin noise stuff

    function fade(t) {
        return t*t*t*(t*(t*6-15)+10);
    }

    function lerp(a, b, t) {
        return (1-t)*a + t*b;
    }

    // 2D Perlin Noise
    module.perlin2 = function(x, y) {
        // Find unit grid cell containing point
        let X = Math.floor(x), Y = Math.floor(y);
        // Get relative xy coordinates of point within that cell
        x = x - X; y = y - Y;
        // Wrap the integer cells at 255 (smaller integer period can be introduced here)
        X = X & 255; Y = Y & 255;

        // Calculate noise contributions from each of the four corners
        let n00 = gradP[X+perm[Y]].dot2(x, y);
        let n01 = gradP[X+perm[Y+1]].dot2(x, y-1);
        let n10 = gradP[X+1+perm[Y]].dot2(x-1, y);
        let n11 = gradP[X+1+perm[Y+1]].dot2(x-1, y-1);

        // Compute the fade curve value for x
        let u = fade(x);

        // Interpolate the four results
        return lerp(
            lerp(n00, n10, u),
            lerp(n01, n11, u),
            fade(y));
    };

    // 3D Perlin Noise
    module.perlin3 = function(x, y, z) {
        // Find unit grid cell containing point
        let X = Math.floor(x), Y = Math.floor(y), Z = Math.floor(z);
        // Get relative xyz coordinates of point within that cell
        x = x - X; y = y - Y; z = z - Z;
        // Wrap the integer cells at 255 (smaller integer period can be introduced here)
        X = X & 255; Y = Y & 255; Z = Z & 255;

        // Calculate noise contributions from each of the eight corners
        let n000 = gradP[X+  perm[Y+  perm[Z  ]]].dot3(x,   y,     z);
        let n001 = gradP[X+  perm[Y+  perm[Z+1]]].dot3(x,   y,   z-1);
        let n010 = gradP[X+  perm[Y+1+perm[Z  ]]].dot3(x,   y-1,   z);
        let n011 = gradP[X+  perm[Y+1+perm[Z+1]]].dot3(x,   y-1, z-1);
        let n100 = gradP[X+1+perm[Y+  perm[Z  ]]].dot3(x-1,   y,   z);
        let n101 = gradP[X+1+perm[Y+  perm[Z+1]]].dot3(x-1,   y, z-1);
        let n110 = gradP[X+1+perm[Y+1+perm[Z  ]]].dot3(x-1, y-1,   z);
        let n111 = gradP[X+1+perm[Y+1+perm[Z+1]]].dot3(x-1, y-1, z-1);

        // Compute the fade curve value for x, y, z
        let u = fade(x);
        let v = fade(y);
        let w = fade(z);

        // Interpolate
        return lerp(
            lerp(
                lerp(n000, n100, u),
                lerp(n001, n101, u), w),
            lerp(
                lerp(n010, n110, u),
                lerp(n011, n111, u), w),
            v);
    };

})(this);

function createNoise(x, y) {
    return noise.simplex2(x, y);
}

if(queryString.get("article")) {
    const ftch = fetch(urlArticle);
    ftch.then(res => {
        let data = res.json();
        data.then((result) => {
            console.log(result);
            let contenuti = document.createElement("div");
            let back = document.createElement("a");
            let body = document.getElementsByTagName("body")[0];
            let title = document.createElement("h1");
            title.innerText = result[0].title.rendered;

            back.href = "page.html";
            back.innerText = "Spore >";
            back.classList.add("back");
            contenuti.appendChild(back);
            contenuti.appendChild(title);
            contenuti.classList.add("contenuti");

            const parser = new DOMParser();
            let content = parser.parseFromString(result[0].content.rendered, "text/html");
            // let contenuti = document.getElementById("content");
            for (let i = 0; i < content.body.childNodes.length; i++) {
                contenuti.appendChild(content.body.childNodes[i]);
                if (contenuti.lastElementChild.getElementsByTagName("img").length){
                    let img = document.createElement("img");
                    img.src = contenuti.lastElementChild.getElementsByTagName("img")[0].src;
                    img.style.maxWidth = "80%";
                    contenuti.removeChild(contenuti.lastElementChild);
                    contenuti.appendChild(img);
                }
            }
            body.appendChild(contenuti);
            // //contenuti.innerHTML = content.innerHTML;
            // contenuti.style.backgroundColor = "rgba(0, 0, 0, 0.5)"
            // contenuti.style.color = "#649CF7"
        });
    });
} else {
    const ftch = fetch(urlSpore);
    ftch.then(res => {
        let data = res.json();
        data.then((result) => {
            for (let item of result) {
                articles.push(new Article(item.title.rendered.toUpperCase(),
                    "?article=" + item.slug));
            }
        });
    });
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getRndNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function clamp(input, min, max) {
    return input < min ? min : input > max ? max : input;
}

function isMobile() {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent) || window.innerWidth < 750;
}

// function map(current, in_min, in_max, out_min, out_max) {
//     const mapped = ((current - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
//     return clamp(mapped, out_min, out_max);
// }

const map = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;

function init () {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    isMobile() ? fontSize = 2 : fontSize = 1;
    maxDistance = 200;
    articles = [];

    resizeReset();
    animate();
}

function resizeReset () {
    dots = [];
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    for (let i = 0; i < 100 - articles.length; i++) {
        dots.push(new DotDrawer(getRndNumber(0, canvas.width), getRndNumber(0, canvas.height), 1, getRndNumber(1, 3)));
    }
}

function animate() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    articles.forEach(article => {
        article.update(window.innerWidth, window.innerHeight);
        article.draw(ctx);
    })
    for (let i = 0; i < dots.length; i++) {
        let dot = dots[i];
        dot.update(window.innerWidth, window.innerHeight);
        dot.draw(ctx);
        for (let j = i+1; j < dots.length; j++) {
            let dot2 = dots[j];
            //drawLine(dot, dot2);
        }
        for (let j = 0; j < articles.length; j++) {
            let article = articles[j];
            drawLine(dot.pos, article.center.pos);
        }
    }
    requestAnimationFrame(animate);
}

function drawLine (vec1, vec2) {
    let dist = vec1.distance(vec2);
    ctx.lineWidth = map(dist, 0, maxDistance, 0.5, 0.2);

    if (dist <= maxDistance) {
        ctx.beginPath();
        ctx.moveTo(vec1.x, vec1.y);
        ctx.lineTo(vec2.x, vec2.y);
        ctx.stroke();
    }
}

function clickMouse (e) {
    articles.forEach(article => {
        if (article.center.pos.x - article.width / 2 < e.x && e.x < article.center.pos.x + article.width / 2 && article.center.pos.y > e.y && e.y > article.center.pos.y - article.height) {
            window.location = article.url;
        }
    })
}

function touch (evt) {
    let touches = evt.touches;
    for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        let e = {x: touch.x, y: touch.y};
        clickMouse(e);
    }
}

function mouseHover(e) {
    articles.forEach(article => {
        let mouse = new Vector(e.x, e.y);
        if (isMobile() && mouse.distance(article.center.pos) < 50) window.location = article.url;
        article.drawArticle = mouse.distance(article.center.pos) < 400;
        article.move = !(article.center.pos.x - article.width / 2 < e.x && e.x < article.center.pos.x + article.width / 2 && article.center.pos.y > e.y && e.y > article.center.pos.y - article.height);
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
}

class Article {
    constructor(title, url) {
        this.title = title;
        this.url = url;
        this.center = new DotDrawer(getRndNumber(0, canvas.width), getRndNumber(0, canvas.height), 0.5, getRndNumber(2, 4));

        ctx.font = fontSize + `vw Garamond`;
        let measure = ctx.measureText(this.title);
        this.width = measure.actualBoundingBoxLeft + measure.actualBoundingBoxRight;
        this.height = measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent;
        this.move = true;
        this.drawArticle = false;
    }

    draw (ctx){
        if (this.drawArticle || isMobile()) {
            ctx.fillStyle = '#000';
            ctx.font = fontSize + `vw Garamond`;
            ctx.fillText(this.title, this.center.pos.x - this.width / 2, this.center.pos.y + this.height / 2);
        } else {
            this.center.draw(ctx);
        }
    }

    update (width, height) {
        if (this.move) {
            this.center.update(width, height);
        }
    }
}

class DotDrawer {
    constructor(x, y, absVelMax, radius) {
        this.pos = new Vector(x, y);
        this.vel = new Vector(getRndNumber(-absVelMax, absVelMax), getRndNumber(-absVelMax, absVelMax))
        this.frc = new Vector(0, 0);


        this.uniqueVal = new Vector(getRndNumber(-1000, 1000), getRndNumber(-1000, 1000));
        this.drag = getRndNumber(0.95, 0.97);

        this.radius = radius;
        this.color = "#000"// `rgb(${150}, ${220}, ${255}, ${255})`//`hsl(${hue}, 100%, 50%)`
    };

    draw (context) {
        context.beginPath();
        context.fillStyle = this.color//"red";
        context.save();
        context.lineWidth = 2;
        context.translate(this.pos.x, this.pos.y);
        context.arc(0, 0, this.radius, 0, Math.PI * 2);
        context.fill();
        context.restore();
    }

    update (width, height) {
        this.frc.x = createNoise(this.uniqueVal.x, new Date().getTime()) * 0.2;
        this.frc.y = createNoise(this.uniqueVal.y, new Date().getTime()) * 0.2;
        //frc *= numero casuale fra 0 e un massimo di valore da dare al noise
        this.vel.x *= this.drag;
        this.vel.y *= this.drag;
        this.vel.x += this.frc.x + this.vel.x*0.03;
        this.vel.y += this.frc.y + this.vel.y*0.03;

        this.pos.x += this.vel.x;
        this.pos.y += this.vel.y;
        //hue++;

        this.wrap(width, height);
    }

    bounce (width, height) {
        if (this.pos.x - this.radius <= 0 || this.pos.x + this.radius >= width) this.vel.x *= -1;
        if (this.pos.y - this.radius <= 0 || this.pos.y + this.radius >= height) this.vel.y *= -1;
    }

    wrap (width, height) {
        if (this.pos.x <= 0) this.pos.x += width;
        if (this.pos.y <= 0 || (isMobile() && (this.pos.y <= height * 12 / 100))) this.pos.y = height;

        if (this.pos.x >= width) this.pos.x = 0;
        if (this.pos.y > height) isMobile()? this.pos.y = height * 12 / 100 : this.pos.y = 0;
    }
}

window.addEventListener('DOMContentLoaded', init);
document.addEventListener("click", clickMouse);
document.addEventListener("touchstart", touch);
document.addEventListener("touchend", touch);
document.addEventListener("touchcancel", touch);
document.addEventListener("touchmove", touch);
document.addEventListener("mousemove", mouseHover);
window.addEventListener("resize", resizeReset);