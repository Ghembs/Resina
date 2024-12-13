let canvas,
    /* The getContext() method returns an object
    that provides methods and properties for
    drawing on the canvas. */
    ctx;
let toggle, timer;

function init () {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    toggle = false;
    timer = 5000;

    resize();
    loop();
}

/* Setting canvas width and height equal to
window screen width and height. */
function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

document.addEventListener('DOMContentLoaded', init);
window.onresize = resize;

// Function to generate noise effect
function generate_noise(ctx) {
    let w = ctx.canvas.width,
        h = ctx.canvas.height,

        /* This creates a new ImageData object
        with the specified dimensions(i.e canvas
        width and height). All pixels are set to
        transparent black (i.e rgba(0,0,0,0)). */
        idata = ctx.createImageData(w, h),

        // Creating Uint32Array typed array
        buffer32 = new Uint32Array(idata.data.buffer),
        buffer_len = buffer32.length,
        i = 0

    for ( ; i < buffer_len; i++)
        buffer32[i] =
            ((255 * Math.random()) | 0) << 24;

    /* The putImageData() method puts the image
    data (from a specified ImageData object)
    back onto the canvas. */
    ctx.putImageData(idata, 0, 0);
}

setInterval(() => {
    toggle = true;
}, 10500);

setInterval(() => {
    toggle = false;
}, 2000);

// Creating animation effect
function loop() {
    if (toggle)
    {
        resize();
        canvas.style.opacity = "0.4";
        generate_noise(ctx);
        requestAnimationFrame(loop);
    } else {
        canvas.style.opacity = "0.2";
        canvas.width = 0;
        canvas.height = 0;
        requestAnimationFrame(loop);
    }
}