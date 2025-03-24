module.exports = async (req, res) => {
    proxies = req.body

    await dbRunWithValues("UPDATE proxies SET data = ? WHERE id = 1", JSON.stringify(proxies));

    io.emit("proxiesChanged", proxies)
    res.sendStatus(201)
}