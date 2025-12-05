const urlArticle = `${localhost}/posts?slug=`;
const queryString = new URLSearchParams(window.location.search);
const urlPost = `${localhost}/posts?categories=6`;

function init (messaggio= false, slug="") {
    const parser = new DOMParser();
    const formatObj = new Intl.DateTimeFormat("it-IT", {
        dateStyle: 'long',
        timeStyle: 'medium',
        timeZone: 'Europe/Rome',
    });

    if(messaggio=== true || queryString.get("article")) { // === true JAVASCRIPT BAD
        if (queryString.get("article")) slug = queryString.get("article");
        queryString.delete("article");
        const ftch = fetch(urlArticle + slug);
        ftch.then(res => {
            let data = res.json();
            data.then((result) => {
                let articolo = result[0];
                let finestra = document.getElementsByClassName("articolo")[0];
                finestra.style.display = "block";
                let corpo = document.createElement("div");
                corpo.classList.add("corpo_email", "window-body");
                let mittente = document.createElement("p");
                let destinatario = document.createElement("p");
                let cc = document.createElement("p");
                let oggetto = document.createElement("p");
                let inviato = document.createElement("p");
                const testo = document.createElement("div");
                const controllo = document.createElement("div");
                controllo.classList.add("title-bar-controls", "chiudi_finestra");
                testo.classList.add("testo");
                let bottone = document.createElement("button");

                let autore = articolo.class_list[articolo.class_list.findIndex(element => element.includes("autore"))];
                if (autore !== undefined) {
                    autore = autore.replace("tag-autore", "").replace("_", " ")
                    mittente.innerText = capitalizeLetters(autore)
                }

                bottone.ariaLabel = "Close";
                bottone.onclick = () => {
                    finestra.innerHTML = null;
                    init(false);
                }
                let rendered = parser.parseFromString(result[0].content.rendered, "text/html");
                while (rendered.body.hasChildNodes()) {
                    let child = rendered.body.removeChild(rendered.body.firstChild);
                    if (child.innerHTML !== undefined) {
                        if (child.getElementsByTagName("img").length > 0) {
                            console.log(child);
                            const figure = document.createElement("figure");
                            const pic = document.createElement("img");
                            figure.classList.add("pic");
                            pic.src = child.firstChild.src;
                            figure.appendChild(pic);
                            if (child.getElementsByTagName("figcaption").length > 0) {
                                const caption = document.createElement("figcaption");
                                caption.innerHTML = child.getElementsByTagName("figcaption")[0].innerHTML;
                                figure.appendChild(caption);
                            }
                            testo.appendChild(figure);
                        } else {
                            if (child.innerHTML.indexOf("Mittente: ") >= 0) {
                                mittente.innerText = child.innerText;
                            } else if (child.innerHTML.indexOf("Destinatario: ") >= 0) {
                                destinatario.innerText = child.innerText;
                            } else if (child.innerHTML.indexOf("CC: ") >= 0) {
                                cc.innerText = child.innerText;
                            }
                            else {
                                child.style.marginLeft = "15px";
                                testo.appendChild(child);
                            }
                        }
                    }
                }
                oggetto.innerText = "Oggetto: " + result[0].title.rendered;
                inviato.innerHTML = "Inviato: " + formatObj.format(new Date(result[0].date));
                controllo.appendChild(bottone);
                corpo.appendChild(controllo);
                corpo.appendChild(mittente);
                corpo.appendChild(destinatario);
                corpo.appendChild(cc);
                corpo.appendChild(oggetto);
                corpo.appendChild(inviato);
                corpo.appendChild(testo);
                finestra.appendChild(corpo);
                let contenuto = document.getElementById("content");
                contenuto.style.display = "none";
                let padre = contenuto.parentNode;
                padre.appendChild(finestra);
            });
        });
    } else {
        const ftch = fetch(urlPost);
        ftch.then(res => {
            let data = res.json();
            data.then((result) => {
                let finestra = document.getElementsByClassName("articolo")[0];
                finestra.style.display = "none";
                let content = document.getElementById("content");
                content.style.display = "block";
                let barra = content.removeChild(document.getElementById("barra_messaggi"));
                content.innerHTML = "";
                content.appendChild(barra);
                for (let i = 0; i < result.length; i++) {
                    let mittente = document.createElement("div");
                    let autore = result[i].class_list[result[i].class_list.findIndex(element => element.includes("autore"))];
                    if (autore !== undefined) {
                        autore = autore.replace("tag-autore", "").replace("_", " ")
                        mittente.innerText = capitalizeLetters(autore)
                    }
                    let rendered = parser.parseFromString(result[i].content.rendered, "text/html");
                    for (let j = 0; j < rendered.getElementsByTagName("p").length; j++) {
                        let temp = rendered.getElementsByTagName("p")[j];
                        if (temp.innerText.indexOf("Mittente: ") >= 0) {
                            mittente.innerText = temp.innerText.replace("Mittente: ", "");
                        }
                    }
                    let articolo = result[i];
                    let messaggio = document.createElement("div");
                    messaggio.classList.add("messaggio");
                    let mail = document.createElement("div");
                    mail.classList.add("mail");
                    let letterina = document.createElement("img");
                    letterina.style.marginLeft = "9px";
                    letterina.src = "assets/envelope_closed-1.png";
                    mail.appendChild(letterina);
                    messaggio.appendChild(mail);
                    mittente.classList.add("campo_mail");
                    messaggio.appendChild(mittente);
                    let oggetto = document.createElement("div");
                    oggetto.classList.add("campo_mail");
                    oggetto.innerText = result[i].title.rendered;
                    messaggio.appendChild(oggetto);
                    let data = document.createElement("div");
                    data.classList.add("campo_mail");
                    data.innerHTML = formatObj.format(new Date(result[i].date));
                    messaggio.appendChild(data);
                    let estratto = document.createElement("div");
                    estratto.classList.add("campo_mail", "estratto");
                    estratto.innerHTML = result[i].excerpt.rendered;
                    messaggio.appendChild(estratto);
                    messaggio.dataset.slug = result[i].slug;
                    content.appendChild(messaggio)
                }
            });
        });
    }
}

