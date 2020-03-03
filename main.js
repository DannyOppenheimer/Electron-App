const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow } = electron;

var mainWindow;

// Listen for app ready
app.on("ready", () => {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 450,
    useContentSize: true,
    center: true,
    resizable: false,
    icon: path.join(__dirname, "icon.ico")
  });
  mainWindow.removeMenu();
  mainWindow.loadURL(
    url.format({
      pathname: path.join(__dirname, "GamePage/main_window.html"),
      protocol: "file:",
      slashes: true
    })
  );
  // mainWindow.openDevTools();

  // Maintian 16:9 aspect ratio
  let oldSize = 0;
  mainWindow.on("resize", () => {
    let size = mainWindow.getSize();
    let widthChanged = oldSize[0] != size[0];
    var ratioY2X = 9 / 16;
    if (widthChanged) {
      mainWindow.setSize(size[0], parseInt((size[0] * ratioY2X).toString()));
    } else {
      mainWindow.setSize(parseInt((size[1] / ratioY2X).toString()), size[1]);
    }
  });

  mainWindow.on("maximize", () => {
    mainWindow.setFullScreen(true);
  });
});
