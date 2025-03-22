/** *Plugin Whatmusic*
   * @Author: Deku
   * @Npm: @vioo/apis, path, file-type, fs
   * @Ch: https://whatsapp.com/channel/0029VadFS3r89inc7Jjus03W
**/

const vio = require('@vioo/apis');
const fs = require('fs')
const path = require('path');
const {
    fromBuffer
} = require("file-type");

let rin = async (m, {
    sock,
    client,
    conn,
    DekuGanz,
    Func,
    Scraper,
    text,
    config
}) => {
    if (!m.quoted) throw '⚠️ Reply Audio Pengen Di Cari Lagu Nya !'
    try {
        // Uploader
        const media = await m.quoted.download()
        const {
            ext,
            mime
        } = (await fromBuffer(media)) || {};
        const file = path.join(process.cwd() + '/tmp/' + Date.now() + `-tmpfiles.${ext}`);
        await fs.writeFileSync(file, media);
        const tmpfile = await vio.uploader.tempfiles(file);
         if (!tmpfile) throw '⚠️Gomene Error Tmpfile Nya😞'

        // Fungsi
        const whtm = await vio.tools.whatmusic(tmpfile);
         if (!whtm) throw '⚠️Gomene Error WhatMusic Nya😞'
        let cap = `ℹ️ Whatmusic\n`
        cap += `> • *Song:* ${whtm.title || ''}\n`
        cap += `> • *Artist:* ${whtm.artists || ''}\n`
        cap += `> • *Date:* ${whtm.release_date || ''}\n`
        cap += `> • *Spotify:* ${whtm.spotify.url || ''}\n`
        cap += `> • *Youtube:* ${whtm.youtube || ''}`
        m.reply(cap)

        // Delete File Tmp
        await fs.unlinkSync(file)
    } catch (err) {
        throw `gomene: ${err}`
    }
}

rin.command = "whatmusic"
rin.alias = ["whtm", "whatsong", "laguapa"]
rin.category = ["tools"]
rin.settings = {
    limit: true
}
rin.loading = true

module.exports = rin
