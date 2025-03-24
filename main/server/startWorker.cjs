let youtube_selfbot_api;
let rumble_selfbot_api;

(async () => {
    youtube_selfbot_api = (await import("youtube-selfbot-api")).selfbot;
    rumble_selfbot_api = (await import("rumble-selfbot-api")).selfbot;
})();


const { to } = require("await-to-js");
const { v4 } = require("uuid");
const path = require("path");
const fs = require("fs");

function clamp(num, min, max) {
    return num <= min ? min : num >= max ? max : num
}

let workingList = []

global.watchInterval = setInterval(() => {
    workingList.forEach(async (workingHolder, workingIndex) => {
        let [ad_err, ad] = await to(workingHolder.watcherContext.isAdPlaying())
        if (ad_err) return workingHolder.fail(`Error getting the current ad: ${ad_err}`)

        if (ad.type == "small") {
            var [ad_skip_err] = await to(workingHolder.watcherContext.skipAd(false))
            if (ad_skip_err) return workingHolder.fail(`Error skipping the current ad: ${ad_err}`)
        }

        if (ad.type == "video") {
            if (settings.watch_ads) {
                if (!workingHolder.adDetected) {
                    workingHolder.adDetected = true;
                    workingHolder.adPlayTime = random(settings.skip_ads_after[0], settings.skip_ads_after[1]);
                } else {
                    let currentAdPercent = (100 / ad.duration) * ad.currentTime;

                    if (currentAdPercent > workingHolder.adPlayTime && ad.canSkip) {
                        var [ad_skip_err] = await to(workingHolder.watcherContext.skipAd(false))
                        if (ad_skip_err) return workingHolder.fail(`Error skipping the current ad: ${ad_err}`)
                    }

                }
            } else {
                if (ad.canSkip) {
                    var [ad_skip_err] = await to(workingHolder.watcherContext.skipAd(false))
                    if (ad_skip_err) return workingHolder.fail(`Error skipping the current ad: ${ad_err}`)
                }
            }
        }

        let [watchtime_err, currentWatchTime] = await to(workingHolder.watcherContext.time())
        if (watchtime_err) return workingHolder.fail(`Error getting the watchtime: ${watchtime_err}`)

        let watchTimePercent = (100 / workingHolder.job.video_info.duration) * currentWatchTime
        let increase = !workingHolder.job.video_info.isLive ? currentWatchTime : (Date.now() - workingHolder.start_time) / 1000

        var newAmount = increase - workingHolder.lastWatchtime
        var currentTime = getCurrentTime().getTime()

        var alreadyFound = stats.watch_time.filter((v) => v.date == currentTime)
        if (!alreadyFound[0]) {
            stats.watch_time.push({ date: currentTime, value: 0 })
            await dbRunWithValues(`INSERT OR IGNORE INTO watch_time (date, value) VALUES (?, ?)`, [currentTime, 0])
        }

        stats.watch_time[stats.watch_time.length - 1].value += newAmount
        await dbRunWithValues(`UPDATE watch_time SET value = value + ? WHERE date = ?`, [newAmount, currentTime])

        if (!workingHolder.increasedViews && increase > workingHolder.maxWatchtime) {
            workingHolder.increasedViews = true

            let alreadyFound2 = stats.views.filter((v) => v.date == currentTime)
            if (!alreadyFound2[0]) {
                stats.views.push({ date: currentTime, value: 0 })

                await dbRunWithValues(`INSERT OR IGNORE INTO views (date, value) VALUES (?, ?)`, [currentTime, 0])
            }

            stats.views[stats.views.length - 1].value += 1
            await dbRunWithValues(`UPDATE views SET value = value + 1 WHERE date = ?`, currentTime)

            io.emit("increase_views_amount")
        }

        io.emit("increase_watch_time_amount", newAmount)
        io.emit("update_workers", workers)

        workingHolder.worker.currentTime = increase
        workingHolder.lastWatchtime = increase

        if (workingHolder.job.account) {
            if (workingHolder.job.account.like && !workingHolder.liked) {
                if (watchTimePercent >= workingHolder.job.account.likeAt) {
                    workingHolder.liked = true

                    let [like_err] = await to(workingHolder.watcherContext.like())
                    if (like_err) return workingHolder.fail(`Error liking video: ${like_err}`)
                }
            }

            if (workingHolder.job.account.dislike && !workingHolder.disliked) {
                if (watchTimePercent >= workingHolder.job.account.dislikeAt) {
                    workingHolder.disliked = true

                    let [dislike_err] = await to(workingHolder.watcherContext.dislike())
                    if (dislike_err) return workingHolder.fail(`Error disliking video: ${dislike_err}`)
                }
            }

            if (workingHolder.job.account.comment && !workingHolder.commented) {
                if (watchTimePercent >= workingHolder.job.account.commentAt) {
                    workingHolder.commented = true

                    let [comment_err] = await to(workingHolder.watcherContext.comment(workingHolder.job.account.comment))
                    if (comment_err) return workingHolder.fail(`Error creating comment: ${comment_err}`)
                }
            }
        }

        if (!workingHolder.job.video_info.isLive) {
            if (watchTimePercent >= workingHolder.job.watch_time) {
                workingHolder.finish()
            }
        } else {
            if (!workingHolder.job.watch_entire_livestream && (Date.now() - workingHolder.start_time) > workingHolder.job.watch_time * 1000) {
                workingHolder.finish()
            }
        }
    })

    io.emit("update_workers", workers)
}, 500)

