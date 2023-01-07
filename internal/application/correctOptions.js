const fs = require("fs");
const path = require("path")
const to = require("await-to-js").to;

const idValid = require("./idValid.js");
const checkProxy = require("./testProxy.js");
const create_job = require("./create_job");


module.exports = () => {
  return new Promise(async (resolve) => {
    if (!global.options.browserPath) {
    } else {
      if (!fs.existsSync(global.options.browserPath)) {
      }
    }

    global.options.proxies = global.options.proxies.filter((v) => v.length > 5);
    global.options.proxies = [...new Set(global.options.proxies)];

    for (let [index, proxy] of global.options.proxies.entries()) {
      if (proxy.length > 5) {
        let breaks = proxy.split(":");
        if (breaks.length == 4) {
          global.options.proxies[
            index
          ] = `${breaks[2]}:${breaks[3]}@${breaks[0]}:${breaks[1]}`;
        }
      }
    }

    let newVideos = [];
    let newProxies = [];

    if (global.options.proxies && global.options.proxies.length > 0) {
      for (let [index, proxy] of global.options.proxies.entries()) {
        let data = {
          type: "add_testing_proxy",
          data: proxy,
        };

        global.proxy_stats.untested.push(data);
        io.sockets.write(data);
      }

      for (let [index, proxy] of global.options.proxies.entries()) {
        if (global.options.disable_proxy_tests) {
          let data2 = {
            type: "add_good_proxy",
            latency: 0,
            data: proxy,
          };

          global.proxy_stats.untested = global.proxy_stats.untested.filter(
            (v) => v.data !== proxy
          );
          global.proxy_stats.good.push(data2);
          io.sockets.write(data2);
        } else {
          global.log(`Started checking proxy ${proxy}`);

          if (global.good_proxies.includes(proxy)) {
            newProxies.push(proxy);
            global.log(`Proxy ${proxy} is good, taken from cache`);

            let data2 = {
              type: "add_good_proxy",
              latency: 0,
              data: proxy,
            };

            global.proxy_stats.untested = global.proxy_stats.untested.filter(
              (v) => v.data !== proxy
            );
            global.proxy_stats.good.push(data2);
            global.good_proxies.push(proxy);
            io.sockets.write(data2);
          } else {
            let [err, sucess2] = await to(checkProxy(proxy, index));

            if (sucess2) {
              newProxies.push(proxy);
              global.log(
                `Proxy ${proxy} is good, speeds of ${sucess2.latency}ms`
              );

              let data2 = {
                type: "add_good_proxy",
                latency: sucess2.latency,
                data: proxy,
              };

              global.proxy_stats.untested = global.proxy_stats.untested.filter(
                (v) => v.data !== proxy
              );
              global.proxy_stats.good.push(data2);
              global.good_proxies.push(proxy);
              io.sockets.write(data2);

              fs.writeFileSync(
                path.join(__dirname, "../../UDATA/ALV_PRX"),
                JSON.stringify(newProxies),
                "utf-8"
              );
            } else {
              global.log(
                `Proxy ${proxy} failed because of ${err.error}`,
                "error"
              );

              let data = {
                type: "add_bad_proxy",
                error: err,
                data: proxy,
              };

              global.proxy_stats.untested = global.proxy_stats.untested.filter(
                (v) => v.data !== proxy
              );
              global.proxy_stats.bad.push(data);
              io.sockets.write(data);
            }
          }
        }
      }

      global.options.proxies = newProxies;
    } else {
      let data = {
        type: "add_testing_proxy",
        data: proxy,
      };

      global.proxy_stats.untested.push(data);
      io.sockets.write(data);

      let data2 = {
        type: "add_good_proxy",
        latency: 0,
        data: proxy,
      };

      global.proxy_stats.good.push(data2);
      io.sockets.write(data2);

      global.options.proxies = ["direct://"];
    }

    for (let video of global.options.videos) {
      if (video.id.includes("/")) {
        let url = new URL(video.id);
        if (url.pathname.includes("shorts")) {
          video.id = url.pathname.split("/")[2];
        } else if (url.pathname.includes("watch")) {
          video.id = url.searchParams.get("v");
        }
      }

      let [err, sucess] = await to(idValid(video.id));

      if (sucess) {
        newVideos.push(video);
      }
    }

    for (let video of newVideos) {
      for (let view = 0; view < video.guest_views || 0; view++) {
        await create_job(video, undefined);
      }

      for (let account of video.accounts || []) {
        await create_job(video, account);
      }
    }

    resolve();
  });
};
