const api = new require("./api.js")();
const path = require("path");

let bandwithUsed = 0;

(async () => {
    let browserConnection = api.connectBrowser(false, "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", {
        //browserWSEndpoint: "",
        proxyServer: "bloxxy213.asuscomm.com:31280",
        userDataDir: path.join(__dirname, "/testUserDataDir"),
        saveBandwith: true,
    })

    //browserConnection.data.on("debug", console.log)
    //browserConnection.data.on("pageMessage", console.log)
    //browserConnection.data.on("pageError", console.log)
    //browserConnection.data.on("requestHandled", console.log)
    //browserConnection.data.on("bandwithUsed", (bandwith) => {bandwithUsed += bandwith, console.log(`${bandwithUsed * 1e-6}mb`)})

    let browser = await browserConnection.browser()
    let page = await api.handleNewPage()

    await page.goto("https://www.youtube.com/watch?v=k62mpTzqq7E")
})()