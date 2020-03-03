const { ipcRenderer } = require("electron");

// Async message handler
ipcRenderer.on("asynchronous-reply", (event, arg) => {
  console.log(arg);
});

// Async message sender
console.log("sending");
ipcRenderer.send("asynchronous-message", "async ping");
