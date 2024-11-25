let width, height;

function init() {
    resize();

    const queryString = new URLSearchParams(window.location.search);
    const localhost = "https://resina-wp.threefaces.org/wp-json/wp/v2";
    const url = `${localhost}/posts?slug=` + queryString.get("article");
    const ftch = fetch(url);
    ftch.then(res => {
        const parser = new DOMParser();
        let data = res.json();
        data.then((result) => {
            let pagina = document.getElementById("a4-paper");
            pagina.innerHTML = result[0].content.rendered;
            let titolo = parser.parseFromString(result[0].content.rendered, "text/html").getElementsByTagName("h1")[0];
            let titoloPagina = document.getElementById("titolo");
            titoloPagina.innerText = titolo.innerText + " - Microsoft Word";
            document.title = titolo.innerText;
        })
    });
}

function resize() {
    let writings = document.getElementById("test");
    width = writings.offsetWidth;
    let page = document.getElementById("a4-paper");
    let paperruler = document.getElementById("paper-ruler");
    page.style.width = width*0.8 + "px";
    page.style.height = width*1.13 + "px";
    paperruler.style.height = width*1.14 + "px";

    page.style.marginLeft = (width - page.offsetWidth) / 2 -32 + "px";

    let rulerX = document.getElementsByClassName("ruler-x")[0];
    let rulerY = document.getElementsByClassName("ruler-y")[0];
    let left =document.getElementById("left");
    let right =document.getElementById("right");
    rulerX.style.width = page.offsetWidth + "px";
    rulerX.style.display = "flex";
    rulerX.style.flexDirection = "row";
    rulerX.innerHTML = "";

    for (let i = 0; i < Math.round(page.offsetWidth / 96); i++) {
        let li = document.createElement("li");
        rulerX.appendChild(li);
        if (i === 0 || i === Math.floor(page.offsetWidth / 96)){
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

    for (let i = 0; i < Math.ceil(page.offsetHeight / 96); i++) {
        let li = document.createElement("li");
        rulerY.appendChild(li);
        let empty = document.createElement("div");
        if (i === 0 || i === Math.round(page.offsetHeight / 96)){
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

    left.style.display = "flex";
    left.style.flexDirection = "row";
    left.style.width = (width - page.offsetWidth) / 2 + "px"

    right.style.display = "flex";
    right.style.flexDirection = "row";
    right.style.width = (width - page.offsetWidth) / 2 + "px"
}

window.addEventListener("DOMContentLoaded", init);
window.addEventListener("resize", resize);