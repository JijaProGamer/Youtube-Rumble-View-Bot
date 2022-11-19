const { EventEmitter } = require("events"); 

const puppeteer = require("puppeteer-extra")
const fs = require("fs")
const path = require("path")

const plugin_stealth = require("puppeteer-extra-plugin-stealth")
puppeteer.use(plugin_stealth())

/**
 * Connects to a browser, also creates one if no browserWSEndpoint is provided
 * @param {string} executablePath Chrome binary file
 * @param {Object} extra Extra information for connecting to the browser
 * @param {string | undefined} extra.browserWSEndpoint WSEndpoint of detached browser, Browserless or other providers recommended
 * @param {string | undefined} extra.proxyServer IP of the proxy to connect to (Optional, but should be used)
 * @param {string | undefined} extra.userDataDir used for extra caching, anti bot detection and fast login (Optional, but recommended)
 * @param {string | undefined} extra.saveBandwith Bypass useless requests
 * @param {Object | undefined} extra.args Extra arguments to pass to chrome's launch arguments
*/

function connectBrowser(executablePath, extra) {
    let dataEvent = new EventEmitter()
    let extensionFolder = fs.readdirSync(path.join(__dirname, "../extensions")).map(value => value = path.join(__dirname, `../extensions/${value}`))
    
    return {
        browser: () => new Promise((resolve, reject) => {
            this.data = dataEvent
            this.extra = extra

            let launchArguments = {
                headless: false,
                defaultViewport: null,
                args: [
                    `--start-maximized`, 
                    `--mute-audio`,
                    `--always-authorize-plugins`,
                    '--proxy-bypass-list=*',
                    `--proxy-server=${extra.proxyServer || "direct://"}`,
                    `--disable-web-security`, `--ignore-certificate-errors`,
                ],
                //ignoreDefaultArgs: true,
                executablePath: executablePath,
                ignoreHTTPSErrors: true,
                browserWSEndpoint: extra.browserWSEndpoint,
                userDataDir: extra.userDataDir,
            }

            if(extra.args) launchArguments.args = [...launchArguments.args, ...extra.args]
            //if(extra.userDataDir) launchArguments.args.push(`--user-data-dir=${extra.userDataDir}`)
            launchArguments.args.push(`--disable-extensions-except=${extensionFolder.join(",")}`)
        
            extensionFolder.forEach((extension) => {
                launchArguments.args.push(`--load-extension=${extension}`)
            })

            dataEvent.emit("debug", `Launching browser with external arguments ${JSON.stringify(launchArguments)}`)

            console.log(launchArguments)

            if(extra.browserWSEndpoint){
                puppeteer.connect(launchArguments).then((browser) => {
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
            } else {
                puppeteer.launch(launchArguments).then((browser) => {
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
            }
        }),
        data: dataEvent,
    }
}

module.exports = connectBrowser