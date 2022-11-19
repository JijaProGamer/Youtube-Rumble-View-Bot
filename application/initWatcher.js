let {
    uploadFileXPath, uploadFileSelector, clickSelector, clickXPath, goto,
    waitForSelector,waitForXPath, typeSelector, typeXPath, sleep,
    jiggleMouse, confirmNavigation, random} = require("./publicFunctions.js")

/**
 * Initialises the video player, should be run only once per page
 * @param {Object} page result of api.handleNewPage()
*/

function initWatcher(page) {
    return new Promise(async (resolve, reject) => {
        if (!this.__handled) reject(new Error(`Please call api.connectBrowser first`))
        if (!this.__launched) reject(new Error(`api.connectBrowser was called, but failed doing so`))

        this.data.emit(`debug`, `Started watch init`)

        await confirmNavigation(page)

        this.data.emit(`debug`, `Sucesfully navigated to website`)
    
        //let playButton = await waitForSelector(page, `#movie_player > div.ytp-cued-thumbnail-overlay > button`)
        //await playButton.click()
    
        //await jiggleMouse(page, random(85, 200))
        //setInterval(() => {jiggleMouse(page, random(85, 200))}, 500)
    
        let videoElement = await waitForSelector(page, `video`)
        await page.evaluate((e) => e.pause(), videoElement)

        this.data.emit(`debug`, `Sucesfully grabbed video element`)
        
        await page.evaluate(() => {
            document.getElementsByClassName("ytp-settings-button")[0].click()
        })

        this.data.emit(`debug`, `Sucesfully stopped autoplay`)
    
        await clickSelector(page, `.ytp-right-controls > button:nth-child(1)`)
    
        await sleep(500)
        await page.evaluate(() => {
            document.getElementsByClassName("ytp-panel-menu")[0].lastChild.click()
        })
    
        await sleep(500)
    
        await page.evaluate(() => {
            let items = Array.from(document.getElementsByClassName("ytp-menuitem"))
    
            items[items.length - 2].click()
        })

        this.data.emit(`debug`, `Sucesfully changed resolution`)
    
        await sleep(100)
        await page.evaluate((e) => e.play(), videoElement)

        this.data.emit(`debug`, `Started playing video`)

        resolve()
    })
}

module.exports = initWatcher