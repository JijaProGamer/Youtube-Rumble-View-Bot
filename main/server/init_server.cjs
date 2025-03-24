
const express = require("express");
const helmet = require("helmet");
const bearerToken = require("express-bearer-token");

const neededRanks = require("./vars.cjs").neededRanks;

async function initServer(){
    const { handler } = await import("../build/handler.js");

    app.use(helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false,
    }))
    
    app.use(sessionMiddleware)
    
    app.use(bearerToken())
    app.use(express.json())
    
    app.use(verifyToken)
    app.use(verifyLoginStatus)
    
    app.use("/api", route)
    app.use(handler)
    
    async function verifyToken(req, res, next) {
        let paths = req.path.split("/")
    
        let subpath = paths.pop()
        let lastRoute = paths.pop()
    
        let statusRequired = neededRanks[subpath]
    
        if (typeof statusRequired == "undefined" && lastRoute == "api") {
            return res.sendStatus(404)
        }
    
        if (req.token) {
            if (statusRequired > 1) {
                let result = await dbGetValues(`SELECT status FROM keys WHERE key = ?`, req.token);
    
                if (result && result >= statusRequired) {
                    req.goodToken = true
                    return next()
                }
            }
    
            res.sendStatus(403)
        } else {
            return next()
        }
    }
    
    async function verifyLoginStatus(req, res, next) {
        if (req.goodToken) return next()
    
        let paths = req.path.split("/")
    
        let subpath = paths.pop()
        let lastRoute = paths.pop()
    
        let statusRequired = neededRanks[subpath]
    
        if (subpath.includes(".js") || subpath.includes(".css"))
            return next()
    
        if (lastRoute == "images" || lastRoute == "svgs")
            return next()
    
        server_password_global = (await dbGet(`SELECT * FROM srv_password`) || {}).password;

        if (typeof server_password_global == "undefined") {
            if (lastRoute == "api") {
                if (subpath !== "change_password")
                    return res.sendStatus(401);
    
                return next()
            }
    
            if (subpath !== "change_password") {
                return res.redirect("/change_password")
            } else {
                return next()
            }
        }

        if ((req.session.loggedIn && req.session.server_password == server_password_global) || (statusRequired == 0 || server_password_global == "" || subpath == "login")) {
            if(!global.premium && !global.free_key){
                if(subpath == "login" || subpath == "manage_key" || statusRequired == 0 || (lastRoute == "api" && (subpath == "settings" || subpath == "free_status" || subpath == "patreon_status")) ){
                    return next();
                }
    
                return res.redirect("/manage_key")
            } else {
                return next();
            }
        } else {
            if (server_password_global.length > 0) {
                if (lastRoute == "api") {
                    return res.sendStatus(403)
                }
    
                res.redirect(`/login`)
            } else {
                req.session.loggedIn = true
    
                next()
            }
        }
    }
    
    io.use((socket, next) => sessionMiddleware(socket.request, {}, next));
    
    io.use((socket, next) => {
        const session = socket.request.session;
    
        if (
            (session && session.loggedIn)
            || (typeof server_password_global !== "undefined" && server_password_global.length == 0)
        ) {
            next();
        } else {
            next(new Error("unauthorized"));
        }
    });
}

global.initServer = initServer;