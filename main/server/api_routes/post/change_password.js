module.exports = async (req, res) => {
    let { password } = req.body

    password = password && password.trim() || ""
    server_password_global = password

    let server_password = await dbGet(`SELECT * FROM srv_password`).password;

    if (typeof server_password !== "undefined") {
        dbRunWithValues('UPDATE srv_password SET password = ? WHERE id = 1', password)
    } else {
        dbRunWithValues('INSERT OR IGNORE INTO srv_password (password, id) VALUES (?, 1)', password)
    }

    if (password.length > 0)
        return res.redirect('/login')

    res.redirect("/")
}