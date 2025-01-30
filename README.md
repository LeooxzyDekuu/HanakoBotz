***HanakoBotz | 1.1.4*** | ***Create By: deku || base: script Axel network***

![Logo](https://cdn.anomaki.web.id/file/1738221934782.jpg)

```> Simple WhatsApp bot Using Library Baileys```

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
const fs = require('node:fs');

const config = {
    owner: ["6283136099660"],
    name: "- HanakoBotz - Simple WhatsApp bot",
    sessions: "sessions",
    sticker: {
      packname: "Made by ",
      author: "HanakoBotz"
    },
   messages: {
      wait: "*( Loading )* Tunggu Sebentar...",
      owner: "*( Denied )* Kamu bukan owner ku !",
      premium: "*( Denied )* Fitur ini khusus user premium",
      group: "*( Denied )* Fitur ini khusus group",
   },
   database: "neko-db",
   tz: "Asia/Jakarta"
}

module.exports = config
```


## 👨‍💻 How to install/run


```bash
$ git clone https://github.com/AxellNetwork/HanakoBotz
$ cd HanakoBotz
$ npm install
$ npm start
```

## ☘️ Example Features
Berikut cara menambahkan fitur pada bot ini

## 1. Plugins

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
 async run(m, { sock, Func, Scraper, text, config }) {
    m.reply("> Bot Online ✓")
  }
}
```
## 2. Case

```javascript
case "tes" : {
     m.reply("> Bot Online ✓")
   }
break
```
## Jangan Lupa Follow Dan Join Group

**Base Sc: "https://whatsapp.com/channel/0029Vb0YWvYJ3jusF2nk9U1P"**

**Ch1: "https://whatsapp.com/channel/0029VadFS3r89inc7Jjus03W"**

**Ch2: "https://whatsapp.com/channel/0029VateyJuKWEKhJMRKEL20"**

**Group: "https://chat.whatsapp.com/JyeT1hdCPJeLy95tzx5eyI"**
