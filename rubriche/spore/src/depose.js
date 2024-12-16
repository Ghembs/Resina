let righe;
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function populateRighe(testi) {
    return new Promise(function(resolve, reject) {
        for (let i = 0; i < testi.length; i++) {
            if (testi[i].innerHTML !== "Test") {
                testi[i].innerHTML.split("\n").forEach((item) => {
                    righe.push(item);
                });
            }
        }
        resolve(righe);
    });
}

function displayTextWidth(text, font) {
    let canvas = displayTextWidth.canvas || (displayTextWidth.canvas = document.createElement("canvas"));
    let context = canvas.getContext("2d");
    //context.font = font;
    let metrics = context.measureText(text);
    return metrics.width;
}

window.onload = function () {
    const urlPoesia = `${localhost}/pages?slug=poesia`;
    const ftch = fetch(urlPoesia);
    let back = document.createElement("a");
    let body = document.getElementsByTagName("body")[0];
    let contenuti = document.getElementsByClassName("contenuti")[0];
    contenuti.style.backgroundColor = "lightgray";
    righe = [];

    back.href = "page.html";
    back.innerText = "Spore >";
    back.classList.add("back");
    body.appendChild(back);
    ftch.then(res => {
        let data = res.json();
        data.then((result) => {
            const parser = new DOMParser();
            let content = parser.parseFromString(result[0].content.rendered, 'text/xml');
            let testi = content.getElementsByClassName("testo_poesia");
            populateRighe(testi).then((result) => {
                let temp = [];
                result.map((item) => {
                    temp.push(item);
                });
                contenuti.innerHTML = "";
                while (temp.length) {
                    let row = document.createElement("p");
                    row.style.textAlign = "left";
                    let extract =temp.splice(getRndInteger(0, temp.length), 1);
                    row.innerHTML = extract;
                    row.style.marginLeft = getRndInteger(0, contenuti.offsetWidth - displayTextWidth(extract, "")) + "px";
                    contenuti.appendChild(row);
                }
                setInterval(function () {
                    result.map((item) => {
                        temp.push(item);
                    });
                    contenuti.innerHTML = "";
                    while (temp.length) {
                        let row = document.createElement("p");
                        row.style.textAlign = "left";
                        let extract =temp.splice(getRndInteger(0, temp.length), 1);
                        row.innerHTML = extract;
                        row.style.marginLeft = getRndInteger(0, contenuti.offsetWidth - displayTextWidth(extract, "")) + "px";
                        contenuti.appendChild(row);
                    }
                }, 60000);
            });
        });
    });
}