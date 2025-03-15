const fs = require('node:fs');

const config = {
    owner: ["62822440047772"],
    name: "ɴᴀɢɪ ꜱᴇɪꜱʜɪʀᴏ-ʙᴏᴛᴢᴢ",
    ownername: 'Hiroshí', 
    ownername2: 'Hiroshí',
    prefix: [".", "?", "!", "/", "#"], //Tambahin sendiri prefix nya kalo kurang
    wwagc: '',
    saluran: '120363279195205@newsletter', 
    jidgroupnotif: '1203632667557@g.us', 
    saluran2: '12036333570154@newsletter', 
    jidgroup: '12036326710269@g.us', 
    wach: 'https://whatsapp.com/channel/0029VadFS3r8', 
    sessions: "sessions",
    link: {
     tt: "https://www.tiktok.com/@leooxzy_ganz/"
    },
    sticker: {
      packname: "",
      author: ""
    },
   messages: {
      wait: "tunggu sebentar ya bre",
      owner: "lu bukan owner bot",
      premium: "fitur ini khusus user premium",
      group: "fitur ini khusus group",
      botAdmin: "lu siapa bre? sadar lu bukan admin group",
      grootbotbup: "jadikan bot admin dulu baru bisa akses",
   },
   database: "hanako-db",
   tz: "Asia/Jakarta"
}

module.exports = config

let file = require.resolve(__filename);
fs.watchFile(file, () => {
   fs.unwatchFile(file);
  delete require.cache[file];
});
