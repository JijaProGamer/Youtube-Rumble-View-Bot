const puppeteer = require("puppeteer-extra")

puppeteer.launch({
    defaultViewport: null,
    args: [`--start-maximized`, `--mute-audio`],
    ignoreDefaultArgs: true,
    headless: false,
    executablePath: process.platform === "win32" && "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe" || `/usr/bin/google-chrome`,
}).then(async (browser) => {
    const page = await browser.newPage();
    await page.setRequestInterception(true)

    let currentSize = 0
    let bannedResourceTypes = ["image", "font", "other"]

    page.on('request', (request) => {
        let url = request.url()
        let resourceType = request.resourceType()

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
        }

        //console.log(request.headers())
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
    
    await page.goto(`https://www.youtube.com/watch?v=2Oz5k_SASxU`, {waitUntil: "networkidle2"})

    await page.evaluate(() => {
        setInterval(() => {
            let cookieBlocker = document.querySelector("ytd-button-renderer.ytd-consent-bump-v2-lightbox:nth-child(2) > yt-button-shape:nth-child(1) > button:nth-child(1)")
            
            cookieBlocker?.click()
        }, 100)
    })
})