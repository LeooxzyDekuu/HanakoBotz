// © HanakoBotz
// • By: Leooxzy - Deku
// • Owner: 6283136099660

// By: Leooxzy
// Bio cr: Krz

const {
    writeExif
} = require(process.cwd() + "/lib/sticker");
const axios = require("axios");

let deku = async (m, {
    sock,
    Func,
    Scraper,
    Uploader,
    store,
    text,
    config
}) => {
    if (!text) throw "> Masukan pesan nya";
    if (text.length > 10000) throw "Maximal 10000 karakter!"
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || "";
    const pp = await sock
        .profilePictureUrl(q.sender, "image")
        .catch(() => "");
    const obj = {
        type: "quote",
        format: "png",
        backgroundColor: "#2c7355",
        width: 512,
        height: 768,
        scale: 2,
        messages: [{
            entities: [],
            media: mime ? {
                url: await Uploader.Uguu(img)
            } : undefined,
            avatar: true,
            from: {
                id: m.cht.split("@")[0],
                name: await sock.getName(q.sender),
                photo: {
                    url: pp
                },
            },
            text: text,
            replyMessage: {},
        }],
    };

    const json = await axios.post(
        "https://qc.botcahx.eu.org/generate",
        obj, {
            headers: {
                "Content-Type": "application/json"
            },
        }
    );

    const buffer = Buffer.from(json.data.result.image, "base64");
    const sticker = await writeExif({
        mimetype: "image",
        data: buffer,
    }, {
        packName: config.sticker.packname,
        packPublish: config.sticker.author,
    });
    m.reply({
        sticker
    });
}

deku.command = "quote"
deku.alias = ["qc"]
deku.category = ["tools"]
deku.settings = {
    limit: true
}
deku.description = "Membuat Bubble Chat"
deku.loading = true

module.exports = deku
