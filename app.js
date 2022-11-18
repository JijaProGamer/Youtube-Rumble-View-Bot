const api = new require("./api.js")();
const path = require("path");

let bandwithUsed = 0;
let random = (min, max) => min + Math.floor(Math.random() * (max - min));

let {
    uploadFileXPath, uploadFileSelector, clickSelector, clickXPath, goto,
    waitForSelector,waitForXPath, typeSelector, typeXPath, sleep} = require("./application/publicFunctions.js");

(async () => {    
    let browserConnection = api.connectBrowser(false, "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", {
        browserWSEndpoint: "wss://chrome.browserless.io?token=",
        proxyServer: "bloxxy213.asuscomm.com:31280",
        //userDataDir: path.join(__dirname, "/testUserDataDir"),
        saveBandwith: true,
    })

    //browserConnection.data.on("debug", console.log)
    browserConnection.data.on("pageMessage", console.log)
    //browserConnection.data.on("bandwithUsed", (bandwith) => {bandwithUsed += bandwith, console.log(`${bandwithUsed * 1e-6}mb`)})
    
    //browserConnection.data.on("pageError", console.log)
    //browserConnection.data.on("debug", console.log)
    //browserConnection.data.on("requestHandled", console.log)

    let browser = await browserConnection.browser()
    let page = await api.handleNewPage()

    await page.evaluateOnNewDocument(() => {
        setInterval(() => {
            let cookieBlocker = document.querySelector("ytd-button-renderer.ytd-consent-bump-v2-lightbox:nth-child(2) > yt-button-shape:nth-child(1) > button:nth-child(1)")
            cookieBlocker?.click()

        }, 250)
    })

    await page.goto("https://www.youtube.com/watch?v=nfudlY_RV9g", {waitUntil: "domcontentloaded"})

    setInterval(async () => {
        await page.mouse.move(random(85, 200), random(85, 200));
        await sleep(1000)
        await page.mouse.move(random(85, 200), random(85, 200));
    }, 500)

    await page.waitForNavigation({waitUntil: "networkidle2"})
    let timeSpan = await waitForXPath(page, `/html/body/ytd-app/div[1]/ytd-page-manager/ytd-watch-flexy/div[5]/div[1]/div/div[1]/div[2]/div/div/ytd-player/div/div/div[32]/div[2]/div[1]/div[1]/span[2]`)

    setInterval(async () => {
        let timeStart = await page.evaluate(t => t.childNodes[0].innerHTML, timeSpan)
        let timeEnd = await page.evaluate(t => t.childNodes[2].innerHTML, timeSpan)
    
        console.log(timeStart, timeEnd)
    }, 500)
})()