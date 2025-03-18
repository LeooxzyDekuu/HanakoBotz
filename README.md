# **HanakoBotz - v1.3.8** 
<p align="center">
  <img title="HanakoBotz" src="https://files.catbox.moe/movzsb.jpg">
</p>

|                                          Creator                                                |
| :---------------------------------------------------------------------------------------------: |
| [![LeooxzyDekuu](https://github.com/LeooxzyDekuu.png?size=500)](https://github.com/LeooxzyDekuu)|
| [LeooxzyDekuu](https://github.com/LeooxzyDekuu)                                                 |

## Informasi

**Simple WhatsApp bot Using Library Baileys**
| Fitur             | run/start | files | 
| :--------         | :-------: | :---: | 
| Plugin            | ❌        | ✅    |
| Case              | ❌        | ✅    |
| Scraper           | ❌        | ✅    |
| Auto ClearSesi    | ❌        | ❌    |
| Main              | ✅        | ✅    |
| Panel             | ✅        | ❌    |
| Termux            | ✅        | ✅    |

| emoji   | meaning                 |
| :-----: | :---------------------- |
| ✅      | Fitur tersedia          |
| ➖      | unreasonable/impossible |
| ❌      | Fitur belum/tidak ada   |

---

```javascript
{
  message: Message { conversation: '>_ Welcome to Hanako' },
  type: 'conversation',
  msg: '>_ Welcome to HanakoBotz',
  isMedia: false,
  key: {
    remoteJid: '6283136099660@s.whatsapp.net',
    participant: '6283136099660@s.whatsapp.net',
    fromMe: false,
    id: '5780C33F89C0BE600B6D71DF79C4FC02'
  },
  cht: '6283136099660@s.whatsapp.net',
  fromMe: false,
  id: '5780C33F89C0BE600B6D71DF79C4FC02',
  device: 'android',
  isBot: false,
  isGroup: false,
  participant: '6283136099660@s.whatsapp.net',
  sender: '6283136099660@s.whatsapp.net',
  mentions: [],
  body: '>_ Welcome to HanakoBotz',
  prefix: '',
  command: '>_',
  args: [ 'Welcome', 'to', 'HanakoBotz' ],
  text: 'Welcome to HanakoBotz',
  isOwner: true,
  download: [AsyncFunction (anonymous)]
}
```
## ⚙️ Settings Bot ***( settings.js )***

```javascript
const config = {
    owner: ["6283136099660"],
    name: "ʜᴀɴᴀᴋᴏ-ᴋᴜɴ-ʙᴏᴛᴢ",
    ownername: 'ʟᴇᴏᴏxᴢʏ', 
    ownername2: 'ᴅᴇᴋᴜ',
    prefix: [".", "?", "!", "/", "#"], //Tambahin sendiri prefix nya kalo kurang
    wwagc: 'https://chat.whatsapp.com/JyeT1hdCPJeLy95tzx5eyI',
    saluran: '120363279195205552@newsletter', 
    jidgroupnotif: '120363266755712733@g.us', 
    saluran2: '120363335701540699@newsletter', 
    jidgroup: '120363267102694949@g.us', 
    wach: 'https://whatsapp.com/channel/0029VadFS3r89inc7Jjus03W', 
    sessions: "sessions",
    sticker: {
      packname: "〆 ʜᴀɴᴀᴋᴏ-ᴋᴜɴ-ʙᴏᴛᴢ",
      author: "ʙʏ: ᴅᴇᴋᴜ/ʟᴇᴏᴏxᴢʏ 〆"
    },
   messages: {
      wait: "*( Loading )* Tunggu Sebentar...",
      owner: "*( Denied )* Kamu bukan owner ku !",
      premium: "*( Denied )* Fitur ini khusus user premium",
      group: "*( Denied )* Fitur ini khusus group",
      botAdmin: "*( Denied )* Lu siapa bukan Admin group",
      grootbotbup: "*( Denied )* Jadiin Yuta-Botz admin dulu baru bisa akses",
   },
   database: "hanako-db",
   tz: "Asia/Jakarta"
}

module.exports = config
```


## 👨‍💻 How to install/run


```bash
$ git clone https://github.com/FrankXz12/HanakoBotz
$ cd HanakoBotz
$ npm install
$ npm start
```

## ☘️ Example Features
Berikut cara menambahkan fitur pada bot ini

### 1. Plugins

```javascript

module.exports = {
    command: "tes", //- Nama fitur nya
    alias: ["tesbot", "testing"], //- Short cut command
    category: ["main"], //- Kategori Fitur 
    settings: {
        owner: false, //-  Apakah Fitur ini khusus owner ?
        group: false, // - Apakah Fitur ini khusus group ?
     },
    description: "Tes bot saja", //- Penjelasan tentang fitur nya
    loading: true, //- Ingin menambahkan loading messages ?
 async run(m, { sock, client, conn, DekuGanz, Func, Scraper, text, config }) {
    m.reply("> Bot Online ✓")
  }
}
```
### 2. Case

```javascript
case "tes" : {
     m.reply("> Bot Online ✓")
   }
break
```

---  

## **All Contributors**  
[![AxellNetwork](https://github.com/AxellNetwork.png?size=100)](https://github.com/AxellNetwork) | [![AndhikaGG](https://github.com/AndhikaGG.png?size=100)](https://github.com/AndhikaGG)  
---|---  
[AxellNetwork](https://github.com/AxellNetwork) | [AndhikaGG](https://github.com/AndhikaGG)  
Base Script | Penyumbang fitur

---

## 📢 Jgn Lupa Follow Channel dan Join Group ya

<p>Base Sc: <a href="https://whatsapp.com/channel/0029Vb0YWvYJ3jusF2nk9U1P">Klik disini</a></p>

<p>Ch-1 (utama): <a href="https://whatsapp.com/channel/0029VadFS3r89inc7Jjus03W">Klik disini</a></p>

<p>Ch-2: <a href="https://whatsapp.com/channel/0029VateyJuKWEKhJMRKEL20">Klik disini</a></p>
