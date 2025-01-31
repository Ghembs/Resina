//const localhost = "https://resina-wp.threefaces.org/wp-json/wp/v2";
const urlCordy = `${localhost}/posts?categories=5`;
const queryString = new URLSearchParams(window.location.search);
const urlArticle = `${localhost}/posts?slug=` + queryString.get("article");

if(queryString.get("article")) {
    const ftch = fetch(urlArticle);
    ftch.then(res => {
        let data = res.json();
        data.then((result) => {
            const parser = new DOMParser();
            let content = parser.parseFromString(result[0].content.rendered, "text/html");
            let contenuti = document.getElementById("content");
            const title = document.createElement("h1");
            title.innerText = result[0].title.rendered;
            contenuti.appendChild(title);
            for (let i = 0; i < content.body.childNodes.length; i++) {
                contenuti.appendChild(content.body.childNodes[i]);
                if (contenuti.lastElementChild.getElementsByTagName("img").length){
                    let img = document.createElement("img");
                    img.src = contenuti.lastElementChild.getElementsByTagName("img")[0].src;
                    contenuti.removeChild(contenuti.lastElementChild);
                    contenuti.appendChild(img);
                }
            }
            //contenuti.innerHTML = content.innerHTML;
            contenuti.style.backgroundColor = "rgba(0, 0, 0, 0.5)"
            contenuti.style.color = "#B1CEFB"
        });
    });
} else {
    const ftch = fetch(urlCordy);
    ftch.then(res => {
        let data = res.json();
        data.then((result) => {
            const parser = new DOMParser();
            let contenuti = document.getElementById("content");
            for (let item of result) {
                let artCordy = document.createElement("div");
                artCordy.classList.add("artCordy");
                let articolo = document.createElement("p");
                let link = document.createElement("a");
                link.href = "?article=" + item.slug;
                let pic = document.createElement("img");
                const formatObj = new Intl.DateTimeFormat("it-IT");
                let data = document.createElement("span");
                data.innerHTML = formatObj.format(new Date(item.date)).replaceAll("/", ".") + " - ";
                data.style.color = "#11F7F3"
                let teschio = getRandomInt(0, 1);
                pic.src = "assets/teschio_fung" + teschio + ".png";
                pic.height = 32;
                articolo.appendChild(data)
                articolo.innerHTML += item.title.rendered;
                articolo.style.color = "#649CF7";
                artCordy.appendChild(pic);
                link.appendChild(articolo);
                artCordy.appendChild(link);
                contenuti.appendChild(artCordy);
            }
        });
    });
}