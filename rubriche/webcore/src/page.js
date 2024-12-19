let width, height, pages, proportionX, proportionY;
let maxWidth = 1240;
let maxHeight = 1754;

async function createPages(result) {
    const parser = new DOMParser();
    let content = parser.parseFromString(result[0].content.rendered, "text/html");
    let pagina = createPage();
    let altezza = Math.min(parseInt(pagina.style.height), maxHeight);
    //let distacco = pagina.offsetTop * 2;
    //pagina.innerHTML = result[0].content.rendered;
    for (let j = 0; j < content.body.childNodes.length; j++) {
        pagina.appendChild(content.body.childNodes[j]);

        if (pagina.lastElementChild.getElementsByTagName("img").length &&
            pagina.lastElementChild.offsetHeight < 50){
            await positionImage(pagina);
        }
        pagina.lastElementChild.style.wordBreak= "break-word";
        // console.log(pagina.lastElementChild);
        // console.log(pagina.lastElementChild.offsetTop);
        // console.log(pagina.lastElementChild.offsetHeight);
        // console.log("ALTEZZA: " + altezza)
        if (pagina.lastElementChild.offsetTop + pagina.lastElementChild.offsetHeight >
            altezza) {
            altezza += Math.min(parseInt(pagina.style.height), maxHeight);
            let child = pagina.lastElementChild;
            pagina.removeChild(child);
            pagina = createPage();
            pagina.appendChild(child);
        }
    }

    let titolo = result[0].title.rendered;
    let titoloPagina = document.getElementById("titolo");
    titoloPagina.innerText = titolo + " - Microsoft Word";
    document.title = titolo.innerText;
}

function positionImage (pagina) {
    return new Promise((resolve, reject) => {
        let image = pagina.lastElementChild.getElementsByTagName("img")[0];
        pagina.removeChild(pagina.lastElementChild);
        pagina.appendChild(image);
        let url = image.src;
        let img = new Image;
        img.src = url;
        img.onload = function() {
            image.style.maxWidth = Math.min(Math.min(parseInt(pagina.style.width),
                maxWidth) * 0.8, img.width) + "px";
            // image.height = Math.min(image.offsetTop + img.height,
            //     parseInt(pagina.style.height) - image.offsetTop);
            resolve(image);
        };
    })
}

function createPage () {
    let pagina = document.createElement("div");
    pagina.className = "a4-paper";

    pagina.style.width = width * proportionX + "px";
    pagina.style.height = width * proportionY + "px";
    pagina.style.marginLeft = isMobile() ? (width - Math.min(parseInt(pagina.style.width), maxWidth)) / 2 + "px" :
    (width - Math.min(parseInt(pagina.style.width), maxWidth)) / 2 - 32 + "px";

    pages.appendChild(pagina);

    return pagina;
}

function init() {
    if (isMobile()) {
        proportionX = 0.9;
        proportionY = 1.27;
    } else {
        proportionX = 0.8;
        proportionY = 1.13;
    }
    resize();
}

function resize() {
    const queryString = new URLSearchParams(window.location.search);
    const localhost = "https://resina-wp.threefaces.org/wp-json/wp/v2";
    const url = `${localhost}/posts?slug=` + queryString.get("article");
    const ftch = fetch(url);
    ftch.then(res => {
        let data = res.json();
        data.then((result) => {
            pages = document.getElementById("pages");
            pages.innerHTML = "";
            createPages(result);
        })
    });
    let writings = document.getElementById("test");
    width = writings.offsetWidth;
    let paperruler = document.getElementById("paper-ruler");
    paperruler.style.height = width * (proportionY + 0.01) + "px";

    let rulerX = document.getElementsByClassName("ruler-x")[0];
    let rulerY = document.getElementsByClassName("ruler-y")[0];
    let left =document.getElementById("left");
    let right =document.getElementById("right");

    if (!isMobile()){
        for (let i = 0; i < Math.ceil(width * proportionY / 96); i++) {
            let li = document.createElement("li");
            rulerY.appendChild(li);
            let empty = document.createElement("div");
            if (i === 0 || i === Math.round(width * proportionY / 96)){
                let brown = document.createElement("div");
                brown.style.backgroundColor = "#7c7770";
                brown.style.width = 22 + "px";
                brown.style.height = 1 + "in";
                brown.style.opacity = "0.7";
                li.appendChild(brown);
            } else {
                let empty = document.createElement("div");
                empty.style.width = 22 + "px";
                empty.style.height = 1 + "in";
                li.appendChild(empty);
            }
        }
    }

    rulerX.style.width = Math.min(width * proportionX, maxWidth) + "px";
    rulerX.style.display = "flex";
    rulerX.style.flexDirection = "row";
    rulerX.innerHTML = "";

    for (let i = 0; i < Math.round(width * proportionX / 96); i++) {
        let li = document.createElement("li");
        rulerX.appendChild(li);
        if (i === 0 || i === Math.floor(width * proportionX / 96)){
            let brown = document.createElement("div");
            brown.style.backgroundColor = "#7c7770";
            brown.style.height = 22 + "px";
            brown.style.width = 1 + "in";
            brown.style.opacity = "0.7";
            li.appendChild(brown);
        } else {
            let empty = document.createElement("div");
            empty.style.height = 22 + "px";
            empty.style.width = 1 + "in";
            li.appendChild(empty);
        }
    }

    left.style.display = "flex";
    left.style.flexDirection = "row";
    left.style.width = Math.max((width * (1-proportionX)), (width - maxWidth)) / 2 + "px"

    right.style.display = "flex";
    right.style.flexDirection = "row";
    right.style.width = Math.max((width * (1-proportionX)), (width - maxWidth)) / 2 + "px"
}

function isMobile() {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
}

window.addEventListener("DOMContentLoaded", init);
window.addEventListener("resize", resize);