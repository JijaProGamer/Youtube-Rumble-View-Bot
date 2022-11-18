const waitForSelector = (page, selector) => {
    return new Promise(async (resolve, reject) => {
        try {
            page.waitForSelector(selector, { visible: true }).then(async () => {
                const elements = await page.$$(selector)
                resolve(elements[0])
            }).catch((err) => {
                reject(err)
            })
        } catch (e) {
            const elements = await page.$$(selector)
            if (elements[0]) {
                resolve(elements[0])
            } else {
                reject(err)
            }
        }
    })
}

const waitForXPath = (page, xPath) => {
    return new Promise(async (resolve, reject) => {
        try {
            page.waitForXPath(xPath, { visible: true }).then(async () => {
                const elements = await page.$x(xPath)
                resolve(elements[0])
            }).catch((err) => {
                reject(err)
            })
        } catch (e) {
            const elements = await page.$x(xPath)
            if (elements[0]) {
                resolve(elements[0])
            } else {
                reject(err)
            }
        }
    })
}

const clickSelector = async (page, selector) => {
    return new Promise((resolve, reject) => {
        waitForSelector(page, selector).then(async (element) => {
            await element.click()
            resolve()
        }).catch(err => {
            reject(err)
        })
    })
}

const clickXPath = async (page, XPath) => {
    return new Promise((resolve, reject) => {
        waitForXPath(page, XPath).then(async (element) => {
            await element.click()
            resolve()
        }).catch(err => {
            reject(err)
        })
    })
}

const typeXPath = async (page, XPath, text) => {
    return new Promise((resolve, reject) => {
        waitForXPath(page, XPath).then(async (element) => {
            await element.focus()
            await page.keyboard.type(text, { delay: 25 })

            resolve()
        }).catch(err => {
            reject(err)
        })
    })
}
const typeSelector = async (page, selector, text) => {
    return new Promise((resolve, reject) => {
        waitForSelector(page, selector).then(async (element) => {
            await element.focus()
            await page.keyboard.type(text, { delay: 25 })

            resolve()
        }).catch(err => {
            reject(err)
        })
    })
}


const goto = (page, website, tryNum) => {
    return new Promise(async (resolve, reject) => {
        try {
            page.goto(website, { waitUntil: "networkidle2" }).then(() => {
                resolve()
            }).catch(async (err) => {
                if (tryNum <= 10) {
                    await goto(page, website, tryNum + 1);
                    resolve()
                } else {
                    reject(`Too many goto tries | ${err}`)
                }
            })
        } catch (err) {
            if (tryNum <= 10) {
                await goto(page, website, tryNum + 1);
                resolve()
            } else {
                reject(`Too many goto tries | ${err}`)
            }
        }
    })
}

const uploadFileSelector = async (page, selector, file) => {
    const [fileChooser] = await Promise.all([
        page?.waitForFileChooser(),
        clickSelector(page, selector),
    ])

    await fileChooser?.accept([file])
}

const uploadFileXPath = async (page, XPath, file) => {
    const [fileChooser] = await Promise.all([
        page?.waitForFileChooser(),
        clickXPath(page, XPath),
    ])

    await fileChooser?.accept([file])
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

module.exports = {
    uploadFileXPath,
    uploadFileSelector,
    clickSelector,
    clickXPath,
    goto,
    waitForSelector,
    waitForXPath,
    typeSelector,
    typeXPath,
    sleep,
}