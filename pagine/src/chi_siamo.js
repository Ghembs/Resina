const urlRedazione = "https://resina-wp.threefaces.org/wp-json/wp/v2/users";
const urlTags = "https://resina-wp.threefaces.org/wp-json/wp/v2/tags";
window.onload = function() {
    const redazione = document.getElementById("redazione");
    const autori = document.getElementById("autori");
    //canvas = document.getElementById('canvas');
    //context = canvas.getContext('2d');
    //canvas.width = w = window.innerWidth;
    //canvas.height = h = window.innerHeight;
    //context.fillStyle = '#000';
    //context.fillRect(0, 0, w, h);
    // let ftch = fetch(urlRedazione);
    // ftch.then(res => {
    //     let data = res.json();
    //     data.then((result) => {
    //         let i = 0;
    //         result.forEach((item) => {
    //             if (item.slug !== "admin") {
    //                 //drawName(item.slug, w / 2, h / 2 + i * 30);
    //                 const member = document.createElement("div");
    //                 const profilepic = document.createElement("img");
    //                 const desc = document.createElement("p");
    //                 const link = document.createElement("a");
    //                 member.style.fontSize = "1em";
    //                 desc.style.fontSize = ".5em";
    //                 desc.innerText = item.description;
    //                 profilepic.src = item.avatar_urls["96"];
    //                 member.appendChild(profilepic);
    //                 link.innerText = item.slug[0].toUpperCase() + item.slug.slice(1);
    //                 link.href = "autore.html?autore=" + item.slug;
    //                 member.appendChild(link);
    //                 member.appendChild(desc);
    //                 redazione.appendChild(member);
    //                 i++;
    //             }
    //         });
    let ftch = fetch(urlTags);
    ftch.then(res => {
        let data = res.json();
        data.then((result) => {
            result.forEach((item) => {
                if (item.name.includes("autore:")) {
                    const autore = document.createElement("p");
                    const link = document.createElement("a");
                    link.innerText = item.name.replace("autore:", "").replace("_", " ");
                    link.href = "autore.html?autore=" + item.slug.replace("autore", "");
                    autore.appendChild(link);
                    autori.appendChild(autore);
                }
            });
        });
    });
    //});
    //});
}

// function drawName (nome, x, y) {
//     context.beginPath();
//     context.fillStyle = '#fff';
//     context.font = "2em courier new monospace";
//     context.fillText(nome, x, y);
// }