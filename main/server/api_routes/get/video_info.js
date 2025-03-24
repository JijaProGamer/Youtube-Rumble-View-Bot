const ytdl = require('@distube/ytdl-core');
const rumble = require("rumble-core")

let cache = {}
let blacklist = []

function getYoutubeID(url) {
    let regex = /(youtu.*be.*)\/(watch\?v=|embed\/|v|shorts|)(.*?((?=[&#?])|$))/gm
    let found = regex.exec(url)

    if (found && found.length > 1 && found[3]) {
        url = found[3]

        if (url.length >= 10 && url.length <= 12) {
            return url
        }
    } else {
        if (url.length >= 10 && url.length <= 12) {
            return url
        }
    }

    return null
}

function handleYoutube(id, req, res){
    ytdl.getInfo(id).then((videoInfo) => {
        let vFormats = videoInfo.formats.filter((v) => v.width && v.height)
        let vFormat = vFormats.sort((a, b) => a.width - b.width).shift()
        let max_vFormat = vFormats.sort((a, b) => a.width - b.width).pop()

        let thumbnails = videoInfo.videoDetails.thumbnails
        let isShort = (vFormat.width / vFormat.height) < 1
        let isLive = videoInfo.videoDetails.isLiveContent && videoInfo.videoDetails.liveBroadcastDetails.isLiveNow

        let result = {
            isRumble: false,
            title: videoInfo.videoDetails.title,
            thumbnail: thumbnails[thumbnails.length - 1].url,
            videoType: (isLive && "livestream") || (isShort && "short") || "normal",
            uploadDate: new Date(videoInfo.videoDetails.uploadDate),
            duration: parseFloat(videoInfo.videoDetails.lengthSeconds),

            validFilters: {
                is4K: max_vFormat.height >= 1440,
                isHD: max_vFormat.height >= 1080,
                //is3D: videoInfo.formats.some(format => format.videoDetails && format.videoDetails.projectionType && format.videoDetails.projectionType !== "RECTANGULAR"),
                isHDR: max_vFormat.colorInfo && max_vFormat.colorInfo.primaries == "COLOR_PRIMARIES_BT709",
            }
        }

        dbRunWithValues(`INSERT INTO video_cache (data, id) VALUES (?, ?)`, [JSON.stringify(result), id]);
    
        res.json(result)
        cache[id] = result
    }).catch((err) => {
        //db_insert_video.run("false", id)
        //blacklist.push(id)

        res.sendStatus(404)
    })
}

function getRumbleID(url) {
    let found = url.split("/").pop().split("-").shift()

    if (found && found.length >= 5 && found.length <= 8) {
        return found
    }

    return null
}

function handleRumble(id, req, res){
    rumble.getInfo(id).then((videoInfo) => {
        let vFormat = videoInfo.video.formats.sort((a, b) => a.width - b.width).shift()

        let isShort = (vFormat.width / vFormat.height) < 1
        let isLive = videoInfo.live

        let result = {
            isRumble: true,
            title: videoInfo.video.title,
            thumbnail: (videoInfo.video.thumbnails.sort((a, b) => a.width - b.width).pop() || {}).url,
            videoType: (isLive && "livestream") || (isShort && "short") || "normal",
            uploadDate: videoInfo.video.uploadDate,
            duration: videoInfo.video.duration,

            validFilters: {
                is4K: vFormat.height >= 1440,
                isHD: vFormat.height >= 1080,
            }
        }

        dbRunWithValues(`INSERT INTO video_cache (data, id) VALUES (?, ?)`, [JSON.stringify(result), id]);
    
        res.json(result)
        cache[id] = result
    }).catch((err) => {
        //console.log(err)
        //db_insert_video.run("false", id)
        //blacklist.push(id)

        res.sendStatus(404)
    })
}

module.exports = async (req, res) => {
    let YoutubeID = getYoutubeID(req.query.id)
    let RumbleID = getRumbleID(req.query.id)

    if(!YoutubeID && !RumbleID) {
        return res.sendStatus(404)
    }

    let id = YoutubeID || RumbleID;
    if (cache[id]) return res.send(cache[id])
    //if (blacklist.includes(id)) return res.sendStatus(404)

    let videoFromDB = await dbGetValues("SELECT data FROM video_cache WHERE id = ?", [id]);
    if(videoFromDB){
        res.json(JSON.parse(videoFromDB.data))
    /*} else if (videoFromDB.data == "false"){
        res.sendStatus(404)*/
    } else {
        if(YoutubeID){
            handleYoutube(YoutubeID, req, res);
        } else{
            handleRumble(RumbleID, req, res)
        }
    }
}