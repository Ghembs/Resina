const tagliCanvas = document.getElementById('fontanaCanvas');
tagliCanvas.width = window.innerWidth;
tagliCanvas.height = window.innerHeight;
const tagliCtx = tagliCanvas.getContext('2d');

// Disegna lo sfondo
tagliCtx.fillStyle = "#fff"; // Beige, colore della tela
tagliCtx.fillRect(0, 0, tagliCanvas.width, tagliCanvas.height);

/**
 * Funzione per disegnare un taglio con spessore variabile
 * @param {number} x1 - Punto iniziale x
 * @param {number} y1 - Punto iniziale y
 * @param {number} x2 - Punto finale x
 * @param {number} y2 - Punto finale y
 * @param {number} maxThickness - Spessore massimo al centro
 */
function drawFontanaCut(x1, y1, x2, y2, maxThickness) {
    const gradient = tagliCtx.createLinearGradient(x1, y1, x2, y2);
    gradient.addColorStop(0, "rgba(30, 30, 30, 0.8)");
    gradient.addColorStop(0.25, "rgba(0, 0, 0, 0.8)");
    gradient.addColorStop(0.5, "rgba(0, 0, 0, 1)");
    gradient.addColorStop(0.75, "rgba(0, 0, 0, 0.8)");
    gradient.addColorStop(1, "rgba(30, 30, 30, 0.8)");

    // Calcola il vettore direzionale per il taglio
    const dx = x2 - x1;
    const dy = y2 - y1;

    // Calcola punti del percorso
    tagliCtx.beginPath();
    tagliCtx.moveTo(x1, y1);

    // Linea superiore del taglio
    tagliCtx.quadraticCurveTo(x1 + (dx/2) + maxThickness, y1 + (dy / 2) + maxThickness, x2, y2);
    // Linea inferiore del taglio
    tagliCtx.quadraticCurveTo(x2 - (dx/2) - maxThickness, y2 - (dy / 2) - maxThickness, x1, y1);
    tagliCtx.closePath();

    // Disegna il taglio
    tagliCtx.fillStyle = gradient;
    tagliCtx.fill();
}

function setCuts() {
    // Disegna un esempio di taglio
    tagliCtx.shadowColor = "rgba(0, 0, 0, 0.3)";
    tagliCtx.shadowBlur = 5;
    tagliCtx.shadowOffsetX = 3;
    tagliCtx.shadowOffsetY = 3;
    let cuts = [];
    for (let i = 0; i < getRandomInt(10, 30); i++) {
        const x1 = getRandomInt(0, tagliCanvas.width);
        const y1 = getRandomInt(0, tagliCanvas.height);
        const x2 = getRandomInt(x1-tagliCanvas.width * 0.30, x1+tagliCanvas.width * 0.30);
        const y2 = getRandomInt(y1-tagliCanvas.height * 0.30, y1+tagliCanvas.height * 0.30);
        const thickness = getRandomInt(5, 10);
        drawFontanaCut(x1, y1, x2, y2, thickness);
    }
    tagliCanvas.style.filter = "blur(1px)";
//drawIrregularCut(200, 800, 600, 800, 400, 780)
}

setCuts();