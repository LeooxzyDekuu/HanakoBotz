// © HanakoBotz
// • By: Leooxzy - Deku
// • Owner: 6283136099660

// By: Leooxzy
// Bio cr: Krz

const fs = require('fs');
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
    if (!quoted.msg.mimetype) throw '⚠️ Maaf Anda Ga Kirim/Reply Gambar Buat Nyari Anime !'
    if (/image|jpeg|png/.test(quoted.msg.mimetype)) {
        try {
            const media = await quoted.download();
            const {
                ext,
                mime
            } = (await fromBuffer(media)) || {};
            const file = path.join(process.cwd() + '/tmp/' + Date.now() + `-tmp.${ext}`);
            await fs.writeFileSync(file, media);
            const buff = fs.readFileSync(file);
            const result = await Scraper.karakterinfo(buff).then(a => a.data);
            const fixed = num => (num * 100).toFixed(2);
            let cap = `ℹ️ Info Karakter
> • Name: ${result.character.name ? result.character.name : ''}
> • Persen: ${fixed(result.character.list[0].confidence ? result.character.list[0].confidence : 0)}% ${result.character.list.length >= 2 ? `ℹ️Karakter lain yang terdeksi*\n${result.character.list.map((it,mp) => `> *Nama:* ${it.label ? it.label : ''}\n> • *Persentase:* ${fixed(it.confidence ? it.confidence : 0)}%`).join('\n\n')}` : ''}

*💫 Prompt*
> • *${result.prompt ? result.prompt : ''}*

*📈 Ranting*
${result.rating.map((it, sd) => `> • *${it.label ? it.label : ''}:* ${fixed(it.confidence ? it.confidence : 0)}%`).join('\n')}

*# Tags*
${result.tags.list.map((it, sd) => `> • *${it.label}:* ${fixed(it.confidence ? it.confidence : 0)}%`).join('\n')}`
            m.reply(`${cap}`);

            await fs.unlinkSync(file);
        } catch (e) {
            m.reply(`${e}`)
        }
    }
}

rin.command = "animefind"
rin.alias = ["infocharacter", "infochr"]
rin.category = ["tools"]
rin.settings = {
    limit: true
}
rin.loading = true

module.exports = rin
