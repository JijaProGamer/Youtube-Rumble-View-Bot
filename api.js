module.exports = () => {
    return {
        connectBrowser: require("./application/connectBrowser.js"),
        handleNewPage: require("./application/handleNewPage.js"),
        initWatcher: require("./application/initWatcher.js"),
    }
}