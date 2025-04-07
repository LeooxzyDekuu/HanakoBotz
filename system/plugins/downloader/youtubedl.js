// © HanakoBotz
// • By: Leooxzy - Deku
// • Owner: 6283136099660

// By: Leooxzy
// Bio cr: Krz

const axios = require('axios');

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
        Uploader,
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
            const match = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([^\?&]+)(?:\?is=[^&]*)?(?:\?si=[^&]*)?(?:&.*)?/;
            const getid = text.match(match)
            video = await require('yt-search')({
                videoId: getid[1],
                hl: 'id',
                gl: 'ID'
            });
        }

        client.yt[m.sender] = {
            url: video.url
        };

        const UrlYt = client.yt[m.sender].url || video.url
        let metadata = `> • Title: ${video.title}
> • Id: ${video.videoId || ''}
> • Ago: ${video.ago || ''}
> • Durasi: ${video.timestamp || ''}
> • Url: ${video.url || ''}
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
            let format;
            try {
                const amdla = await Scraper.amdl(finalUrl, 'audio', '320k');
                format = '320kbps';
                audio = amdla.download;
            } catch (e) {
                try {
                    const {
                        result: savetube
                    } = await Scraper.SaveTube(finalUrl, "mp3");
                    format = 'mp3'
                    audio = savetube.download;
                } catch (e) {
                    try {
                        const ddownra = await Scraper.ddownr.download(finalUrl, 'mp3');
                        format = 'mp3';
                        audio = ddownra.downloadUrl;
                    } catch (e) {}
                }
            }

            const buff = await axios.get(audio, {
                responseType: 'arraybuffer'
            });
            const url = await Uploader.tmpfiles(buff.data);
            const size = await Func.getSize(url);

            const match = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([^\?&]+)(?:\?is=[^&]*)?(?:\?si=[^&]*)?(?:&.*)?/
            const getid = finalUrl.match(match);
            const audioo = await require('yt-search')({
                videoId: getid[1],
                hl: 'id',
                gl: 'ID'
            });

            if (size > 100 * 1024 * 1024) {
                return sock.sendMessage(m.cht, {
                    document: {
                        url: audio
                    },
                    mimetype: "audio/mpeg",
                    fileName: `${audioo.title}.mp3`,
                }, {
                    quoted: await m.froll(config.owner[0], Func.Styles('Mendownload Audio YouTube'))
                });
            } else {
                return sock.sendMessage(m.cht, {
                    audio: {
                        url: audio
                    },
                    mimetype: "audio/mpeg",
                    contextInfo: {
                        mentionedJid: [m.sender],
                        isForwarded: !0,
                        forwardingScore: 127,
                        externalAdReply: {
                            title: audioo.title,
                            body: format + ' / ' + size + ' / ' + audioo.author.name,
                            mediaType: 1,
                            thumbnailUrl: audioo.thumbnail,
                            renderLargerThumbnail: false,
                            sourceUrl: audio
                        }
                    }
                }, {
                    quoted: await m.froll(config.owner[0], Func.Styles('Mendownload Audio YouTube'))
                });
            }
        } else if (isVideo) {
            const match = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([^\?&]+)(?:\?is=[^&]*)?(?:\?si=[^&]*)?(?:&.*)?/;
            const getid = finalUrl.match(match)
            const videoo = await yts({
                videoId: getid[1],
                hl: 'id',
                gl: 'ID'
            });

            let video;
            let format;
            try {
                const amdlv = await Scraper.amdl(finalUrl, 'video', '720p')
                format = '720p';
                video = amdlv.download
            } catch (e) {
                try {
                    const {
                        result: savetube
                    } = await Scraper.SaveTube(finalUrl, "720")
                    format = '720p';
                    video = savetube.download;
                } catch (e) {
                    try {
                        const ddownrv = await Scraper.ddownr.download(finalUrl, '720');
                        format = '720p';
                        video = ddownrv.downloadUrl;
                    } catch (e) {}
                }
            }

            const buff = await axios.get(video, {
                responseType: 'arraybuffer'
            });
            const url = await Uploader.tmpfiles(buff.data);
            const size = await Func.getSize(url);

            if (size > 100 * 1024 * 1024) {
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
                    caption: `📁 Download YouTube\n${metadata}> • Format: ${format}\n> • Size: ${size}`
                }, {
                    quoted: await m.froll(config.owner[0], Func.Styles('Mendownload Video YouTube'))
                });
            }
        }
        setTimeout(() => delete sock.yt[m.sender], 5000);
    }
}

module.exports = rinokumura
