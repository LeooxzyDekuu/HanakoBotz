/** *Plugin Hytamkan Waifu*
   * @Author: Deku
   * @Api: https://api.hiuraa.my.id/
   * @Npm: @vioo/apis, path, file-type, fs
   * @Ch: https://whatsapp.com/channel/0029VadFS3r89inc7Jjus03W
**/

const axios = require('axios');
const fs = require('fs');
const vio = require('@vioo/apis')
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
    const quoted = m.quoted ? m.quoted : m;
    if (!quoted.msg.mimetype) return m.reply('⚠️ Kirim/Reply Gambar Waifu Mu Buat Di Hytamkan😂');
    if (/image|jpeg|png/.test(quoted.msg.mimetype)) {
        try {
            const media = await quoted.download();
            const {
                ext,
                mime
            } = (await fromBuffer(media)) || {};
            const file = path.join(process.cwd() + '/tmp/' + Date.now() + `-tmpfiles.${ext}`);
            await fs.writeFileSync(file, media);
            const tmpfile = await vio.uploader.tempfiles(file);
            const api = await axios.post(`https://api.hiuraa.my.id/ai/gemini-canvas?text=Make+this+skin+black&imageUrl=${tmpfile}`);
            const {
                result: result
            } = api.data;
            const hytamkan = Buffer.from(result.image.base64, 'base64');
            sock.sendMessage(m.cht, {
                image: hytamkan,
                caption: 'Penghytaman Nya😂'
            }, {
                quoted: await m.froll()
            });
        } catch (e) {
            m.reply(`${e}`);
        };
    };
};

rin.command = "hitamkan";
rin.alias = ["hytamkan", "hytamkanwaifu"];
rin.category = ["tools"];
rin.settings = {
    limit: true
};
rin.loading = true;

module.exports = rin;
