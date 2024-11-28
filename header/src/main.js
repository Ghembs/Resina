let w, h;
let counter = 0;
let authors, categories = {};
let lastArticles = [];
let by, pubb;
const parser = new DOMParser();
let pic, text, url;

const localhost = "https://resina-wp.threefaces.org/wp-json/wp/v2"
const urlUsers = `${localhost}/users?_fields[]=name&id=`
const urlCategories = `${localhost}/categories?_fields[]=id&_fields[]=slug`;
const urlPosts = `${localhost}/posts?_fields[]=id&_fields[]=categories&_fields[]=title&
_fields[]=content&_fields[]=excerpt&_fields[]=author&categories=`

let colors = {
    "cordyceps": "#264c5c",
    "post-office": "#57265C",
    "tagli": "#3f5c26",
    "spore": "#b19c83",
    "webcore": "#9019b5",
    "on-off-art": "#b56719",
}

function init () {
    by = document.getElementById("by");
    pubb = document.getElementById("nuova_pubb");
    pic = document.getElementById("preview_pic");
    text = document.getElementById("preview_text");
    url = document.getElementById("preview_url");

    resizeReset();
    retrieveArticles().then((articles) => {
        setPreview(lastArticles[0]);
        const setArticle = setInterval(() =>{
            counter++;
            counter %= lastArticles.length;
            setPreview(lastArticles[counter]);
        }, 5000);
    });
}

const test = setInterval(()=>{
    text.style.filter = "opacity(0)";
    by.style.top = "-75%";
    pic.style.filter = "opacity(0)";
}, 5000);

//setTimeout(, 3000);

function retrieveArticles() {
    return new Promise((resolve, reject) => {
        let ftch = fetch(urlCategories);
        ftch.then(res => {
            let data = res.json();
            data.then((result) => {
                result.forEach((item) => {
                    if (item.id !== 1) {
                        categories[item.id] = item.slug;
                        ftch = fetch(urlPosts + item.id);
                        ftch.then(res => {
                            let data = res.json();
                            data.then((result) => {
                                if (result.length > 0) {
                                    ftch = fetch(urlUsers + result[0].author);
                                    ftch.then(res => {
                                        let data = res.json();
                                        data.then((answer) => {
                                            result[0].author = answer[0].name;
                                            lastArticles.push(result[0]);
                                            resolve(lastArticles);
                                        })
                                    })
                                }
                            })
                        })
                    }
                })
            })
        });
    })
}

function setPreview (article) {
    const rendered = parser.parseFromString(article.content.rendered, "text/html");
    const excerpt = parser.parseFromString(article.excerpt.rendered, "text/html");
    by.innerText = "BY " + article.author.toUpperCase();
    by.style.top = "0";
    pubb.style.backgroundColor = colors[categories[article.categories]]
    pic.style.backgroundImage ="url(" + rendered.getElementsByTagName("img")[0].src + ")";
    pic.style.filter = "opacity(1)";
    text.style.filter = "opacity(1)";
    text.innerText = excerpt.getElementsByTagName("p")[0].innerText;
    url.setAttribute("href", `https://resina.threefaces.org/rubriche/` +
        categories[article.categories] + "/page.html?article=" + article.id);
}

function resizeReset() {
    w = document.getElementsByTagName("header")[0].offsetWidth;
    h = document.getElementsByTagName("header")[0].offsetHeight;

    let by = document.getElementById("by");
    //by.style.width = h / 2 + "px";
}

document.addEventListener("DOMContentLoaded", init);