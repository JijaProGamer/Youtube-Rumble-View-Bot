const api = new require("./api.js")();
const path = require("path");

let bandwithUsed = 0;
let random = (min, max) => min + Math.floor(Math.random() * (max - min));

let {
    uploadFileXPath, uploadFileSelector, clickSelector, clickXPath, goto,
    waitForSelector,waitForXPath, typeSelector, typeXPath, sleep,
    jiggleMouse, confirmNavigation} = require("./application/publicFunctions.js")

let runApp = async (index) => {
    let browserConnection = api.connectBrowser(false, "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", {
        //browserWSEndpoint: "wss://chrome.browserless.io?token=",
        proxyServer: "bloxxy213.asuscomm.com:31280",
        userDataDir: path.join(__dirname, `/testUserDataDir/${index}`),
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

    await page.goto("https://www.youtube.com/watch?v=FCGvDqcetNY", {waitUntil: "networkidle0"})
    await confirmNavigation(page)

    //let playButton = await waitForSelector(page, `#movie_player > div.ytp-cued-thumbnail-overlay > button`)
    //await playButton.click()

    await jiggleMouse(page, random(85, 200))
    setInterval(() => {jiggleMouse(page, random(85, 200))}, 500)

    let videoElement = await waitForSelector(page, `video`)
    await page.evaluate((e) => e.pause(), videoElement)
    
    await page.evaluate(() => {
        document.getElementsByClassName("ytp-settings-button")[0].click()
    })

    await clickSelector(page, `.ytp-right-controls > button:nth-child(1)`)

    await page.evaluate(() => {
        document.getElementsByClassName("ytp-panel-menu")[0].lastChild.click()
    })

    await page.evaluate((b) => {
        let items = Array.from(document.getElementsByClassName("ytp-menuitem"))
        items[items.length - 2].click()
    })

    await sleep(100)
    await page.evaluate((e) => e.play(), videoElement)
    
    let videoDuration = await page.evaluate((e) => Math.floor(e.duration), videoElement)

    let interval = setInterval(async () => {
        let time = await page.evaluate((e) => Math.floor(e.currentTime), videoElement)
    
        if(time > 2){
            clearInterval(interval)
            await browser.close()
        }
    }, 1000)
}

runApp(1)

for (let i = 0; i < 10; i += 2){
    setTimeout(async () => {
        //runApp(i + 1)
        //runApp(i + 2)
    }, i * 10 * 1000)
}