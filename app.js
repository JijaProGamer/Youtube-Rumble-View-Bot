const api = new require("./api.js")();
const path = require("path");

let bandwithUsed = 0;

let {
    uploadFileXPath, uploadFileSelector, clickSelector, clickXPath, goto,
    waitForSelector,waitForXPath, typeSelector, typeXPath, sleep,
    jiggleMouse, confirmNavigation} = require("./application/publicFunctions.js")

let runApp = async (index) => {
    let browserConnection = api.connectBrowser("C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", {
        //browserWSEndpoint: "wss://chrome.browserless.io?",
        //proxyServer: "bloxxy213.asuscomm.com:31280",
        userDataDir: path.join(__dirname, `/testUserDataDir/${index}`),
        saveBandwith: true,
    })

    //browserConnection.data.on("debug", console.log)
    //browserConnection.data.on("pageMessage", console.log)
    browserConnection.data.on("bandwithUsed", (bandwith) => {
        bandwithUsed += bandwith
        //console.log(`${bandwithUsed * 1e-6}mb`)
    })
    
    //browserConnection.data.on("pageError", console.log)
    //browserConnection.data.on("requestHandled", console.log)

    let browser = await browserConnection.browser()
    let page = await api.handleNewPage()

    await sleep(100000000)
    await page.goto("https://www.youtube.com/watch?v=bdAzFR3JzLg", {waitUntil: "networkidle0"})
    await api.initWatcher(page)

    setInterval(async () => {
        console.log(await api.getPlayerStatistics(page))
    }, 1000)
}

runApp(999)

for (let i = 0; i < 10; i += 2){
    setTimeout(async () => {
        //runApp(i + 1)
        //runApp(i + 2)
    }, i * 5 * 1000)
}