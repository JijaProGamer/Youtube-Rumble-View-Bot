global.require = require('esm')(module);

const fs = require("fs");
const path = require("path");
require("ansicolor").nice

global.app_path = path.join(__dirname);

require("../main/server.cjs");


startFullServer().then(() => {
    console.log(ansicolor.green("Headless server started successfully"))
})