async function makeOwnerHolder(job, worker, wtfp, browser, watcherContext, resolve, reject){
    return {
        lastWatchtime: 0,
        commented: false,
        disliked: false,
        liked: false,
        increasedViews: false,
        maxWatchtime: ((job.video_info.isShort || job.isLivestream) && 1) || (clamp(wtfp, Math.min(job.video_info.duration, 30), 30)),
        start_time: Date.now(),

        adDetected: false,
        adPlayTime: 0,

        browser: browser,
        watcherContext,
        account: job.account,
        job,
        worker,
        id: v4(),
        killed: false,
        kill: async function () {
            this.killed = true
            workingList = workingList.filter(w => w.id !== this.id)

            if (browser) {
                await to(browser.close())
                browser = undefined
            }

        },
        fail: async function (err) {
            await this.kill()
            reject(err)
        },
        finish: async function () {
            await this.kill()
            resolve()
        }
    }
}

async function startYoutubeWorker(job, worker, browser, wtfp, processErr, resolve, reject) {
    let page

    let googleContext
    let google_setup_err

    if (job.account) {
        let cookies = job.account.cookies

        try {
            cookies = JSON.parse(job.account.cookies)
        } catch (err) { }

        let [new_page_err, newPg] = await to(browser.newPage())
        page = newPg
        if (new_page_err) return processErr(`Error starting a new page: ${new_page_err}`)

        

        [google_setup_err, googleContext] = await to(page.setupGoogle(job.account, cookies))
        if (google_setup_err) return processErr(`Error creating google context: ${google_setup_err}`)

        let [google_login_err] = await to(googleContext.login(job.account, cookies))
        if (google_login_err) return processErr(`Error logging into google: ${google_login_err}`)
    } else {
        let [clear_storage_err] = await to(browser.clearStorage())
        if (clear_storage_err) return processErr(`Error clearing storage: ${clear_storage_err}`)

        let [init_loader_err] = await to(browser.initLoader())
        if (init_loader_err) return processErr(`Error initializing the browser: ${clear_storage_err}`)

        

        let [new_page_err, newPg] = await to(browser.newPage())
        page = newPg
        if (new_page_err) return processErr(`Error starting a new page: ${new_page_err}`)
    }

    let [goto_video_err, watcherContext] = await to(page.gotoVideo(job.watch_type, job.id, {
        //forceFind: true,
        //title: job.keyword_chosen,
        //filters: job.filters,
        //referer: job.referer
    }))

    if (goto_video_err) return processErr(`Error going to the video: ${goto_video_err}`)

    if (!job.video_info.isLive) {
        let [seek_err] = await to(watcherContext.seek(0))
        if (seek_err) return processErr(`Error seeking to the start of the video: ${seek_err}`)
    }

    await watcherContext.setResolution("tiny");

    let workerHolder = await makeOwnerHolder(job, worker, wtfp, browser, watcherContext, resolve, reject);
    workingList.push(workerHolder)

    if (browser) {
        browser.on("videoStateChanged", async (lastState, newState) => {
            if (newState == "FINISHED") {
                await workerHolder.finish()
            }
        })

        if (job.account && job.video_info.isLive) {
            if (job.account.like) {
                await watcherContext.like()
            }

            if (job.account.dislike) {
                await watcherContext.dislike()
            }
            if (job.account.subscribe) {
                await watcherContext.subscribe()
            }

            if (job.account.comment) {
                await watcherContext.comment(job.account.comment)
            }
        }
    }
}

