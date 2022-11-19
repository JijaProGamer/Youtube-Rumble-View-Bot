<p align="center">
    <img alt="ViewCount" src="https://komarev.com/ghpvc/?username=JijaProGamer&color=green">
    <img alt="OS" src="https://img.shields.io/badge/OS-Windows%20/%20Linux-success">
    <img alt="Downloads" src="https://img.shields.io/github/downloads/JijaProGamer/youtubeWatchBot/total.svg">
    <a href="https://github.com/JijaProGamer/youtubeWatchBot/releases/latest">
    <img alt="release" src="https://img.shields.io/github/v/release/JijaProGamer/youtubeWatchBot?color=success">
</p>

# Youtube watch bot

NodeJS program for view botting, watch time botting, comment botting, and like botting
You can use it as a CLI, as a simple program or by using its API, with controll over every part of the program

## NOTE: If you are using bad/cheap proxyes your views may dissapear after a time, and youtube may close your monetization. Please don't get more than 10 views per video for one proxy and resedential proxies are reccommended.

# Requirements

 * NodeJS 16.17.1 (other versions not tested)
 * Connection speed of at least 1 mbps per connection, slower may have video buffering
 * Google chrome 107.0.5304.107 or later (NO OTHER BROWSER SUPPORTED OTHER THAN CHROME)
 * You should use resedential proxies, datacenter/ISP ones not recommended

# Features

 * Bypasess google bot detection
 * Spoofs IP, Geolocation, Timezone, Device size, Device information and hardware information
 * Can use multiple extensions
 * Watch video by direct search, alternate search (Removes keywords, removes letters for better SEO), embed,  subscribed page and channel pages
 * Extensive API for seeing stats about videos watched, and continous information about videos watched in progress
 * Save bandwith by setting video quality to lowest and disabling audio
 * Save even more bandwith by caching non-API calls and rejecting useless stylesheet and images
 * Can use external browsers for hundreds of views at the same time, or can use local browsers
 * Can set watchtime used, and can be changed while watching the video using the API
 * Can leave comment at specific watch time and like at specific watch time
 * http, https, socks4, socks5 proxy support
 * Can authentificate with premium proxies (user:password@ip:port and ip:port:user:pass)

# Rules
 * You should include search too, youtube may see users are bots if most of the views are direct links
 * Rotating proxies should use the same IP for one session, so set it as a sticky session

# Bandwith usage (Download) NOTE: saveBandwith set to true in all the tests
 * No userDataDir, direct watch: ~10 megabits page load and init
 * userDataDir, direct watch: ~0.8 to ~3.3 megabits page load and init
 * 10 minutes of video watching: ~16.35 mbits (Not including page load and init) 
 * 1 minute of video watching: ~2.1 mbits (Not including page load and init) 
 
## Total bandwith for worst-case no optimization scenario (10 minutes): ~26.35 mbits
## Total bandwith for best-case scenario (10 minutes video): ~17.85 mbits
## Total bandwith for worst-case scenario (No cache and search): 
## Total bandwith for best-case scenario (Cache and search):