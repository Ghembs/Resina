let positions = [
    {top: 5, left: 50},
    {top: 25, left: 25},
    {top: 25, left: 75},
    {top: 65, left: 25},
    {top: 65, left: 75},
    {top: 80, left: 50}
];
const rubriche = ["cordyceps", "tagli", "spore", "post-office", "webcore", "mistery"];
let sheet = null;
function getRandomInt(min, max) {
    return Math.round(Math.random() * (max - min)) + min;
}

function init() {
    /*let webcore = document.getElementById("webcore");
    webcore.style.position = "absolute";
    webcore.style.top = "50%";
    webcore.style.left = "50%";
    webcore.style.color = "white";*/
    for (let i = 0; i < rubriche.length; i++) {
        createAnimation(rubriche[i]);
    }
}

function createAnimation (name) {
    if (!sheet) {
        sheet = document.createElement('style');
        sheet.setAttribute('type', 'text/css');
        document.head.appendChild(sheet);
    }

    const rubrica = document.getElementById(name);
    const position = positions.splice(getRandomInt(0, positions.length - 1), 1)[0];
    rubrica.style.top = position.top + '%';
    rubrica.style.left = position.left + '%';
    rubrica.style.translate = '-50% 0';
}

window.addEventListener("DOMContentLoaded", init);