async function startRumbleWorker(job, worker, browser, wtfp, processErr, resolve, reject) {
    let [new_page_err, page] = await to(browser.newPage())
    if (new_page_err) return processErr(`Error starting a new page: ${new_page_err}`)

    let googleContext
    let google_setup_err

    if (job.account) {
        let cookies = job.account.cookies

        try {
            cookies = JSON.parse(job.account.cookies)
        } catch (err) { }

        /*[google_setup_err, googleContext] = await to(page.setupGoogle(job.account, cookies))
        if (google_setup_err) return processErr(`Error creating google context: ${google_setup_err}`)

        let [google_login_err] = await to(googleContext.login(job.account, cookies))
        if (google_login_err) return processErr(`Error logging into google: ${google_login_err}`)*/
    } else {
        let [clear_storage_err] = await to(browser.clearStorage())
        if (clear_storage_err) return processErr(`Error clearing storage: ${clear_storage_err}`)
    }

    let [goto_video_err, watcherContext] = await to(page.gotoVideo(job.watch_type, job.id, {
        forceFind: true,
        title: job.keyword_chosen,
        filters: job.filters,
    }))

    if (goto_video_err) return processErr(`Error going to the video: ${goto_video_err}`)

    if (!job.video_info.isLive) {
        let [seek_err] = await to(watcherContext.seek(0))
        if (seek_err) return processErr(`Error seeking to the start of the video: ${seek_err}`)
    }

    let workerHolder = await makeOwnerHolder(job, worker, wtfp, browser, watcherContext, resolve, reject);
    workingList.push(workerHolder)

    if (browser) {
        await watcherContext.play()

        browser.on("videoStateChanged", async (lastState, newState) => {
            if (newState == "FINISHED") {
                await workerHolder.finish()
            }
        })

        if (job.account && job.video_info.isLive) {
            if (job.account.like) {
                await watcherContext.like()
            }

            if (job.account.dislike) {
                await watcherContext.dislike()
            }
            if (job.account.subscribe) {
                await watcherContext.subscribe()
            }

            if (job.account.comment) {
                await watcherContext.comment(job.account.comment)
            }
        }
    }
}

function startWorker(job, worker, userDataDir, wtfp) {
    return new Promise(async (resolve, reject) => {
        let wtfp = !job.isLivestream && (job.video_info.duration / 100) * job.watch_time

        let botType = job.isRumble ? rumble_selfbot_api : youtube_selfbot_api

        userDataDir = path.join(__dirname, `../../cache/raw_guests/${userDataDir}`);

        let bot = new botType({
            headless: settings.headless,
            //userDataDir: userDataDir,
            proxy: job.proxy,
            autoSkipAds: settings.auto_skip_ads,
            timeout: settings.timeout * 1000,

            muteAudio: true,
            useAV1: settings.use_AV1,

            workingFolder: path.join(__dirname, "../../browserEngine/")
        })

        let browser
        let failed = false

        async function processErr(err) {
            if (browser) {
                await to(browser.close())
                browser = undefined
            }

            reject(err)
        }

        children.push({
            child: browser,
            type: "process",
            kill: async function () {
                console.log("killing for some reason")
                if (browser) {
                    processErr()
                } else if (!failed) {
                    let interval = setInterval(() => {
                        if (browser) {
                            this.kill()
                            clearInterval(interval)
                        }
                    }, 500)
                }
            }
        })

        let [launch_error, globalBrowser] = await to(bot.launch())

        if (launch_error) {
            failed = true
            return processErr(`Error spawning browser: ${launch_error.message}, ${launch_error.name}`)
        }

        browser = globalBrowser

        browser.on("bandwith", (id, type, len) => {
            len = parseFloat((len * 1e-6).toFixed(2))

            var currentTime = getCurrentTime().getTime()

            var alreadyFound = stats.bandwidth.filter((v) => v.date == currentTime)
            if (!alreadyFound[0]) {
                stats.bandwidth.push({ date: currentTime, value: 0 })

                dbRunWithValues(`INSERT OR IGNORE INTO bandwidth (date, value) VALUES (?, ?)`, [currentTime, 0])
            }

            stats.bandwidth[stats.bandwidth.length - 1].value += len
            dbRunWithValues(`UPDATE bandwidth SET value = value + ? WHERE date = ?`, [len, currentTime])
            worker.bandwidth += len

            io.emit("update_workers", workers)
            io.emit("increase_bandwidth_amount", len)
        })

        if (job.isRumble) {
            await startRumbleWorker(job, worker, browser, wtfp, processErr, resolve, reject)
        } else {
            await startYoutubeWorker(job, worker, browser, wtfp, processErr, resolve, reject)
        }
    })
}

module.exports = startWorker;