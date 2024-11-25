function createTaskbar() {
    let taskbar = document.createElement("div");
    taskbar.classList.add("taskbar");
    let startButton = document.createElement("div");
    startButton.setAttribute("class", "start-button");
    startButton.setAttribute("onClick", "location.href='../../index.html'");
    startButton.innerText = "start";
    let logo = document.createElement("img");
    logo.src = "assets/logo.png";
    startButton.appendChild(logo);
    taskbar.appendChild(startButton);

    let time = document.createElement("div");
    time.setAttribute("class", "time");

    if (true) {
        taskbar.style.height = "100px";
        startButton.style.width = "180px";
        startButton.style.display = "flex";
        startButton.style.flexDirection = "row";
        startButton.style.alignItems = "center";
        startButton.style.fontSize = "48px";
        logo.style.width = "48px";
        logo.style.height = "48px";
        time.style.width = "120px";
        time.style.fontSize = "24px";
        time.style.display = "flex";
        time.style.flexDirection = "row";
        time.style.alignItems = "center";
    } else {
    }
    time.innerHTML = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: 'numeric', hour12:
            true }).format(new Date())
    time.setAttribute("title", new Intl.DateTimeFormat('en-IN', { hour: 'numeric',
        minute: 'numeric', hour12: true, year: 'numeric', month: 'long', day: 'numeric' }).format(new Date()))
    taskbar.appendChild(time);

    document.getElementsByTagName("footer")[0].appendChild(taskbar);
}

function isMobile() {
    const regex = /Mobi|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    return regex.test(navigator.userAgent);
}

const timeSetter = setInterval(() => {
    let time = document.querySelector(".time")
    time.innerHTML = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: 'numeric',
        hour12: true}).format(new Date())
    time.setAttribute("title", new Intl.DateTimeFormat('en-IN', { hour: 'numeric',
        minute: 'numeric', hour12: true, year: 'numeric', month: 'long', day: 'numeric' }).format(new Date()))
}, 60000);

window.addEventListener("DOMContentLoaded", createTaskbar);
