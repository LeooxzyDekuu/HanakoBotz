// © HanakoBotz
// • By: Leooxzy - Deku
// • Owner: 6283136099660

// By: Leooxzy
// Bio cr: Krz

const axios = require('axios');

module.exports = {
    command: "play",
    alias: [],
    category: ["downloader", "search"],
    settings: {
        limit: true
    },
    loading: true,
    async run(m, {
        sock,
        client,
        conn,
        Uploader,
        DekuGanz,
        Func,
        Scraper,
        text,
        config
    }) {
        if (!text) throw '⚠️Masukan Lagu Yg Anda Cari';
        const {
            all
        } = await require('yt-search')(text);
        if (!all && !all.length > 0) throw '⚠️Maaf Lagu Yg Anda Search Tidak Dapat Di Temukan';
        const search = all[0];

        let message = `🔎 Search YouTube
> • *Title:* ${search.title || ''}
> • *VideoId:* ${search.videoId || ''}
> • *Ago:* ${search.ago || ''}
> • *Url:* ${search.url || ''}`;

        await sock.sendMessage(m.cht, {
            text: message,
            contextInfo: {
                mentionedJid: [m.sender],
                isForwarded: !0,
                forwardingScore: 127,
                externalAdReply: {
                    title: search.title,
                    body: search.views + ' / ' + search.timestamp + ' / ' + search.author.name,
                    mediaType: 1,
                    thumbnailUrl: search.thumbnail,
                    renderLargerThumbnail: true,
                    sourceUrl: search.url
                }
            }
        }, {
            quoted: m
        });

        let audio;
        let format;
        try {
            const amdla = await Scraper.amdl(search.url, 'audio', '320k');
            format = '320kbps';
            audio = amdla.download;
        } catch (e) {
            try {
                const {
                    result: savetube
                } = await Scraper.SaveTube(search.url, "mp3");
                format = 'mp3';
                audio = savetube.download;
            } catch (e) {
                try {
                    const ddownra = await Scraper.ddownr.download(search.url, 'mp3');
                    format = 'mp3';
                    audio = ddownra.downloadUrl;
                } catch (e) {}
            }
        };

        const buff = await axios.get(audio, {
            responseType: 'arraybuffer'
        });
        const url = await Uploader.tmpfiles(buff.data);
        const size = await Func.getSize(url);

        const match = /(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([^\?&]+)(?:\?is=[^&]*)?(?:\?si=[^&]*)?(?:&.*)?/
        const getid = search.url.match(match);
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
    }
};
