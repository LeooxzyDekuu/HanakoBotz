// © HanakoBotz
// • By: Leooxzy - Deku
// • Owner: 6283136099660

// By: Leooxzy
// Bio cr: Krz

let Rin = async (m, {
    sock,
    client,
    conn,
    DekuGanz,
    Func,
    Scraper,
    text,
    config
}) => {
    if (!text) throw '⚠️Masukan Query/Link Bstationnya !';
    if (Func.isUrl(text)) {
        if (!/www.bilibili.tv/.test(text) && !/bilibili.tv/.test(text)) throw '⚠️Mana Link Bstation nya !';
        const {
            key
        } = await sock.sendMessage(m.cht, {
            text: 'Please Wait.... Loading Downloader Bilibili nya⌛'
        }, {
            quoted: m
        });
        try {
            const cobalt = await Scraper.cobalt(text, 'video', '720');

            const replydone = await sock.sendMessage(m.cht, {
                text: 'Selesai Downloader, Bilibili Nya✅',
                edit: key
            }, {
                quoted: m
            });
            if (cobalt.data.buffer > 100 * 1024 * 1024) {
                await sock.sendMessage(m.cht, {
                    document: cobalt.data.buffer,
                    caption: 'File Size Besar Mending Pake Document :v',
                    fileName: cobalt.data.fileName
                }, {
                    quoted: replydone
                });
            } else {
                await sock.sendMessage(m.cht, {
                    video: cobalt.data.buffer,
                    caption: 'filename: ' + cobalt.data.fileName,
                    fileName: cobalt.data.fileName
                }, {
                    quoted: replydone
                });
            }
        } catch (err) {
            console.error(err)
            await sock.sendMessage(m.cht, {
                text: '❌Error Bang Mungkin Dari Cobalt/Convert Cek Di Console',
                edit: key
            }, {
                quoted: m
            });
        }
    } else {
        let {
            data: search
        } = await Scraper.bstation(text);
        if (!search && !search.length > 1) throw '⚠️ Maaf Yg Di Search Tidak Di Ketemukan';
        let caption = '🔍 Search Bstation\n';
        caption += search.map((a, i) => `\`[ ${i + 1} ]\`\n> • Title: ${a.title}\n> • Id: ${a.id}\n> • View: ${a.view}\n> • Duration: ${a.duration}\n> • Url: ${a.url}`).join(`\n\n`);

        await sock.sendAliasMessage(m.cht, {
            text: caption
        }, search.map((a, i) => ({
            alias: `${i + 1}`,
            response: `${m.prefix + m.command} ${a.url}`
        })), m);
    };
};

Rin.command = "bilibili";
Rin.alias = ["bstation", "bilidl"];
Rin.category = ["downloader"];
Rin.settings = {
    limit: true
};
Rin.loading = true;

module.exports = Rin;
