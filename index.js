const puppeteer = require("puppeteer-extra")
const path = require("path")

const ublockPath = path.join(__dirname, "extensions/uBlock0.chromium")
const executablePath = `C:\\Users\\bloxx\\Downloads\\chrome-win\\chrome-win\\chrome.exe`

let currentSize = 0

puppeteer.launch({
    defaultViewport: null,
    args: [
        `--start-maximized`, 
        `--mute-audio`, `--disable-extensions-except=${ublockPath}`, `--load-extension=${ublockPath}`,
        `--proxy-server=bloxxy213.asuscomm.com:31280`,
        //`--user-data-dir=${path.join(__dirname, "/testUserDataDir")}`,
    ],
    ignoreDefaultArgs: true,
    headless: true,
    executablePath: executablePath
}).then(async (browser) => {
    const page = await browser.newPage();
    await page.setRequestInterception(true)

    let bannedResourceTypes = ["image", "font", "other"]

    page.on('request', (request) => {
        let url = request.url()
        /*let resourceType = request.resourceType()

        if(bannedResourceTypes.includes(resourceType)) return request.abort()

        if(resourceType === "stylesheet"){
            if(url.includes(`https://www.youtube.com/s/desktop/`)) return request.abort()
            if(url.includes(`fonts.googleapis.com/css`)) return request.abort()
        }

        if(resourceType === "media"){
            return request.abort()
        }

        if(url.includes("/ads")){
            return request.abort()
        }*/

        request.continue()
    })

    page.on('response', (response) => {
        const headers = response.headers();
        let length = headers[`content-length`]
        
        if(length){
            currentSize += parseFloat(length)
        }

        console.log(`${currentSize / 1e+6 } megabits`)
    });
    
    await page.goto(`https://www.youtube.com/watch?v=mfNKDcDDGog`, {waitUntil: "networkidle2"})

    await page.evaluate(() => {
        setInterval(() => {
            let cookieBlocker = document.querySelector("ytd-button-renderer.ytd-consent-bump-v2-lightbox:nth-child(2) > yt-button-shape:nth-child(1) > button:nth-child(1)")
            
            cookieBlocker?.click()
        }, 100)
    })
})