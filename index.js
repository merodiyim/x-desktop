const { app, BrowserWindow, shell } = require("electron");
const path = require("path");

app.commandLine.appendSwitch("high-dpi-support", "1");
app.commandLine.appendSwitch("force-device-scale-factor", "1");

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,

        title: "X Electron App",
        icon: path.join(__dirname, "assets/twitter.png"),

                                   autoHideMenuBar: true,
                                   titleBarStyle: "hiddenInset",

                                   webPreferences: {
                                       preload: path.join(__dirname, "preload.js"),
                                   contextIsolation: true,
                                   nodeIntegration: false,
                                   backgroundThrottling: false,
                                   zoomFactor: 1.0
                                   }
    });

    mainWindow.loadURL("https://x.com");

    mainWindow.webContents.setVisualZoomLevelLimits(1, 1);

    mainWindow.webContents.on("zoom-changed", () => {
        mainWindow.webContents.setZoomFactor(1);
    });

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: "deny" };
    });

    mainWindow.webContents.on("will-navigate", (e, url) => {
        if (!url.startsWith("https://x.com")) {
            e.preventDefault();
            shell.openExternal(url);
        }
    });
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
