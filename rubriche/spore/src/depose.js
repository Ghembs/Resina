let righe, poesie;
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

function displayPoetry (title) {
    const poesia = document.createElement("div");
    let already = document.getElementsByClassName("poesia")[0];
    if (already) {
        already.parentNode.removeChild(already);
    }
    poesia.classList.add("poesia");
    poesia.onclick = () => {
        poesia.parentNode.removeChild(poesia);
    }
    const titolo = document.createElement("h2");
    titolo.innerText = title;
    poesia.appendChild(titolo);
    poesie[title].testo.forEach(verso => {
        const paragrafo = document.createElement("p");
        paragrafo.innerText = verso;
        poesia.appendChild(paragrafo);
    })
    const autore = document.createElement("a");
    autore.href = poesie[title].url;
    autore.innerText = poesie[title].autore;
    autore.style.position = "absolute";
    autore.style.right = "10px";
    autore.style.fontSize = "2em";
    autore.style.color = "darkgray";
    poesia.appendChild(autore);
    document.body.appendChild(poesia);
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
        let extract =temp.splice(getRndInteger(0, temp.length - 1), 1)[0];
        row.style.fontSize = getRndInteger(1, 5) + "vw";
        row.innerHTML = extract.text;
        row.style.marginLeft = getRndInteger(0, contenuti.offsetWidth - displayTextWidth(extract.text, "") -100) + "px";
        row.style.textAlign = "left";
        row.onclick = (() => {
            displayPoetry(extract.titolo);
        });

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

function capitalizeLetters (string) {
    let words = string.split(" ");
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join(" ");
}

window.onload = function () {
    const urlDepose = `${localhost}/posts?tags=12`;
    const ftch = fetch(urlDepose);
    let contenuti = document.getElementsByClassName("contenuti")[0];
    righe = [];
    poesie = {};

    ftch.then(res => {
        let data = res.json();
        data.then((result) => {
            const parser = new DOMParser();
            let testi = [];
            for (let i = 0; i < result.length; i++) {
                let content = parser.parseFromString(result[i].content.rendered, 'text/html');
                let autore = result[i].class_list[result[i].class_list.findIndex(element => element.includes("autore"))].replace("tag-autore", "").replace("_", " ");
                poesie[result[i].title.rendered] = {"autore": capitalizeLetters(autore), "testo": []};
                const paragraphs = content.getElementsByTagName("p");
                for (let j = 0; j < paragraphs.length; j++) {
                    if (paragraphs[j].firstChild && paragraphs[j].firstChild.tagName !== "A") {
                        poesie[result[i].title.rendered].testo.push(paragraphs[j].innerText);
                        testi.push(new Verso(paragraphs[j].innerText, result[i].title.rendered));
                    }
                }
                poesie[result[i].title.rendered].url = content.getElementsByTagName("a")[0].href;
            }
            //populateRighe(testi).then((result) => {
                writeDepose(testi, contenuti);
                setInterval(function () {
                    writeDepose(testi, contenuti);
                }, 60000);
            //});
        });
    });
}

class Verso {
    constructor(text, titolo) {
        this.text = text;
        this.titolo = titolo;
    }
}