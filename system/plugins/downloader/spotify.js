const fetch = require('node-fetch')
const canvafy = require('canvafy')
let rinokumura = {
    command: "spotify",
    alias: ["spdl"],
    category: ["downloader"],
    settings: {
        limit: true
    },
    loading: true,
    async run(m, {
        sock,
        client,
        conn,
        DekuGanz,
        Func,
        Scraper,
        text,
        config
    }) {
        if (!text) return m.reply('> masukan link/query')
        if (Func.isUrl(text)) {
            if (!/open.spotify.com/.test(text)) throw '⚠️ Maaf Link Yg Anda Masukan Failed'
            try {
                await fetch('https://spotifyapi.caliphdev.com/api/info/track?url=' + text).then(async (a) => {
                    let json = await a.json()
                    let caption = `📁 Download Spotify
> • Title: ${json.title}
> • Album: ${json.album}
> • Artist: ${json.artist}
> • Date: ${json.release_date}
> • Link: ${json.url}`
                    const spotify = await new canvafy.Spotify()
                        .setAuthor(json.artist)
                        .setAlbum(json.album)
                        .setTimestamp(121000, json.durationMs)
                        .setImage(json.thumbnail)
                        .setTitle(json.title)
                        .setBlur(5)
                        .setOverlayOpacity(0.7)
                        .build();
                    const image = await Func.fetchBuffer(json.thumbnail)
                    sock.sendMessage(m.cht, {
                        image: spotify,
                        caption
                    }, {
                        quoted: await m.froll(config.owner[0], Func.Styles('Spotify Downloader'), sock.resize(image, 300, 300))
                    })
                    sock.sendMessage(m.cht, {
                        audio: {
                            url: 'https://spotifyapi.caliphdev.com/api/download/track?url=' + json.url
                        },
                        mimetype: 'audio/mpeg',
                        contextInfo: {
                            mentionedJid: [m.sender],
                            isForwarded: !0,
                            forwardingScore: 127,
                            externalAdReply: {
                                title: json.title,
                                body: json.artist + ' / ' + json.release_date,
                                mediaType: 1,
                                thumbnailUrl: json.thumbnail,
                                renderLargerThumbnail: false,
                                sourceUrl: json.url
                            }
                        }
                    }, {
                        quoted: await m.froll(config.owner[0], Func.Styles('Spotify Downloader'), sock.resize(image, 300, 300))
                    })
                })
            } catch (err) {}
        } else if (text) {
            Scraper.spotify.search(text).then(async (a) => {
                let no = 1
                let captions = `🔍 Search Spotify\n\n`
                for (let i of a) {
                    captions += `Pilih Reply Nomor
[ ${no++} ]
> • Title: ${i.title}
> • Artist: ${i.artist}
> • Id: ${i.id}
> • Link: ${i.url}\n\n`
                }
                await sock.sendAliasMessage(m.cht, {
                    text: captions
                }, a.map((a, i) => ({
                    alias: `${i + 1}`,
                    response: `${m.prefix + m.command} ${a.url}`
                })), await m.froll());
            })
        } else m.reply('gagal dl sama metadata nya😂')
    }
}

module.exports = rinokumura
