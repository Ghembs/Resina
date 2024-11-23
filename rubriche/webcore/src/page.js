let width, height;

function resize() {
    let writings = document.getElementById("test");
    width = writings.offsetWidth;
    let page = document.getElementById("a4-paper");
    page.style.width = width*0.8 + "px";
    page.style.height = width*1.13 + "px";

    page.style.marginLeft = (width - page.offsetWidth) / 2 + "px";

    let rulerX = document.getElementsByClassName("ruler-x")[0];
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

    left.style.display = "flex";
    left.style.flexDirection = "row";
    left.style.width = (width - page.offsetWidth) / 2 + "px"

    right.style.display = "flex";
    right.style.flexDirection = "row";
    right.style.width = (width - page.offsetWidth) / 2 + "px"
}

window.addEventListener("DOMContentLoaded", resize);
window.addEventListener("resize", resize);