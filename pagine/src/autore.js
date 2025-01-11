const queryString = new URLSearchParams(window.location.search);
const urlRedazione = "https://resina-wp.threefaces.org/wp-json/wp/v2/users";
const urlTags = "https://resina-wp.threefaces.org/wp-json/wp/v2/tags";
const urlArticles = `${localhost}/posts`;
const noArticles = "Sembra che tu stia cercando qualcosa che non è stato ancora generato, ti consigliamo " +
    "di cambiare tempolinea."
const noAuthor = "Sembra che tu stia cercando una persona che non è ancora parte dello stormo, ti preghiamo " +
    "di soppesare il suo cuore con una piuma e farcene dono."
let content = document.getElementById("content");
let opere = document.getElementById("opere");

function capitalizeLetters (string) {
    let words = string.split(" ");
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    return words.join(" ");
}

function populateOpere(result){
    result.forEach((res) => {
        const cat = res.class_list[res.class_list.findIndex(element => element.includes("category"))];
        if (!cat.includes("uncategorized")) {
            const url = "https://resina.threefaces.org/rubriche/" + cat.replace("category-", "") +
                "/page.html?article=" + res.slug;
            const article = document.createElement("p");
            const link = document.createElement("a");
            link.innerText = res.title.rendered;
            link.href = url;
            article.appendChild(link);
            opere.appendChild(article);
        } else if (res.class_list[res.class_list.findIndex(element => element.includes("tag-depose"))]) {
            if (!document.getElementById("depose")) {
                const article = document.createElement("p");
                const depose = document.createElement("a");
                depose.innerText = "DEPOSE";
                depose.id = "depose";
                depose.href = "https://resina.threefaces.org/rubriche/spore/depose.html";
                article.appendChild(depose);
                opere.appendChild(article);
            }
        }
    });
}

function createPage(result, author, url) {
    const item = result[0];
    const autore = document.getElementById("autore");
    const id = item.id;
    author === "Admin" ? autore.innerText = "R3sina" : autore.innerText = author;
    let ftch = fetch(urlArticles + url + id);
    ftch.then(res => {
        let data = res.json();
        data.then(result => {
            if (result.length) {
                populateOpere(result);
            } else {
                const empty = document.createElement("p");
                empty.innerText = noArticles;
                opere.appendChild(empty);
            }
        });
    });
}

window.onload = function() {
    if(queryString.get("autore")) {
        queryString.get("autore") === "admin"? document.title = "R3sina" : document.title = queryString.get("autore");
        let ftch = fetch(urlRedazione + "?slug=" + queryString.get("autore"));
        ftch.then(res => {
            let data = res.json();
            data.then(result => {
                if (result.length) {
                    createPage(result, capitalizeLetters(queryString.get("autore")), "?author=");
                } else {
                    console.log("not a family member");
                    ftch = fetch(urlTags + "?slug=autore" + queryString.get("autore"));
                    ftch.then(res => {
                        let data = res.json();
                        data.then(result => {
                            if (result.length) {
                                createPage(result, capitalizeLetters(queryString.get("autore").replace("_", " ")),
                                    "?tags=")
                            } else {
                                const empty = document.createElement("p");
                                empty.innerText = noAuthor;
                                opere.appendChild(empty);
                            }
                        });
                    });
                }
            });
        });
    } else {
        window.location.href = "chi_siamo.html";
    }
}
