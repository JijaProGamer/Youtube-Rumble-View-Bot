const { Server } = require("socket.io");
const express = require("express");
const http = require("http");
const session = require("express-session");
const Sqlite3 = require("sqlite3");
const SQLiteStore = require("connect-sqlite3");
const path = require("path");
const { v4 } = require("uuid");
const { NodeVM } = require("vm2");
const { existsSync, lstatSync, mkdir, mkdirSync, readFileSync, readdirSync, writeFileSync } = require("fs");

const defaultServerInfo = require("./vars.cjs").defaultServerInfo;



const db = new Sqlite3.Database(path.join(app_path, `../database.db3`))
const sqlitestore = SQLiteStore(session)

const app = express();
let route = express.Router()

const server = http.createServer(app);
const io = new Server(server)

//app.set('trust proxy', 1)

function random(min, max) {
    if (max) {
        return min + Math.floor(Math.random() * (max - min))
    } else {
        if (typeof min == "object") {
            return min[random(min.length)]
        } else {
            return Math.floor(Math.random() * min)
        }
    }
}

function computeTime(time) {
    return new Date(time.getFullYear(), time.getMonth(), time.getDate(), time.getHours(), 0, 0)
}

function computeStringDate() {
    let time = new Date();

    return `${time.getDate()}-${time.getMonth()}-${time.getFullYear()}`
}

function computeAccureteTime() {
    let time = new Date();

    return `${time.getDate()}-${time.getMonth()}-${time.getFullYear()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}.${time.getMilliseconds()}`
}

function getCurrentTime() {
    return computeTime(new Date())
}

let currentLogs = {}

if (!existsSync(path.join(__dirname, "../../logs"))) {
    mkdirSync(path.join(__dirname, "../../logs"))
}

function ReadLatestLog(date, filePath) {
    let fileData = []

    try {
        fileData = readFileSync(filePath, "utf-8").split("\n").map((log) => {
            const [_, currentTime, type, message] = log.match(/\[(\d+-\d+-\d+ \d+:\d+:\d+\.\d+)\] - \[(\w+)\]: (.+)/);
            return { currentTime, type: type.toLowerCase(), message };
        })
    } catch (err) { }

    currentLogs[date] = fileData
}

async function MakeLog(type, message) {
    let date = computeStringDate()
    let filePath = path.join(__dirname, "../../logs", `${date}.log`)
    let currentTime = computeAccureteTime()
    if (!currentLogs[date]) {
        ReadLatestLog(date, filePath)
    }

    currentLogs[date].push({ type, message, currentTime })

    writeFileSync(filePath, currentLogs[date].map((log) => {
        return `[${log.currentTime}] - [${log.type.toUpperCase()}]: ${log.message}`
    }).join("\n"))
}

async function MessageUser(MessageData) {
    io.emit("showMessage", {
        title: MessageData.title,
        text: MessageData.text,

        button1text: MessageData.button1text || "Cancel",
        button2text: MessageData.button2text || "OK",

        secondButton: MessageData.secondButton || false,
    })

    return await decisionTaken;
}

async function RemindUser(MessageData) {
    io.emit("showReminderMessage", {
        title: MessageData.title,
        text: MessageData.text,

        button1text: MessageData.button1text || "Remind me later",
        button2text: MessageData.button2text || "Stop reminding me",
        button3text: MessageData.button3text || "Take me there",

        image: MessageData.image,
    })

    let decisionResponse = await decisionTaken;

    switch (decisionResponse) {
        case 1:
            break;
        case 2:
            settings.send_reminders = false;

            await dbRunWithValues('UPDATE options SET data = ? WHERE id = 1', JSON.stringify(settings));
            io.emit("settings", settings);
            break;
        case 3:
            process.stdout.write(`navigate|${MessageData.url}\n`);
            break;
    }
}

setInterval(() => {
    if (settings.send_reminders) {
        let random = Math.floor(Math.random() * 2)

        if (random == 0 || global.premium) {
            RemindUser({
                title: "Rate your experience",
                text: `If you like the Youtube-View-Bot project, consider giving it a star, read and fork on github to help me \nmake updates and improvements faster and better.`,

                image: "/images/github-mark-white.png",
                url: "https://github.com/JijaProGamer/Youtube-View-Bot"
            })
        } else if (random == 1) {
            RemindUser({
                title: "Get premium access",
                text: `For unrestricted access to all the features of the Youtube-View-Bot, consider subscribing to our patreon, \nby following the instructions on the settings page.`,

                image: "/images/PATREON_SYMBOL_1_WHITE_RGB.png",
                url: "/settings"
            })
        }
    }
}, 1000 * 60 * 30)












