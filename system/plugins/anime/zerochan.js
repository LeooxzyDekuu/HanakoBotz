module.exports = {
    command: "zerochan",
    alias: ["zero", "zeroch", "zrch"],
    category: ["anime"],
    settings: {
        limit: true,
    },
    description: "Search Anime Foto",
    loading: true,
    async run(m, {
        sock,
        Func,
        Scraper,
        text,
        config
    }) {
        if (!text) throw '⚠️ Masukan Query/Link Tapi Karakter Anime'
        if (Func.isUrl(text)) {
            if (!/www.zerochan.net/.test(text)) throw '⚠️Mana Link ZeroChan Nya !'
            let detail = await Scraper.zerochan.detail(text)
            if (!detail) throw '⚠️ Maaf Error Yg Di Download'
            let capt = `📁 Download ZeroChan\n`
            capt += `> • *Title:* ${detail.title}\n`
            capt += `> • *Link:* ${text}`
            sock.sendMessage(m.cht, {
                image: {
                    url: detail.downloadLink
                },
                caption: capt
            }, {
                quoted: m
            })
        } else {
            let search = await Scraper.zerochan.search(text)
            if (!search && !search.length > 0) throw '⚠️ Maaf Pencarian Anda Tidak Di Temukan'
            let zid = search[Math.floor(Math.random() * search.length)]
            let detail = await Scraper.zerochan.detail(zid.id)
            if (!detail) throw '⚠️ Maaf Error Yg Di Download'
            let capt = `🔍 Search ZeroChan\n`
            capt += `> • *Title:* ${detail.title}\n`
            capt += `> • *Link:* ${zid.id}`

            await sock.sendAliasMessage(m.cht, {
                image: {
                    url: detail.downloadLink
                },
                caption: capt,
            }, [{
                alias: 'next',
                response: '.zerochan ' + text
            }, {
                alias: 'lanjut',
                response: '.zerochan ' + text
            }], m)
        }
    }
}
