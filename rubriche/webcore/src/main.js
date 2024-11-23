let width, height, message, message_alt;
function init() {
    //message = document.getElementById("error-message");
    message_alt = document.getElementById("error-message-alt");
    resizeReset();
}

function resizeReset() {
    width = window.innerWidth;
    height = window.innerHeight;
    // message.style.position = "absolute";
    // const messageWidth = message.width;
    // const messageHeight = message.height;
    // message.style.top = (height - messageHeight) / 2 + "px";
    // message.style.left = (width - messageWidth) / 2 + "px";


    message_alt.style.position = "absolute";
    const message_altWidth = message_alt.offsetWidth;
    const message_altHeight = message_alt.offsetHeight;
    message_alt.style.top = (height - message_altHeight) / 2 + "px";
    message_alt.style.left = (width- message_altWidth) / 2 + "px";

    console.log(message_alt);
}

window.addEventListener("DOMContentLoaded", init);
window.addEventListener("resize", resizeReset);