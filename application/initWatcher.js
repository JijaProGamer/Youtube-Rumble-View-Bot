let {
    uploadFileXPath, uploadFileSelector, clickSelector, clickXPath, goto,
    waitForSelector,waitForXPath, typeSelector, typeXPath, sleep,
    jiggleMouse, confirmNavigation} = require("./publicFunctions.js")

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

function initWatcher(headless, executablePath, extra) {
    
}

module.exports = initWatcher