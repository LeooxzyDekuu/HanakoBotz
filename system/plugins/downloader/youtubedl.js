const dist = require('@distube/ytdl-core')
const yts = require('yt-search')
const fetch = require("node-fetch");

let rinokumura = {
    command: "ytdl",
    alias: [
        "youtubedl",
        "youtubedownload",
        "ytdownload"
    ],
    category: [
        "downloader"
    ],
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
        client.yt = client.yt || {}
        if (!text.includes('youtu')) throw '⚠️ mana link youtube nya'
        let isAudio = text.includes("--audio")
        let isVideo = text.includes("--video")

        let videoUrl;
        if (text.startsWith("http")) {
            const getid = await dist.getVideoID(text);
            video = await yts({
                videoId: getid,
                hl: 'id',
                gl: 'ID'
            });
        }

        client.yt[m.sender] = {
            url: video.url
        };

        const UrlYt = client.yt[m.sender].url || video.url
        let metadata = `> • Title: ${video.title}
> • Id: ${video.videoId}
> • Ago: ${video.ago}
> • Durasi: ${video.timestamp}
> • Url: ${video.url}
`
        let infoMessage = `📁 Download YouTube
${metadata}

 ℹ️ Pilih Options
> • 1. video download 
> • 2. audio download`

        if (!isAudio && !isVideo) {
            await client.sendAliasMessage(m.cht, {
                image: {
                    url: video.thumbnail
                },
                caption: infoMessage
            }, [{
                alias: `1`,
                response: `${m.prefix + m.command} ${UrlYt} --video`
            }, {
                alias: `2`,
                response: `${m.prefix + m.command} ${UrlYt} --audio`
            }], await m.froll());
        }

        const finalUrl = client.yt[m.sender].url || video.url

        if (isAudio) {
            let audio;
            try {
                const amdla = await Scraper.amdl(finalUrl, 'audio', '320k')
                audio = amdla.download
            } catch (e) {
                try {
                    const {
                        result: savetube
                    } = await Scraper.SaveTube(finalUrl, "mp3")
                    audio = savetube.download;
                } catch (e) {
                    try {
                        const ddownra = await Scraper.ddownr.download(finalUrl, 'mp3');
                        audio = ddownra.downloadUrl;
                    } catch (e) {}
                }
            }

            const getid = await dist.getVideoID(finalUrl);
            const audiom = await yts({
                videoId: getid,
                hl: 'id',
                gl: 'ID'
            });

            const sizea = await Func.getSize(audio)
            if (sizea > 100 * 1024 * 1024) {
                return sock.sendMessage(m.cht, {
                    document: {
                        url: audio
                    },
                    mimetype: "audio/mpeg",
                    fileName: `${audiom.title}.mp3`,
                }, {
                    quoted: await m.froll(config.owner[0], Func.Styles('Mendownload Audio YouTube'))
                });
            } else {
                return sock.sendMessage(m.cht, {
                    audio: {
                        url: audio
                    },
                    mimetype: "audio/mpeg",
                }, {
                    quoted: await m.froll(config.owner[0], Func.Styles('Mendownload Audio YouTube'))
                });
            }
        } else if (isVideo) {

            const getid = await dist.getVideoID(finalUrl);
            const videom = await yts({
                videoId: getid,
                hl: 'id',
                gl: 'ID'
            });

            let video;
            try {
                const amdlv = await Scraper.amdl(finalUrl, 'video', '720p')
                video = amdlv.download
            } catch (e) {
                try {
                    const {
                        result: savetube
                    } = await Scraper.SaveTube(finalUrl, "720")
                    video = savetube.download;
                } catch (e) {
                    try {
                        const ddownrv = await Scraper.ddownr.download(finalUrl, '720');
                        video = ddownrv.downloadUrl;
                    } catch (e) {}
                }
            }

            let response = await fetch(video, {
                method: "HEAD"
            });
            let fileSizeInBytes = parseInt(response.headers.get("content-length"));
            if (fileSizeInBytes > 100 * 1024 * 1024) {
                return sock.sendMessage(m.cht, {
                    document: {
                        url: video
                    },
                    mimetype: "video/mp4",
                    fileName: `${videom.title}.mp4`,
                }, {
                    quoted: await m.froll(config.owner[0], Func.Styles('Mendownload Video YouTube'))
                });
            } else {
                return sock.sendMessage(m.cht, {
                    video: {
                        url: video
                    },
                    mimetype: "video/mp4",
                    caption: `📁 Download YouTube\n${metadata}`
                }, {
                    quoted: await m.froll(config.owner[0], Func.Styles('Mendownload Video YouTube'))
                });
            }
        }
        setTimeout(() => delete sock.yt[m.sender], 5000);
    }
}

module.exports = rinokumura
