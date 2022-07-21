const socket = io();

const sizeDiv = document.getElementById("size-display");
const app = document.getElementById('app');

var typewriter = new Typewriter(app, {
    loop: false,
    delay: 75,
    autoStart: true,
    cursor: '█',
    strings: ['Database Size']
});

socket.on("dbSize", function (data) {
    console.log("Rendering dbSize : ", data.size);

    sizeDiv.innerHTML = data.size;

    // const newspan = document.createElement('span');
    // newspan.innerHTML = JSON.stringify(data.text)
    // app.innerHTML = ""
    // app.appendChild(newspan);
    // newspan.scrollIntoView();
    // socket.emit("my other event", { my: "data" });
});

socket.on("datathing", function (data) {
    const newspan = document.createElement('span');
    newspan.innerHTML = JSON.stringify(data.data)
    if (JSON.stringify(app.innerHTML).length > 50000) {
        app.innerHTML = JSON.stringify(app.innerHTML).slice(0, 100)
    }
    app.appendChild(newspan);
    newspan.scrollIntoView();

    // socket.emit("my other event", { my: "data" });
});

