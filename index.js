const { app, BrowserWindow, shell, Menu } = require("electron");
const path = require("path");

const TARGET_URL = "https://x.com";

app.commandLine.appendSwitch("high-dpi-support", "1");
app.commandLine.appendSwitch("force-device-scale-factor", "1");

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        title: "Y Desktop Version 2.1.1",
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

    mainWindow.loadURL(TARGET_URL);

    mainWindow.webContents.setVisualZoomLevelLimits(1, 1);

    mainWindow.webContents.on("zoom-changed", () => {
        mainWindow.webContents.setZoomFactor(1);
    });

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: "deny" };
    });

    mainWindow.webContents.on("will-navigate", (event, url) => {
        if (!url.startsWith(TARGET_URL)) {
            event.preventDefault();
            shell.openExternal(url);
        }
    });

    mainWindow.webContents.on("context-menu", (event, params) => {
        const menuTemplate = [];

        if (params.mediaType === "image") {
            menuTemplate.push({
                label: "Save Image as",
                click: () => {
                    mainWindow.webContents.downloadURL(params.srcURL);
                }
            });
        }

        if (params.selectionText) {
            menuTemplate.push({
                label: "Copy",
                role: "copy"
            });
        }

        if (menuTemplate.length > 0) {
            const menu = Menu.buildFromTemplate(menuTemplate);
            menu.popup({ window: mainWindow });
        }
    });

    mainWindow.on("closed", () => {
        mainWindow = null;
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
