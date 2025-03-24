module.exports = (req, res) => {
    res.json({
        status: global.premium,
        checkedStatus: global.checkedStatus,
    })
}