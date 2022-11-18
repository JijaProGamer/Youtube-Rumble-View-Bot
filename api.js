module.exports = () => {
    return {
        connectBrowser: require("./application/connectBrowser.js"),
        handleNewPage: require("./application/handleNewPage.js"),
    }
}