function highlight_message(e) {
    let messaggi = document.getElementsByClassName("messaggio");
    for (let i = 0; i < messaggi.length; i++) {
        let messaggio = messaggi[i];
        let rect = messaggio.getBoundingClientRect();
        if (rect.x <= e.x && e.x <= rect.x + messaggio.clientWidth && rect.y <= e.y && e.y <= rect.y + messaggio.clientHeight) {
            messaggio.style.height = "10%";
            messaggio.style.backgroundColor = "#57265C";
            messaggio.style.border = "1px dotted white";
            messaggio.style.color = "white";
            messaggio.getElementsByClassName("estratto")[0].style.display = "flex";
            const pic = messaggio.getElementsByTagName("img")[0];
            pic.src = "assets/message_envelope_open-1.png"
            messaggio.onclick = (() => {
                init(true, messaggio.dataset.slug);
            });
        } else {
            messaggio.style.height = "fit-content";
            messaggio.style.backgroundColor = "white";
            messaggio.style.border = "none";
            messaggio.style.color = "black";
            messaggio.getElementsByClassName("estratto")[0].style.display = "none";
            const pic = messaggio.getElementsByTagName("img")[0];
            pic.src = "assets/envelope_closed-1.png"
            messaggio.onclick = (() => {
            });
        }
    }
}

document.addEventListener('DOMContentLoaded', init);
document.addEventListener('click', highlight_message);
//style="display: flex; flex-direction: row; align-content: center; margin: 0 4px 0 4px; border: 1px dotted white; background-color: #57265C; color: white; height: 10%; font-weight: bold; padding-top: 2px;"