const axios = require("axios")

async function updatePremiumRank(){
    let isPremium = false
    let api_key = settings.api_key

    if(api_key){
        try {
            let data = (await axios.get("https://www.bloxxy.net/api/patreon", {
                headers: {
                    Cookie: `connect.sid=${api_key}`
                }
            })).data
    
            if(data.id >= 0 && data.subscription >= 10){
                isPremium = true

                await dbRunWithValues(`INSERT OR REPLACE INTO premium_cache (value, date) VALUES (?, ?)`, ["true", Date.now()]);
            } else {
                await dbRunWithValues(`INSERT OR REPLACE INTO premium_cache (value, date) VALUES (?, ?)`, ["false", Date.now()]);
            }
        } catch (err){
            console.error(err)
            const cacheData = await dbGet('SELECT * FROM premium_cache LIMIT 1');

            if (cacheData) {
                if((cacheData.date + (1000 * 60 * 60 * 24 * 3)) >= Date.now() && cacheData.value == "true"){
                    isPremium = true;
                }
            } 
        }
    }

    global.premium = isPremium;
    global.checkedStatus = true;
}

async function updateFreeRank(){
    let hasFreeKey = false
    let free_api_key = settings.free_api_key

    if(free_api_key){
        try {
            let status = (await axios.get(`https://www.bloxxy.net/api/linkvertise/status/${free_api_key}`)).data
    
            if(status){
                hasFreeKey = true

                await dbRunWithValues(`INSERT OR REPLACE INTO free_cache (value, date) VALUES (?, ?)`, ["true", Date.now()]);
            } else {
                await dbRunWithValues(`INSERT OR REPLACE INTO free_cache (value, date) VALUES (?, ?)`, ["false", Date.now()]);
            }
        } catch (err){
            console.error(err)
            const cacheData = await dbGet('SELECT * FROM free_cache LIMIT 1');

            if (cacheData) {
                if((cacheData.date + (1000 * 60 * 60 * 24 * 3)) >= Date.now() && cacheData.value == "true"){
                    hasFreeKey = true;
                }
            } 
        }
    }

    global.free_key = hasFreeKey;
    global.checkedStatus = true;
}

setTimeout(updatePremiumRank, 1000 * 60 * 15)
setTimeout(updateFreeRank, 1000 * 60 * 15)
updatePremiumRank()
updateFreeRank()

let lastKey = settings.api_key;
let lastFreeKey = settings.free_api_key;

global.premiumOnlyTitle = "This feature requires you to be a patreon subscriber"
global.premiumText = 
`you must be a subscriber on our <a style="color: #3498db; text-decoration: none; cursor: pointer; background-color: none; font-size: 1em;" href="">Patreon</a>.
After doing so, follow the "Full feature access" instructions in the settings tab.`

module.exports = async (req, res) => {
    settings = req.body
    settings.api_key = settings.api_key.trim()
    settings.free_api_key = settings.free_api_key.trim()

    if(lastKey !== settings.api_key){
        lastKey = settings.api_key
        updatePremiumRank()
    }

    if(lastFreeKey !== settings.free_api_key){
        lastFreeKey = settings.free_api_key
        updateFreeRank()
    }

    if(!global.premium){
        if(settings.concurrency > 3){
            await MessageUser({
                title: premiumOnlyTitle,
                text: `To be able to have more than 3 concurrect workers, \n${premiumText}`,
    
                button1text: "OK",
    
                secondButton: false,
            })
    
            settings.concurrency = 3;
        } 

        if(settings.auto_skip_ads == false){
            await MessageUser({
                title: premiumOnlyTitle,
                text: `To be able to watch the ads, \n${premiumText}`,
    
                button1text: "OK",
    
                secondButton: false,
            })
    
            settings.auto_skip_ads = true;
        }

        if(settings.use_AV1 == true){
            await MessageUser({
                title: premiumOnlyTitle,
                text: `To be able to use AV1, \n${premiumText}`,
    
                button1text: "OK",
    
                secondButton: false,
            })
    
            settings.use_AV1 = false;
        }
    }
    
    dbRunWithValues('UPDATE options SET data = ? WHERE id = 1', JSON.stringify(settings))
    res.sendStatus(201)

    io.emit("settings", settings)
}