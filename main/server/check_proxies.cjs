let createProxyTester;

(async () => {
    createProxyTester = (await import("fast-proxy-tester")).createProxyTester;
})();



const ytdl = require("@distube/ytdl-core");

const ProxyAgent = require("proxy-agent-v2");

const { Writable } = require("stream");
let nullPipe = new Writable({ write: (a, b, cb) => cb() })
nullPipe.setMaxListeners(0)

function convertProxyFormat(proxyString) {
    let protocolParts = proxyString.split("://")
    let protocol = protocolParts[0]
    let parts = protocolParts[1].split(":")

    if (parts.length == 4) {
        return `${protocol}://${parts[2]}:${parts[3]}@${parts[0]}:${parts[1]}`
    } else {
        return proxyString
    }
}


function checkProxies(proxies) {
    return new Promise(async (resolve, reject) => {
        proxies = proxies.filter((v) => v.url !== "direct://");
        proxies = [...new Set(proxies)];

        let resolved = false
        let finished = 0
        let needed = proxies.length

        if (needed == 0) return resolve()

        let workIndex = 0;
        let elementsDone = 0;
        let concurrencyLimit = 50;
        let workArray = []
        let workingOn = []

        setTimeout(() => {
            for (let proxy of workingOn) {
                proxyStats.bad.push({ url: proxy.url, err: `proxy is too slow, last stage: ${proxy.stage}` })
                proxyStats.untested = proxyStats.untested.filter((v) => v.url !== proxy.url)

                io.emit("newProxiesStats", proxyStats)
                return
            }

            if (!resolved) resolve()
        }, ((settings.timeout * 1000) + 1000) * 3)

        for (let proxy of proxies) {
            workingOn.push({url: proxy.url, stage: "default"});

            workArray.push(() => new Promise(async (resolve, reject) => {
                proxy = proxy.url

                let tester = new createProxyTester(proxy, settings.timeout * 1000)

                children.push({
                    kill: () => {
                        workingOn = workingOn.filter((p) => p.url !== proxy)
                        resolved = true
                        resolve()
                    },
                });

                try {
                    function onError(error) {
                        throw error
                    }

                    let currentWorkingOn = workingOn.findIndex((v) => v.url = proxy);
                    workingOn[currentWorkingOn].stage = "checking proxy format (1)"

                    let urlStatus = tester.testProxyURL(proxy);
                    if (!urlStatus.isValid) {
                        proxyStats.bad.push({ url: proxy, err: "Proxy is malformed" })
                        proxyStats.untested = proxyStats.untested.filter((v) => v.url !== proxy)

                        io.emit("newProxiesStats", proxyStats)
                        return
                    }

                    currentWorkingOn = workingOn.findIndex((v) => v.url = proxy);
                    workingOn[currentWorkingOn].stage = "checking proxy privacy (2)"

                    let privacy = await tester.testPrivacy().catch(() => onError("timeout checking proxy privacy"))
                    if (privacy.privacy !== "elite") {
                        proxyStats.bad.push({ url: proxy, err: "Proxy is leaking IP address" })
                        proxyStats.untested = proxyStats.untested.filter((v) => v.url !== proxy)

                        io.emit("newProxiesStats", proxyStats)
                        return
                    }

                    currentWorkingOn = workingOn.findIndex((v) => v.url = proxy);
                    workingOn[currentWorkingOn].stage = "checking www.youtube.com connection (3)"

                    let test1Result = await tester.fastTest(`https://www.youtube.com`).catch(() => onError("timeout connecting to youtube servers"))
                    if (test1Result.status !== 200) {
                        proxyStats.bad.push({ url: proxy, err: "Proxy is unable to connect to youtube servers" })
                        proxyStats.untested = proxyStats.untested.filter((v) => v.url !== proxy)

                        io.emit("newProxiesStats", proxyStats)
                        return
                    }

                    await new Promise((resolve, reject) => {
                        let resolved = false

                        currentWorkingOn = workingOn.findIndex((v) => v.url = proxy);
                        workingOn[currentWorkingOn].stage = "11 megabits youtube video download (4)"

                        /*try {
                            ytdl('http://www.youtube.com/watch?v=dQw4w9WgXcQ', {
                                range: {
                                    start: 0,
                                    end: ((1000 * 1000) / 8) * 2 * 5 // 11 megabits (aprox 5 seconds)
                                },
                                quality: 'lowest',
                                requestOptions: { agent: new ProxyAgent(convertProxyFormat(proxy)) }
                            })
                                .pipe(nullPipe)
                                .on("close", () => {
                                    if (!resolved) {
                                        resolve()
                                        resolved = true
                                    }
                                })
                                .on("error", () => {
                                    resolved = true;

                                    reject("timeout requesting video data")
                                })
                        } catch (err) {
                            resolved = true;

                            reject("timeout requesting video data")                      
                        }*/

                            resolve()
                            resolved = true

                        setTimeout(() => {
                            if (!resolved) {
                                resolved = true;

                                reject("timeout requesting video data")
                            }
                        }, 1000 * settings.timeout)
                    }).catch(onError)

                    proxyStats.good.push({ url: proxy, latency: test1Result.latency })
                    proxyStats.untested = proxyStats.untested.filter((v) => v.url !== proxy)

                    finished++
                    good_proxies = proxyStats.good
                    db.prepare("UPDATE good_proxies SET data = ? WHERE id = 1").run(JSON.stringify(good_proxies))
                    io.emit("newProxiesStats", proxyStats)

                    resolve()
                } catch (error) {
                    workingOn = workingOn.filter(p => p.url !== proxy)
                    finished++

                    if (!resolved) {
                        if (error.includes("timeout")) {
                            proxyStats.bad.push({ url: proxy, err: error })
                            proxyStats.untested = proxyStats.untested.filter((v) => v.url !== proxy)

                            io.emit("newProxiesStats", proxyStats)
                        } else {
                            proxyStats.bad.push({ url: proxy, err: error.message })
                            proxyStats.untested = proxyStats.untested.filter((v) => v.url !== proxy)

                            io.emit("newProxiesStats", proxyStats)
                        }

                        resolve()
                    }
                }
            }))
        }

        function processElement(index) {
            if (index >= workArray.length)
                return

            let work = workArray[index]
            work().then(() => {
                workIndex += 1
                elementsDone += 1

                processElement(workIndex)
                if (elementsDone >= workArray.length) {
                    resolve()
                }
            }).catch(() => {
                workIndex += 1
                elementsDone += 1

                processElement(workIndex)
                if (elementsDone >= workArray.length) {
                    resolve()
                }
            })
        }

        for (let index = 0; index < concurrencyLimit; index++) {
            if (index >= workArray.length)
                return

            workIndex = index;
            processElement(index)
        }
    })
}

module.exports = { checkProxies }