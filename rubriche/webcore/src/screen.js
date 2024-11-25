// let time = document.querySelector(".time")
// time.innerHTML = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date())
// time.setAttribute("title", new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: 'numeric', hour12: true, year: 'numeric', month: 'long', day: 'numeric' }).format(new Date()))
//
// let timeSetter = setInterval(() => {
//     time.innerHTML = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: 'numeric', hour12: true }).format(new Date())
//     time.setAttribute("title", new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: 'numeric', hour12: true, year: 'numeric', month: 'long', day: 'numeric' }).format(new Date()))
// }, 60000);

function init () {
    const localhost = "https://resina-wp.threefaces.org/wp-json/wp/v2";
    const url = `${localhost}/posts?categories=4`;
    const ftch = fetch(url);
    ftch.then(res => {
        let data = res.json();
        data.then((result) => {
            const parser = new DOMParser();
            let articoli = document.getElementById("articoli");

            for (let i = 0; i < result.length; i++) {
                const page = parser.parseFromString(result[i].content.rendered, "text/html");
                let articolo = document.createElement("div");
                let icona = document.createElement("img");
                let didascalia = document.createElement("p");
                icona.src = page.getElementsByTagName("img")[0].src;
                didascalia.innerText = page.getElementsByTagName("h1")[0].innerText;
                didascalia.style.margin = "0";
                didascalia.style.color = "white";

                if (isMobile()) {
                    didascalia.style.fontSize = "24px";
                    //didascalia.style.webkitTextStroke = "1px black";
                    articolo.style.width = "150px";
                    articolo.style.paddingTop = "10px";
                    //articolo.style.margin = "20px";
                    icona.width = 128;
                    icona.height = 128;
                } else {
                    didascalia.style.fontSize = "14px";
                    //didascalia.style.webkitTextStroke = "1px black";
                    articolo.style.width = "100px";
                    articolo.style.margin = "10px";
                    //articolo.style.margin = "20px";
                    icona.width = 64;
                    icona.height = 64;
                }

                articolo.style.textAlign = "center";
                articolo.appendChild(icona);
                articolo.appendChild(didascalia);
                articoli.appendChild(articolo);
                articolo.addEventListener('dblclick', () => {
                    window.location.href = "page.html?article=" + result[i].slug;
                });
            }
        })
    })
}

function isMobile() {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
}

window.addEventListener('DOMContentLoaded', init);