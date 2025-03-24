module.exports = (data, socket) => {
    proxies = data;

    dbRunWithValues("UPDATE proxies SET data = ? WHERE id = 1", JSON.stringify(proxies));
    socket.broadcast.emit("proxiesChanged", proxies);
}