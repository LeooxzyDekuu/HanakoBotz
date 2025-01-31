const axios = require("axios");
const yts = require('yt-search')
const ytdl = require('ytdl-core')

let deku = async (m, {
    sock,
    Func,
    Scraper,
    Uploader,
    store,
    text,
    config
}) => {

    if (!text.includes('youtu')) throw "Link Contoh .ytmp3 <link>";
    const videoId = await ytdl.getURLVideoID(text)
    let result = await yts({
        videoId: videoId,
        hl: 'id',
        gl: 'ID'
    })

    if (!result.url || !result) {
        m.reply(Func.Styles('maaf ga ketemu...'))
    }

    let hah = result.url;
    let deku = Func.Styles(`⏤͟͟͞͞╳── *[ ytv - download ]* ── .々─ᯤ\n`)
    deku += `│    =〆 ᴛɪᴛʟᴇ: ${result.title}\n`
    deku += `│    =〆 ɪᴅ: ${result.videoId}\n`
    deku += `│    =〆 ᴅᴜʀᴀsɪ: ${result.timestamp}\n`
    deku += `│    =〆 ᴀɢᴏ: ${result.ago}\n`
    deku += `│    =〆 ᴅᴇsᴄʀɪᴘᴛɪᴏɴ: ${result.description}\n`
    deku += `│    =〆 ᴜʀʟ: ${result.url}\n`
    deku += `⏤͟͟͞͞╳────────── .✦`

    await sock.sendMessage(m.cht, {
        text: deku,
        contextInfo: {
            forwardingScore: 999,
            isForwarded: true,
            externalAdReply: {
                title: result.title,
                mediaType: 1,
                previewType: 1,
                body: `Durasi : ${result.timestamp} / View : ${result.views}`,
                thumbnailUrl: result.image,
                renderLargerThumbnail: true,
                mediaUrl: result.url,
                sourceUrl: result.url
            }
        }
    }, {
        quoted: m
    });

    let capt = ` =〆 ᴛɪᴛʟᴇ: ${result.title}\n`
    capt += ` =〆 ɪᴅ: ${result.videoId}\n`
    capt += ` =〆 ᴅᴜʀᴀsɪ: ${result.timestamp}\n`
    capt += ` =〆 ᴀɢᴏ: ${result.ago}\n`
    capt += ` =〆 ᴜʀʟ: ${result.url}`
    try {
        const {
            result
        } = await Scraper.y2ts.dl(text)

        await sock.sendMessage(m.cht, {
            video: {
                url: result.mp4
            },
            caption: capt
        }, {
            quoted: m
        })
    } catch (err) {
        try {
            const {
                result
            } = await Scraper.y2ts.dl(text)

            sock.sendMessage(m.cht, {
                document: {
                    url: result.mp4
                },
                mimetype: 'video/mp4',
                fileName: result.title + '.mp4'
            }, {
                quoted: m
            })
        } catch (err) {
            try {
                const {
                    downloadUrl
                } = await Scraper.ddownr.download(text, '720')

                await sock.sendMessage(m.cht, {
                    video: {
                        url: downloadUrl
                    },
                    caption: capt
                }, {
                    quoted: m
                })
            } catch (err) {
                try {
                    const {
                        downloadUrl
                    } = await Scraper.ddownr.download(text, '720')

                    sock.sendMessage(m.cht, {
                        document: {
                            url: downloadUrl
                        },
                        mimetype: 'video/mp4',
                        fileName: result.title + '.mp4'
                    }, {
                        quoted: m
                    })
                } catch (err) {
                    m.reply('error' + err)
                }
            }
        }
    }
    m.react('✅')
}

deku.command = "ytmp4"
deku.alias = ["ytv", "yt-video"]
deku.category = ["downloader"]
deku.settings = {
    limit: true
}
deku.description = "Mendownload YouTube Video"
deku.loading = true

module.exports = deku