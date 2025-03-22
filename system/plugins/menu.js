const moment = require("moment-timezone");
const axios = require('axios');
const fs = require('node:fs')
const path = require("node:path");
const process = require('process');
const {
    exec,
    spawn,
    execSync
} = require('child_process');
const child_process = require('child_process');
const os = require('os');
const speed = require('performance-now');
const osu = require('node-os-utils');
const pkg = require(process.cwd() + "/package.json")

let deku = async (m, {
    sock,
    Func,
    Scraper,
    plugins,
    Uploader,
    store,
    text,
    config
}) => {
    const more = String.fromCharCode(8206);
    const readmore = more.repeat(4001);
    let platform = os.platform()
    let d = new Date(new Date + 3600000)
    let locale = 'id'
    let date = d.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'Asia/Jakarta'
    })

    const hanakoai = await Scraper.aiMenu(`Hanako Kamu Menyapa ${m.pushName}-san/kun dan sesuai jam ini ya kek gini halo ${m.pushName}-san/kun gitu`, `Kamu Adalah Ai Hanako-Kun Dari Anime Jibaku Shounen Hanako Kun Kamu Bisa Bahasa Indonesia + Bahasa Jepang Kek Anime Gitu + Bergaulan + Emoticon + Emoji`)

    let runtime = speed()
    let totalreg = Object.keys(db.list().user).length
    let data = fs.readFileSync(process.cwd() + "/system/case.js", "utf8");
    let casePattern = /case\s+"([^"]+)"/g;
    let matches = data.match(casePattern);
    if (!matches) return m.reply("Tidak ada case yang ditemukan.");
    matches = matches.map((match) => match.replace(/case\s+"([^"]+)"/, "$1"));
    let menu = {};
    plugins.forEach((item) => {
        if (item.category && item.command && item.alias) {
            item.category.forEach((cat) => {
                if (!menu[cat]) {
                    menu[cat] = {
                        command: [],
                    };
                }
                menu[cat].command.push({
                    name: item.command,
                    alias: item.alias,
                    description: item.description,
                    settings: item.settings,
                });
            });
        }
    });
    let cmd = 0;
    let alias = 0;
    let pp = await sock
        .profilePictureUrl(m.sender, "image")
        .catch((e) => "https://files.catbox.moe/8getyg.jpg");
    Object.values(menu).forEach((category) => {
        cmd += category.command.length;
        category.command.forEach((command) => {
            alias += command.alias.length;
        });
    });

    if (Object.keys(menu).find((a) => a === text.toLowerCase())) {
        let list = menu[Object.keys(menu).find((a) => a === text.toLowerCase())];
        let caption = Func.Styles(`${hanakoai}${readmore}

⏤͟͟͞͞╳── *[ ɪɴғᴏ - ᴜsᴇʀ ]* ── .々─ᯤ
│    =〆 ɴᴀᴍᴇ: ${m.pushName}
│    =〆 ɴᴏᴍᴏʀ: @${m.sender.split('@')[0]}
│    =〆 ʟɪᴍɪᴛ: ${db.list().user[m.sender].limit}
⏤͟͟͞͞╳────────── .✦
│
⏤͟͟͞͞╳── *[ ʙᴏᴛ - ɪɴғᴏ ]* ── .々─ᯤ
│    =〆 ʀᴜɴᴛɪᴍᴇ: ${runtime}
│    =〆 ᴛʏᴘᴇ: ᴄᴀsᴇ x ᴘʟᴜɢɪɴ
│    =〆 ᴜsᴇʀ: ${totalreg}
│    =〆 ᴍᴏᴅᴇ: ${db.list().settings.self ? 'sᴇʟғ' : `ᴘᴜʙʟɪᴄ`}
│    =〆 version: ${pkg.version}
│    =〆 ᴘʀᴇғɪx: ${m.prefix}
│    =〆 ᴅᴀᴛᴇ: ${date}
⏤͟͟͞͞╳────────── .✦
│
⏤͟͟͞͞╳── *[ Menu – ${text.toUpperCase()} ]* ── .々─ᯤ
${list.command
  .map(
    (a, i) =>
      `│    =〆 ${m.prefix + a.name} ${a.settings?.premium ? "🥇" : a.settings?.limit ? "🥈" : ""}`,
  )
  .join("\n")}
⏤͟͟͞͞╳────────── .✦
`);


        await sock.sendMessage(m.cht, {
            video: {
                url: "https://files.catbox.moe/f1l5ij.mp4"
            },
            caption: caption,
            gifPlayback: true,
            contextInfo: {
                mentions: [m.sender],
                isForwarded: !0,
                forwardingScore: 127,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.saluran,
                    newsletterName: `${config.name} | ` + date,
                    serverMessageId: -1
                },
                externalAdReply: {
                    title: `々 ${config.ownername2} | ${config.name}`,
                    body: `${config.ownername2} | ` + date,
                    mediaType: 1,
                    thumbnail: fs.readFileSync('./image/DekuThumb.jpg'),
                    renderLargerThumbnail: false,
                    sourceUrl: "https://www.tiktok.com/@leooxzy_ganz/",
                }
            }
        }, {
            quoted: await m.froll()
        })
    } else if (text === "case") {
        let data = fs.readFileSync(process.cwd() + "/system/case.js", "utf8");
        let casePattern = /case\s+"([^"]+)"/g;
        let matches = data.match(casePattern);
        if (!matches) throw "Tidak ada case yang ditemukan."
        matches = matches.map(match => match.replace(/case\s+"([^"]+)"/, "$1"));

        let caption = Func.Styles(`${hanakoai}${readmore}

⏤͟͟͞͞╳─ \`[ ɪɴғᴏ - ᴜsᴇʀ ]\` ── .々─ᯤ
> ɴᴀᴍᴇ: ${m.pushName}
> ɴᴏᴍᴏʀ: @${m.sender.split('@')[0]}
> ʟɪᴍɪᴛ: ${db.list().user[m.sender].limit}

⏤͟͟͞͞╳─ \`[ informasi - bot ]\` ── .々─ᯤ
> ᴜsᴇʀ: ${totalreg}
> ᴍᴏᴅᴇ: ${db.list().settings.self ? 'sᴇʟғ' : `ᴘᴜʙʟɪᴄ`}
> version: ${pkg.version}
> ᴘʀᴇғɪx: ${m.prefix}
> ᴅᴀᴛᴇ: ${date}
${readmore}
⏤͟͟͞͞╳── *[ Menu Case ]* ── .々─ᯤ
${matches.map((a, i) => `│    =〆 ${m.prefix + a}`).join("\n")}
⏤͟͟͞͞╳────────── .✦

Kalau Error Bisa Hubungi Ke .owner gass`);

        await sock.sendMessage(m.cht, {
            video: {
                url: "https://files.catbox.moe/f1l5ij.mp4"
            },
            caption: caption,
            gifPlayback: true,
            contextInfo: {
                mentions: [m.sender],
                isForwarded: !0,
                forwardingScore: 127,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.saluran,
                    newsletterName: `${config.name} | ` + date,
                    serverMessageId: -1
                },
                externalAdReply: {
                    title: `々 ${config.ownername2} | ${config.name}`,
                    body: `${config.ownername2} | ` + date,
                    mediaType: 1,
                    thumbnail: fs.readFileSync('./image/DekuThumb.jpg'),
                    renderLargerThumbnail: false,
                    sourceUrl: "https://www.tiktok.com/@leooxzy_ganz/",
                }
            }
        }, {
            quoted: await m.froll()
        })
    } else if (text === "list") {
        let list = Object.keys(menu);
        const xmenu_oh = `${hanakoai}${readmore}

⏤͟͟͞͞╳─ \`[ ɪɴғᴏ - ᴜsᴇʀ ]\` ── .々─ᯤ
> ɴᴀᴍᴇ: ${m.pushName}
> ɴᴏᴍᴏʀ: @${m.sender.split('@')[0]}
> ʟɪᴍɪᴛ: ${db.list().user[m.sender].limit}

⏤͟͟͞͞╳─ \`[ informasi - bot ]\` ── .々─ᯤ
> ᴜsᴇʀ: ${totalreg}
> ᴍᴏᴅᴇ: ${db.list().settings.self ? 'sᴇʟғ' : `ᴘᴜʙʟɪᴄ`}
> version: ${pkg.version}
> ᴘʀᴇғɪx: ${m.prefix}
> ᴅᴀᴛᴇ: ${date}
${readmore}
⏤͟͟͞͞╳── \`[ ᴘᴇɴᴛᴜɴᴊᴜᴋ ]\` ── .々─ᯤ
│    =〆 ${m.prefix}allmenu
│    =〆 ${m.prefix}menu list
│    =〆 ${m.prefix}menu case
${list.map((a) => `│    =〆 ${m.prefix + m.command} ${a}`).join("\n")}
⏤͟͟͞͞╳────────── .✦

Kalau Error Bisa Hubungi Ke .owner gass`


        let sections = [{
                title: '<!> Informasi Bot',
                rows: [{
                        title: 'Script🗒️',
                        description: `Menampilkan pesan Script`,
                        id: `${m.prefix}sc`
                    },
                    {
                        title: 'tqto👤',
                        description: `Menampilkan pesan thank you to`,
                        id: `${m.prefix}ping`
                    },
                    {
                        title: 'Creator 👑',
                        description: `Menampilkan pesan thank you to`,
                        id: `${m.prefix}owner`
                    },
                    {
                        title: 'AllMenu📘',
                        description: `Menampilkan pesan allmenu`,
                        id: `${m.prefix}allmenu`
                    },
                ]
            },
            {
                title: '< ! > Ai',
                rows: [{
                        title: 'Ai Bakugo',
                        description: `Ai Bakugo Dari: Anime My Hero Academia`,
                        id: `${m.prefix}bakugo halo`
                    },
                    {
                        title: 'Ai Deku',
                        description: `Ai Deku Dari: Anime My Hero Academia`,
                        id: `${m.prefix}deku halo`
                    },
                    {
                        title: 'Ai Denki',
                        description: `Ai Denki Dari: Anime My Hero Academia`,
                        id: `${m.prefix}denki halo`
                    },
                    {
                        title: 'Ai Todoroki',
                        description: `Ai Todoroki Dari: Anime My Hero Academia`,
                        id: `${m.prefix}todoroki halo`
                    },
                ]
            },
            {
                title: '< ! > Menu Handalan',
                rows: [{
                    title: `${m.command} all`,
                    description: `Menampilkan pesan menu all`,
                    id: `${m.prefix + 'allmenu'}`
                }, {
                    title: `${m.command} list`,
                    description: `Menampilkan pesan menu list`,
                    id: `${m.prefix + m.command} list`
                }, {
                    title: `${m.command} case`,
                    description: `Menampilkan pesan menu case`,
                    id: `${m.prefix + m.command} case`
                }],
            }, {
                title: '< ! > Pentunjuk',
                rows: list.map((a) => ({
                    title: `${m.command} ${a}`,
                    description: `Menampilkan pesan menu ${a}`,
                    id: `${m.prefix + m.command} ${a}`
                }))
            }
        ]

        let listMessage = {
            title: 'Click Here⎙',
            sections
        };
        await sock.sendMessage(m.cht, {
            location: {
                degreesLatitude: 0,
                degreesLongitude: 0,
                isLive: true,
                jpegThumbnail: await sock.resize(fs.readFileSync('./image/Hanako-kun.jpg'), 300, 170)
            },
            caption: "",
            footer: Func.Styles(config.name),
            title: Func.Styles(xmenu_oh),
            subtitle: "",
            contextInfo: {
                mentions: [m.sender],
                isForwarded: !0,
                forwardingScore: 127,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: config.saluran,
                    newsletterName: config.name,
                    serverMessageId: -1
                }
            },
            interactiveButtons: [{
                name: 'single_select',
                buttonParamsJson: JSON.stringify(listMessage)
            }, {
                name: "cta_url",
                buttonParamsJson: JSON.stringify({
                    display_text: Func.Styles("Link Channel👤"),
                    url: config.wagc,
                    merchant_url: config.wagc
                })
            }]
        }, {
            quoted: await m.froll()
        })

    } else {
        let caption = `Hai ${m.pushName}👋

Aku adalah Hanako-Kun, dari anime Jibaku Shounen Hanako-kun, saya akan membantu kamu dengan berbagai fitur yang kamu butuhkan. Berikut adalah beberapa opsi yang tersedia:

**Berikut Beberapa Opsi Yang Bisa Saya Tawarkan**

*   **Menu**: Menampilkan Menu Utama
*   **List**: Menampilkan Menu List
*   **All**: Menampilkan Semua Fitur Bot WhatsApp
*   **Anime**: Informasi tentang anime, karakter, dan episode
*   **Downloader**: Download anime, manga, dan musik
*   **Tools**: Berbagai tools seperti konversi bahasa, kalkulator, dan lain-lain
*   **Main**: Permainan teks seperti RPG, Hidup atau Mati, dan lain-lain
*   **Search**: Cari informasi tentang berbagai topik
*   **Case**: Terdapat Fitur Di Folder Case.js Dan Fitur Fitur Case Anti, Tools, Dll
*   **Menfess**: Berbagi pengalaman dan cerita tentang kehidupan sehari-hari
*   **Game**: Permainan teks yang lebih menantang
*   **RPG**: Permainan teks RPG yang lebih seru
*   **Help**: Menampilkan Semua Menunjukkan/Tutorial Cara Mengunakan Bot

Pilih salah satu menu yang kamu inginkan, aku akan membantu kamu!`

        await sock.sendMessage(m.cht, {
            image: fs.readFileSync('./image/Hanako-kun.jpg'),
            caption: Func.Styles(caption), // Use this if you are using an image or video
            footer: `© ${config.name}`,
            buttons: [{
                    buttonId: '.menu list',
                    buttonText: {
                        displayText: 'List'
                    }
                },
                {
                    buttonId: '.help',
                    buttonText: {
                        displayText: 'Help'
                    }
                }
            ]
        }, {
            quoted: await m.froll()
        })
        await m.reply({
            audio: {
                url: "https://files.catbox.moe/1n8ki1.mp3"
            },
            mimetype: 'audio/mpeg',
            ptt: true
        })
    }
}

deku.command = "menu";
deku.alias = ["leogg", "dekugg", "dekugz", "help"];
deku.category = ["main"];
deku.settings = {};
deku.description = "Memunculkan menu";
deku.loading = true;

module.exports = deku;
