function createTaskbar() {
    let taskbar = document.createElement("div");
    taskbar.classList.add("taskbar");
    let startButton = document.createElement("div");
    startButton.setAttribute("class", "start-button");
    startButton.setAttribute("onClick", "location.href='../../index.html'");
    startButton.innerText = "start";
    let logo = document.createElement("img");
    logo.src = "../../resources/logo.svg";
    startButton.appendChild(logo);
    taskbar.appendChild(startButton);

    let time = document.createElement("div");
    time.setAttribute("class", "time");
    time.innerHTML = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: 'numeric', hour12:
            true }).format(new Date())
    time.setAttribute("title", new Intl.DateTimeFormat('en-IN', { hour: 'numeric',
        minute: 'numeric', hour12: true, year: 'numeric', month: 'long', day: 'numeric' }).format(new Date()))
    taskbar.appendChild(time);

    document.getElementsByTagName("footer")[0].appendChild(taskbar);
}

const timeSetter = setInterval(() => {
    let time = document.querySelector(".time")
    time.innerHTML = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: 'numeric',
        hour12: true}).format(new Date())
    time.setAttribute("title", new Intl.DateTimeFormat('en-IN', { hour: 'numeric',
        minute: 'numeric', hour12: true, year: 'numeric', month: 'long', day: 'numeric' }).format(new Date()))
}, 60000);

window.addEventListener("DOMContentLoaded", createTaskbar);
