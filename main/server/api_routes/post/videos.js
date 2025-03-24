module.exports = async (req, res) => {
    videos = req.body

    if(!global.premium){
        let hasAccount = false

        for(let i = 0; i < videos.length; i++){
            let video = videos[i];

            if(video.accounts.length > 0){ hasAccount = true };

            video.accounts = [];
        }

        if(hasAccount){
            await MessageUser({
                title: premiumOnlyTitle,
                text: `To be able to have accounts set to watch your video, \n${premiumText}`,
    
                button1text: "OK",
    
                secondButton: false,
            });
        }
    }

    dbRunWithValues("UPDATE videos SET data = ? WHERE id = 1", JSON.stringify(videos));
    io.emit("videosChanged", videos);

    res.sendStatus(201);
}