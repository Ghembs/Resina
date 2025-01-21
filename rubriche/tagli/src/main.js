const queryString = new URLSearchParams(window.location.search);
const urlArticle = `${localhost}/posts?slug=` + queryString.get("article");

function getRandomInt(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

function getRndNumber(min, max) {
    return Math.random() * (max - min) + min;
}

function createFilter(id, smooth=false) {
    const definizioni = document.getElementById("definitions");
    const filter = document.getElementById("filter");
    const newFilter = filter.cloneNode(true);
    let turbulence = newFilter.getElementsByTagName("feTurbulence")[0];
    let displa = newFilter.getElementsByTagName("feDisplacementMap")[0];

    newFilter.setAttributeNS(null, 'id', smooth ? 'filter' + id + "_smooth" : 'filter' + id);
    definizioni.appendChild(newFilter);

    const seconds = Math.round(new Date().getTime() / 10000000);
    const seed = seconds + Math.floor(Math.random() * 100000);
    const octaves = smooth? getRandomInt(3, 5) : getRandomInt(4, 10);
    const scale = smooth? getRandomInt(20, 40) : getRandomInt(30, 50);
    const freq = smooth? getRandomInt(0.01, 0.001).toFixed(4) : getRndNumber(0.06, 0.01).toFixed(4);
    //console.log(`octaves:${octaves} - scale:${scale} - frequency:${freq}`);
    turbulence.setAttributeNS(null, "seed", seed.toString());
    turbulence.setAttributeNS(null, "numOctaves", octaves.toString());
    turbulence.setAttributeNS(null, "baseFrequency", freq.toString());
    turbulence.setAttributeNS(null, 'id', smooth ? 'turbu' + id + "_smooth" : 'turbu' + id);
    displa.setAttributeNS(null, "scale", scale.toString());
    displa.setAttributeNS(null, 'id', smooth? 'displa' + id + "_smooth" : 'displa' + id);

    return newFilter;
}

function capitalizeLetters (string) {
    let words = string.split(" ");
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join(" ");
}

window.onload = function(){
    let content = document.getElementById("content");
    const urlTagli = `${localhost}/posts?categories=9`;
    let src = "";
    let autore = "";
    let parser = new DOMParser();

    if(queryString.get("article")) {
        const ftch = fetch(urlArticle);
        ftch.then(res => {
            let data = res.json();
            data.then((result) => {
                let item = result[0];
                let img;
                const info = document.createElement("div");
                const autoTitolo = document.createElement("div");
                const distorco = document.createElement("div");
                let test = document.createElement("div");
                let testino = document.createElement("div");
                let scotchPic = document.createElement("div");
                let riquadro = document.createElement("a");
                let rendered = parser.parseFromString(item.content.rendered, "text/html");
                let testo = document.createElement("div");
                const titolo = item.title.rendered;
                img = document.createElement("img");
                autore = item.class_list[item.class_list.findIndex(element => element.includes("autore"))];
                if (autore !== undefined) {
                    autore = autore.replace("tag-autore", "").replace("_", " ")
                    autore = capitalizeLetters(autore)
                }

                while (rendered.body.hasChildNodes()) {
                    let child = rendered.body.removeChild(rendered.body.firstChild);
                    if (child.innerHTML !== undefined) {
                        if (child.getElementsByTagName("img").length > 0) {
                            src = child.firstChild.src;
                        } else {
                            if (child.innerHTML.indexOf("Autore: ") >= 0) {
                                autore = child.innerText.replace("Autore: ", "");
                            } else {
                                child.style.paddingLeft = "2.2em";
                                child.style.marginTop = "1.2em";
                                testo.appendChild(child);
                            }
                        }
                    }
                }

                //let filter = createFilter(0);
                let filterSmooth = createFilter(0, true);

                distorco.style.backgroundColor = "white";
                distorco.classList.add("under_scotch", "distorted_paper");
                //distorco.style.filter = "url(#" + filterSmooth.id + ")";
                info.style.width = "100%";
                autoTitolo.style.width = "98%";
                img.src = src // https://d1jyxxz9imt9yb.cloudfront.net/animal/283/meta_image/regular/panda_1.jpg

                img.classList.add("under_scotch");
                img.style.filter = "url(#" + filterSmooth.id + ") grayscale(1)";

                autoTitolo.innerHTML = testo.innerHTML // "<p style='padding-left: 2.2em'>" + testo + "</p>";
                autoTitolo.classList.add("titolo");
                info.classList.add("info", "img-tape", "img-tape--1");
                riquadro.classList.add("riquadro_vert");
                scotchPic.classList.add("img-tape", "img-tape--" + getRandomInt(1, 4));
                img.style.width = "100%"
                scotchPic.style.width = "100%"
                //riquadro.style.width = "90%"

                test.classList.add("img-tape", "img-tape--1", "autoTitolo");
                testino.style.backgroundColor = "white";
                testino.style.filter = "url(#" + filterSmooth.id + ")";
                testino.classList.add("titolo", "under_scotch");
                testino.innerHTML = "<p class='distorted_paper' style='padding-left: 2.2em'>Autore: " + autore + "<br>Titolo: " + titolo + "</p>";
                distorco.appendChild(autoTitolo);
                scotchPic.appendChild(img);
                riquadro.appendChild(scotchPic);
                info.appendChild(distorco);
                riquadro.appendChild(info);
                content.appendChild(riquadro);
                test.appendChild(testino);
                scotchPic.appendChild(test);
            });
        });
    }
    else {
        const ftch = fetch(urlTagli);
        ftch.then(res => {
            let data = res.json();
            data.then((result) => {
                for (let i = 0; i < result.length; i++) {
                    let img;
                    const info = document.createElement("div");
                    const autoTitolo = document.createElement("div");
                    const distorco = document.createElement("div");
                    let test = document.createElement("div");
                    let testino = document.createElement("div");
                    let scotchPic = document.createElement("div");
                    let riquadro = document.createElement("a");
                    let item = result[i];
                    let rendered = parser.parseFromString(item.content.rendered, "text/html");
                    let excerpt = parser.parseFromString(item.excerpt.rendered, "text/html");
                    const titolo = item.title.rendered;
                    const estratto = excerpt.body.getElementsByTagName("p")[0].innerHTML;
                    img = document.createElement("div");
                    autore = result[i].class_list[result[i].class_list.findIndex(element => element.includes("autore"))];
                    if (autore !== undefined) {
                        autore = autore.replace("tag-autore", "").replace("_", " ")
                        autore = capitalizeLetters(autore)
                    }

                    for (let j = 0; j < rendered.body.children.length; j++) {
                        if (rendered.body.children[j].innerHTML.indexOf("Autore: ") >= 0) {
                            autore = rendered.body.children[j].innerText.replace("Autore: ", "");
                        }
                        if (rendered.body.children[j].getElementsByTagName("img").length > 0) {
                            src = rendered.body.children[j].firstChild.src;
                        }
                    }

                    let filter = createFilter(i);
                    let filterSmooth = createFilter(i, true);

                    distorco.style.backgroundColor = "white";
                    distorco.classList.add("under_scotch", "full_coverage", "distorted_paper");
                    distorco.style.filter = "url(#" + filterSmooth.id + ")";
                    img.style.backgroundImage = "url('" + src + "')" // https://d1jyxxz9imt9yb.cloudfront.net/animal/283/meta_image/regular/panda_1.jpg
                    img.style.backgroundRepeat = "no-repeat";
                    img.style.backgroundSize = "cover";
                    img.style.backgroundPosition = "center";
                    img.classList.add("under_scotch", "full_coverage");
                    img.style.filter = "url(#" + filter.id + ") grayscale(1)";

                    autoTitolo.innerHTML = "<p style='padding-left: 2.2em'>" + estratto + "</p>";
                    autoTitolo.classList.add("titolo");
                    info.classList.add("info", "img-tape", "img-tape--1");
                    riquadro.classList.add("riquadro");
                    riquadro.href = "?article=" + item.slug;
                    scotchPic.style.width = "65%";
                    scotchPic.classList.add("img-tape", "img-tape--" + getRandomInt(1, 4));

                    test.style.position = "absolute";
                    test.style.right = "5%";
                    test.style.top = "5%";
                    test.style.width = "25%";
                    test.style.minWidth = "10em";
                    test.style.height = "10%";
                    test.style.minHeight = "3em";
                    test.classList.add("img-tape", "img-tape--1");
                    testino.style.backgroundColor = "white";
                    testino.style.filter = "url(#" + filterSmooth.id + ")";
                    testino.classList.add("titolo", "under_scotch", "full_coverage");
                    testino.innerHTML = "<p class='distorted_paper' style='padding-left: 2.2em'>Autore: " + autore + "<br>Titolo: " + titolo + "</p>";
                    distorco.appendChild(autoTitolo);
                    scotchPic.appendChild(img);
                    riquadro.appendChild(scotchPic);
                    info.appendChild(distorco);
                    riquadro.appendChild(info);
                    content.appendChild(riquadro);
                    test.appendChild(testino);
                    img.appendChild(test);
                }
            });
        });
    }
}

// function resize(){
//     console.log("resized");
//     riquadro.style.height = window.innerHeight + "px";
//     img.height = window.innerHeight;
//     scotchPic.style.width = "90%";
//     scotchPic.style.height = "100%";