function dbRun(command){
    return new Promise((resolve, reject) => {
        db.run(command, (err, row) => {
            if(err) return reject(err);
            resolve(row)
        })
    })
}

function dbRunWithValues(command, values){
    return new Promise((resolve, reject) => {
        db.prepare(command).run(values).finalize((err) => {
            if(err) return reject(err);
            resolve()
        });
    })
}

function dbGet(command){
    return new Promise((resolve, reject) => {
        db.get(command, (err, row) => {
            if(err) return reject(err);
            resolve(row)
        })
    })
}

function dbGetAll(command){
    return new Promise((resolve, reject) => {
        db.all(command, (err, row) => {
            if(err) return reject(err);
            resolve(row)
        })
    })
}

function dbGetValues(command, values){
    return new Promise((resolve, reject) => {
        db.get(command, values, (err, row) => {
            if(err) return reject(err);
            resolve(row)
        })
    })
}

global.dbGetAll = dbGetAll;
global.dbGetValues = dbGetValues;
global.dbRun = dbRun;
global.dbRunWithValues = dbRunWithValues;
global.dbGet = dbGet;



async function initDatabase(){
    await dbRun('PRAGMA journal_mode = WAL;');

    await Promise.all([
        dbRun("CREATE TABLE IF NOT EXISTS bandwidth (date INTEGER, value INTEGER, UNIQUE(date))"),
        dbRun("CREATE TABLE IF NOT EXISTS views (date INTEGER, value INTEGER, UNIQUE(date))"),
        dbRun("CREATE TABLE IF NOT EXISTS watch_time (date INTEGER, value INTEGER, UNIQUE(date))"),
        
        dbRun("CREATE TABLE IF NOT EXISTS video_cache (data TEXT, id TEXT, UNIQUE(id))"),
        dbRun("CREATE TABLE IF NOT EXISTS options (data TEXT, id INTEGER)"),
        dbRun("CREATE TABLE IF NOT EXISTS cache (url TEXT, data TEXT, UNIQUE(url))"),
        dbRun("CREATE TABLE IF NOT EXISTS secret (data TEXT)"),
        
        dbRun("CREATE TABLE IF NOT EXISTS videos (data TEXT, id INTEGER, UNIQUE(id))"),
        dbRun("CREATE TABLE IF NOT EXISTS good_proxies (data TEXT, id INTEGER, UNIQUE(id))"),
        dbRun("CREATE TABLE IF NOT EXISTS proxies (data TEXT, id INTEGER, UNIQUE(id))"),
        
        dbRun("CREATE TABLE IF NOT EXISTS srv_password (password TEXT, id INTEGER)"),
        dbRun("CREATE TABLE IF NOT EXISTS keys (key TEXT, status INTEGER, UNIQUE(key))"),
        
        dbRun(`CREATE TABLE IF NOT EXISTS premium_cache (value TEXT, date INTEGER)`),
        dbRun(`CREATE TABLE IF NOT EXISTS free_cache (value TEXT, date INTEGER)`),
    ])

    await Promise.all([
        dbRunWithValues('INSERT OR IGNORE INTO proxies (data, id) VALUES (?, 1)', `["direct://"]`),
        dbRunWithValues('INSERT OR IGNORE INTO good_proxies (data, id) VALUES (?, 1)', `[]`),
        dbRunWithValues('INSERT OR IGNORE INTO videos (data, id) VALUES (?, 1)', `[]`)
    ])
}

global.initDatabase = initDatabase;



let workingStatus = 0
let proxyStats = { good: [], bad: [], untested: [] }
let stats = {}
let extensions = []

async function getStats(){
    stats.views = await dbGetAll(`SELECT * FROM views`) || [];
    stats.watch_time = await dbGetAll(`SELECT * FROM watch_time`) || [];
    stats.bandwidth = await dbGetAll(`SELECT * FROM bandwidth`) || [];
}

