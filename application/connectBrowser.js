const { EventEmitter } = require("events"); 

const puppeteer = require("puppeteer-extra")
const fs = require("fs")
const path = require("path")

const plugin_stealth = require("puppeteer-extra-plugin-stealth")
puppeteer.use(plugin_stealth())

/**
 * Connects to a browser, also creates one if no browserWSEndpoint is provided
 * @param {boolean} headless Should it run in headless mode? (ONLY USE IN TESTING)
 * @param {string} executablePath Chrome binary file
 * @param {Object} extra Extra information for connecting to the browser
 * @param {string | undefined} extra.browserWSEndpoint WSEndpoint of detached browser, Browserless or other providers recommended
 * @param {string | undefined} extra.proxyServer IP of the proxy to connect to (Optional, but should be used)
 * @param {string | undefined} extra.userDataDir used for extra caching, anti bot detection and fast login (Optional, but recommended)
 * @param {string | undefined} extra.saveBandwith Bypass useless requests
*/

function connectBrowser(headless, executablePath, extra) {
    let dataEvent = new EventEmitter()
    let extensions = []

    if(extra?.proxyServer) extensions.push(`--proxy-server=${extra?.proxyServer}`)
    if(extra?.userDataDir) extensions.push(`--user-data-dir=${extra?.userDataDir}`)

    let extensionFolder = fs.readdirSync(path.join(__dirname, "../extensions")).map(value => value = path.join(__dirname, `../extensions/${value}`))
    extensions.push(`--disable-extensions-except=${extensionFolder.join(",")}`)

    extensionFolder.forEach((extension) => {
        extensions.push(`--load-extension=${extension}`)
    })

    return {
        browser: () => new Promise((resolve, reject) => {
            this.data = dataEvent
            this.extra = extra

            dataEvent.emit("debug", `Launching browser with external arguments ${extensions.join(" ")}`)

            puppeteer.launch({
                headless,
                defaultViewport: null,
                args: [
                    `--start-maximized`, 
                    `--mute-audio`,
                    ...extensions,
                    `--always-authorize-plugins`,
                ],
                ignoreDefaultArgs: true,
                headless: true,
                executablePath: executablePath,
                ignoreHTTPSErrors: true
            }).then((browser) => {
                this.__handled = true
                this.__launched = true
                this.browser = browser

                dataEvent.emit("debug", "Browser connected sucessfully")
                resolve(browser)
            }).catch((error) => {
                this.__handled = true
                this.__launched = false
                
                dataEvent.emit("debug", `Browser failed to connect with error ${error}`)
                reject(error)
            })
        }),
        data: dataEvent,
    }
}

module.exports = connectBrowser