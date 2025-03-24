global.require = require('esm')(module);

const fs = require("fs");
const path = require("path");
const { app, BrowserWindow, shell } = require("electron");

//global.app_path = app.getPath("appData");
global.app_path = path.join(__dirname);

require("ansicolor").nice

if (!fs.existsSync(path.join(__dirname, "../main/cache/raw_guests"))){
    fs.mkdirSync(path.join(__dirname, "../main/cache/raw_guests"), { recursive: true });
}

require("../main/server.cjs");


startFullServer().then(() => {
    const createWindow = () => {
        const win = new BrowserWindow({
            title: "Youtube-View-Bot",
            autoHideMenuBar: true,
            //icon: path.join(__dirname, "/main/static/favicon.ico"),
            webPreferences: {
                nodeIntegration: false,
                nodeIntegrationInWorker: false,
            }
        })

        win.webContents.on('will-navigate', function (e, url) {
            if (url.includes("patreon") || url.includes("github") || url.includes("paypal") || url.includes("bloxxy.net") || url.includes("iproyal.com") || url.includes("discord.")) {
                e.preventDefault();
                shell.openExternal(url);
            }
        });

        win.maximize();
        win.loadURL(`http://localhost:${settings.server_port}`).then(() => {
            win.reload()
        })
    }

    app.on('window-all-closed', async () => {
        process.exit(0);
    })

    app.whenReady().then(() => {
        createWindow()
    })
})

process.stdin.on("data", (data) => {
    data = data.toString()

    //console.log(data.toString())
})
