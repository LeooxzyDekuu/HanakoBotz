const fetch = require('node-fetch');
const {
    extension
} = require("mime-types");

module.exports = {
    command: "gdrive",
    alias: [
        "googledrive",
        "gdrivedl"
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
        if (!/drive.google.com/.test(text)) throw '⚠️ Mana Link Google Drive Nya';
        const gd = await fetchJson('https://api.siputzx.my.id/api/d/gdrive?url=' + text);
        let data = await fetch(gd.data.download);
        let mime = data.headers.get("content-type")
        sock.sendMessage(m.cht, {
            document: {
                url: gd.data.download
            },
            mimetype: mime,
            fileName: Date.now() + '-Drive-Download.' + mime.split("/")[1],
            caption: 'done'
        }, {
            quoted: await m.froll()
        });
    }
};

const fetchJson = async (url) => {
    const response = await fetch(url);
    return response.json();
};
