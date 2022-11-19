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

# Bandwith usage
## Bandwith for initializing youtube
 * No cache direct watch: 7-12 mbits
 * Cache and direct watch: 0.8-3 mbits
 * direct watch (10 minutes): ~16.35 mbits
 * search + load: ~
 *

## Bandwith usage based on duration
 * 10 minutes: ~16.35 mbits
 * 1 minute: ~2.1 mbits
 * 5 minutes: ~
 * 25 minutes: ~ mbits

## Bandwith usage
 ###### Loading the pages
  - log in with cache:
  - log in with no cache:
  - watch page with no cache: ~11 mbits
  - watch page with cache: 0.8-3.3 mbits
  - search page with no cache:
  - search page with cache:
 ###### Video watching
  - 1 minute video: ~3.3 mbits
  - 5 minutes video: ~ mbits
  - 10 minutes video: ~16.35 mbits
  - 30 minutes video: ~ mbits