global.getStats = getStats;

async function getGlobals(){
    let globalsPromises = [
        dbGet("SELECT * FROM good_proxies"),
        dbGet("SELECT * FROM proxies"),
        dbGet("SELECT * FROM videos"),
        dbGet("SELECT * FROM secret"),
        dbGet("SELECT * FROM options")
    ];

    let globals = (await Promise.all(globalsPromises)).map((v) => v ? v.data : null);
    global.good_proxies = JSON.parse(globals[0]);
    global.proxies = JSON.parse(globals[1]);
    global.videos = JSON.parse(globals[2]);
    global.currentSecret = globals[3];

    if (!global.currentSecret) {
        global.currentSecret = v4().split("-").join("")
        db.prepare('INSERT INTO secret (data) VALUES (?)').run(global.currentSecret)
    }

    try {
        if(globals[4] == null) throw Error("error");
        global.settings = JSON.parse(globals[4]);
    } catch(err) {
        global.settings = defaultServerInfo;
    
        await dbRunWithValues('INSERT INTO options (data, id) VALUES (?, 1)', JSON.stringify(global.settings));
    };
}

global.getGlobals = getGlobals;

function launchServer() {
    return new Promise(async (resolve, reject) => {
        server.listen(settings.server_port, () => {
            console.log(`Server started on http://127.0.0.1:${settings.server_port}`)
            resolve()
        })
    })
}

global.launchServer = launchServer;

global.makeSessionMiddleware = function(){
    global.sessionMiddleware = session({
        secret: currentSecret,
        resave: false,
        saveUninitialized: false,
        cookie: {
            secure: false,
            sameSite: true,
            maxAge: 2592000000 // one month in ms
        },
        store: new sqlitestore/*({
            db: path.join(__dirname, `../database.db3`),
            concurrentDB: 'true'
        })*/
    })
}

let makeGlobal = {
    db, app, route, io,
    workingStatus, proxyStats,
    workers: [], jobs: [], workers_finished: [], stats,
    server_password_global: undefined,
    server_version: readFileSync(path.join(__dirname, "../../VERSION"), "utf-8"),
    __dirname, require,
    extensions,
    lastHealth: {},
    random,
    computeTime, getCurrentTime,
    MakeLog, MessageUser
}

for (let [key, value] of Object.entries(makeGlobal)) {
    global[key] = value
}




























for (let extensionPath of readdirSync(path.join(__dirname, "../../extensions"))) {
    extensionPath = path.join(__dirname, "../../extensions", extensionPath)

    if(!lstatSync(extensionPath).isDirectory()){
        continue;
    }

    let extensioninfo = JSON.parse(readFileSync(path.join(extensionPath, "info.json")))
    let extensionVM = new NodeVM({
        sandbox: {
            getWorkingStatus: () => global.workingStatus,
            getProxies: () => global.proxies,
            getVideos: () => global.videos,
            transformProxies: (newProxies) => global.proxies = newProxies,
            transformProxies: (newProxies) => global.proxies = newProxies,
            transformStatus: (newStatus) => { global.workingStatus = newStatus; startWorking() },
            server_version,
            computeTime, getCurrentTime,
        },
        require: {
            external: true,

        },
    })

    extensionVM.runFile(path.join(extensionPath, "main.js"))
    extensions.push({ ...extensioninfo, vm: extensionVM })
}

global.extensions = extensions

process.on('unhandledRejection', (reason, promise) => {
    MakeLog("error", reason.toString() + reason.stack || "")
    console.error(reason, promise)
    //process.exit(1);
});

process.on('uncaughtException', (error) => {
    MakeLog("error", error.toString() + error.stack || "")
    console.error(error)
    //process.exit(1);
});

process.on('warning', (warning) => {
    MakeLog("warn", warning.toString())
});

const originalConsoleLog = console.log;
const originalConsoleError = console.error;
const originalConsoleWarn = console.warn;

console.log = (...args) => {
    MakeLog("info", args.join(" "))
    originalConsoleLog(...args);
};

console.error = (...args) => {
    MakeLog("error", args.join(" "))
    originalConsoleError(...args);
};

console.warn = (...args) => {
    MakeLog("warn", args.join(" "))
    originalConsoleWarn(...args);
};