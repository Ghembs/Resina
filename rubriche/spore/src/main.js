let canvas, ctx, articles;

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function init () {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    articles = [new Article("CIAONE BITCHES", "https://resina.threefaces.org")];

    resizeReset();
    draw();
}

function resizeReset () {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

function draw () {
    articles.forEach(article => {
        article.draw(ctx);
    })
}

function clickMouse (e) {
    articles.forEach(article => {
        console.log(e.x);
        console.log(e.y);
        console.log(article.x);
        console.log(article.y);
        console.log(article.width);
        console.log(article.height);
        if (article.x < e.x && e.x < article.x + article.width && article.y > e.y && e.y > article.y - article.height) {
            window.location = article.url;
        }
    })
}

class Article {
    constructor(title, url) {
        this.title = title;
        this.url = url;
        this.x = getRndInteger(0, window.innerWidth);
        this.y = getRndInteger(0, window.innerHeight);
    }

    draw (ctx){
        ctx.fillStyle = '#000';
        ctx.font = `20px Garamond`;
        let measure = ctx.measureText(this.title);
        this.width = measure.actualBoundingBoxLeft + measure.actualBoundingBoxRight;
        this.height = measure.actualBoundingBoxAscent + measure.actualBoundingBoxDescent;
        ctx.fillText(this.title, this.x, this.y);
    }
}

document.addEventListener('DOMContentLoaded', init);
document.addEventListener("click", clickMouse);