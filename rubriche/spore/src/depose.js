let righe;
// URL DEPOSE https://resina-wp.threefaces.org/wp-json/wp/v2/posts?tags=12
// URL AUTORI https://resina-wp.threefaces.org/wp-json/wp/v2/tags/10?_fields[]=name

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function populateRighe(testi) {
    return new Promise(function(resolve, reject) {
        for (let i = 0; i < testi.length; i++) {
            if (testi[i].text !== "Test") {
                testi[i].text.split("\n").forEach((item) => {
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
    context.font = "2vw Arial"
    let metrics = context.measureText(text);
    return metrics.width;
}

function writeDepose (result, contenuti) {
    let temp = [];
    result.map((item) => {
        temp.push(item);
    });
    const back = contenuti.removeChild(contenuti.getElementsByClassName("back")[0]);
    contenuti.innerHTML = "";
    contenuti.appendChild(back);
    while (temp.length) {
        let row = document.createElement("p");
        let extract =temp.splice(getRndInteger(0, temp.length), 1);
        row.style.fontSize = getRndInteger(1, 5) + "vw";
        row.innerHTML = extract;
        row.style.marginLeft = getRndInteger(0, contenuti.offsetWidth - displayTextWidth(extract, "") -100) + "px";
        row.style.textAlign = "left";

        if (Math.random() > 0.9) {
            multiplyRow(row, Math.random() > 0.5);
        }
        if (Math.random() > 0.8) {
            row.style.transform = "rotate(" + getRndInteger(-180, 180) + "deg)";
        }
        if (Math.random() > 0.7) {
            row.style.fontStyle = "italic";
        }
        if (Math.random() > 0.8) {
            row.style.fontWeight = "bold";
        }
        contenuti.appendChild(row);
    }
}

function multiplyRow (row, displaced = false, reverse = Math.random() < 0.5) {
    const phrases = getRndInteger(1, 5);
    if (displaced && reverse) {
        for (let i = 0; i < phrases; i++) {
            row.innerHTML = "&nbsp;" + row.innerHTML;
        }
    }
    let clone = row.innerHTML;
    //let clone = displaced ? (reverse ? row.innerText.replace("&nbsp;", "") : "&nbsp;" + row.innerText) : row.innerText;
    row.style.lineHeight = getRndInteger(1, 10) + "px";
    for (let i = 0; i < phrases; i++) {
        if (displaced) {
            reverse ? clone = clone.replace("&nbsp;", "") : clone = "&nbsp;" + clone;
        }
        row.innerHTML += "<br>" + clone;
    }
}

window.onload = function () {
    const urlDepose = `${localhost}/posts?tags=12`;
    const ftch = fetch(urlDepose);
    let contenuti = document.getElementsByClassName("contenuti")[0];
    righe = [];

    ftch.then(res => {
        let data = res.json();
        data.then((result) => {
            const parser = new DOMParser();
            let testi = [];
            for (let i = 0; i < result.length; i++) {
                let content = parser.parseFromString(result[i].content.rendered, 'text/html');
                const paragraphs = content.getElementsByTagName("p");
                for (let j = 0; j < paragraphs.length; j++) {
                    if (paragraphs[j].firstChild && paragraphs[j].firstChild.tagName !== "A") {
                        testi.push(new Verso(paragraphs[j].innerText, result[i].slug));
                    }
                }
            }
            populateRighe(testi).then((result) => {
                writeDepose(result, contenuti);
                setInterval(function () {
                    writeDepose(result, contenuti);
                }, 60000);
            });
        });
    });
}

class Verso {
    constructor(text, slug) {
        this.text = text;
        this.slug = slug;
    }
}