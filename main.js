/*
 📙Main Js Dari: Index MchaX
 👨‍💻Remake: Deku
*/

(async () => {
  const {
    default: makeWASocket,
    useMultiFileAuthState,
    jidNormalizedUser,
    fetchLatestBaileysVersion,
    makeCacheableSignalKeyStore,
    Browsers,
    proto,
    makeInMemoryStore,
    DisconnectReason,
    delay,
    generateWAMessage,
    getAggregateVotesInPollMessage,
    areJidsSameUser,
  } = require("baileys");
  const pino = require("pino");
  const { Boom } = require("@hapi/boom");
  const chalk = require("chalk");
  const readline = require("node:readline");
  const simple = require("./lib/simple.js");
  const fs = require("node:fs");
  const fetch = require("node-fetch");
  const gradient = require('gradient-string');
  const path = require("path");
  const axios = require("axios");
  const pkg = require("./package.json");
  const NodeCache = require("node-cache");
  const moment = require("moment-timezone");
  const canvafy = require("canvafy");
  const Func = require("./lib/function.js");
  const Uploader = require("./lib/uploader.js");
  const Queque = require("./lib/queque.js");
  const messageQueue = new Queque();
  const Database = require("./lib/database.js");
  const append = require("./lib/append");
  const serialize = require("./lib/serialize.js");
  const config = require("./settings.js");

  const appenTextMessage = async (m, sock, text, chatUpdate) => {
    let messages = await generateWAMessage(
      m.key.remoteJid,
      {
        text: text,
      },
      {
        quoted: m.quoted,
      },
    );
    messages.key.fromMe = areJidsSameUser(m.sender, sock.user.id);
    messages.key.id = m.key.id;
    messages.pushName = m.pushName;
    if (m.isGroup) messages.participant = m.sender;
    let msg = {
      ...chatUpdate,
      messages: [proto.WebMessageInfo.fromObject(messages)],
      type: "append",
    };
    return sock.ev.emit("messages.upsert", msg);
  };

  const question = (text) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    return new Promise((resolve) => {
      rl.question(text, resolve);
    });
  };
  global.db = new Database(config.database + ".json");
  await db.init();

  global.pg = new (await require(process.cwd() + "/lib/plugins"))(
    process.cwd() + "/system/plugins",
  );
  await pg.watch();

  global.scraper = new (await require(process.cwd() + "/scrapers"))(
    process.cwd() + "/scrapers/src",
  );
  await scraper.watch();

  setInterval(async () => {
    await db.save();
    await pg.load();
    await scraper.load();
  }, 2000);

  global.axios = axios;
  global.fs = fs;
  global.cheerio = require("cheerio");
  global.block_message = new Set();
  global.lastCall = new Map();
  global.groupCache = new NodeCache({stdTTL: 5 * 60, useClones: false});
  global.pickRandom = function pickRandom(list) {
     return list[Math.floor(Math.random() * list.length)];
  };
  
  const store = makeInMemoryStore({
    logger: pino().child({
      level: "silent",
      stream: "store",
    }),
  });
  const logger = pino({
    timestamp: () => `,"time":"${new Date().toJSON()}"`,
  }).child({ class: "HanakoBotz" });
  logger.level = "fatal";
  
    console.log(gradient.rainbow(`⣿⣿⡿⠉⢋ ⢀⡏⡀⠠⠐  ⠂⢸⢸⣿⡀  ⢰⡀ ⠂ ⠂⠈ ⢈   ⠆⡄ 
⢠⠠⠆⠈⡄ ⣾⠇⡇⠆⡓⠁  ⣿⢸⣿⣷⡀  ⣿⣆⠐⠂⠈ ⢁  ⡀ ⢰⣷⡤
⡇⠈⢇⠁⠁⢰⣿ ⡇⢀⠠⠈⠒⢤⣿⠸⣿⣿⣿⣄ ⠸⣿⣆⢯ ⠄⠐  ⢰⢸⢸⣿⣿
⡇⡆⠟ ⡆⣼⡿ ⣷⠸⡆⠆ ⢸⣿⡆⡏⠻⢿⣿⣦⡘⠬⣿⡼⣇⢀⣆⣤ ⢸⣸⡼⢿⣿
⡇⡇ ⣧⣇⣿⡇⣸⣿⡆⣿⡄⡀⠘⣿⣧⢠⣴⣾⣿⣿⠟⠓⢫⠿⢹⣼⣿⡖ ⢸⣿⣶⣆⣿
⡇⡇ ⣿⣿⣿⣧⣿⣿⣯⡜⣿⣄⡀⢿⡿⣿⠋⠁⣿⣿⣷ ⠘  ⠇⣿⣿ ⣿⣿⡆⣼⣿
⣧⣷ ⣿⣟⠙⠉⣿⣿⡍⠛⢿⡘⢿⣜⣧   ⠋ ⠁     ⠘⢹⣷⣿⡟⣴⣿⣿
⣿⣿⡄⣿⣿⠂ ⠛⠙⠃  ⡇ ⠉⠻            ⢸⣏⣤⣾⣿⣿⣿
⣿⣿⣷⣸⣿      ⠰                ⢠⡏⠉⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣄     ⢠⡀               ⡼  ⣿⢿⣟⠛
⣻⣿⣿⣿⣿⣿⡄    ⠈⠓              ⣰⠃  ⢿⣶⣷⣾
⣿⣿⣯⣿⣿⣿⣿⣆     ⢀⡠⠄⠒⠒ ⠐     ⢀⣼⡏   ⢸⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣷⣤⡀   ⠐⠒⠛⠉⠁    ⣠⣴⣿⣿⠁   ⢸⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣄⡀      ⢀⣠⣾⣿⢿⣿⠇    ⣸⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣶⣤⣤⣤⣴⣶⣿⣿⠟⠁⣼⡏ ⢀⣠⣶⣿⣿⣿⣿⣿
⣿⣿⡟⣿⣿⣻⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠃ ⢰⡿⣠⣾⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡟  ⢀⣼⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡏ ⢀⣴⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿
`))
    console.log(chalk.bold.green('[ Script ] ') + chalk.white('>>> ') + chalk.green(`Hanako-Botz Creator: Dxyz - Deku`));

  async function system() {
    const { state, saveCreds } = await useMultiFileAuthState(config.sessions);
    const sock = simple(
      {
        logger: pino({ level: "silent" }),
        printQRInTerminal: false,
        auth: state,
        cachedGroupMetadata: async (jid) => groupCache.get(jid),
        version: [2, 3000, 1019441105],
        browser: Browsers.ubuntu("Edge"),
        getMessage: async (key) => {
          const jid = jidNormalizedUser(key.remoteJid);
          const msg = await store.loadMessage(jid, key.id);
          return msg?.message || "";
        },
        shouldSyncHistoryMessage: (msg) => {
          console.log(`\x1b[32mMemuat chat [${msg.progress}%]\x1b[39m`);
          return !!msg.syncType;
        },
      },
      store,
    );
    global.hanako = sock;
    store.bind(sock.ev);
    if (!sock.authState.creds.registered) {
      console.log(chalk.bold.green('[ Warning ] ') + chalk.white('>>> ') + chalk.green(`Masukan Nomor Kalian Di Sini\nMinsalnya 62 Terus Contohnya: 628xxx`));
      const phoneNumber = await question(chalk.bold.green('[ Nomor Anda ] ') + chalk.white('>>> ') );
      const code = await sock.requestPairingCode(phoneNumber, "LEOODEKU");
      setTimeout(() => {
        console.log(chalk.bold.green('[ Code ] ') + chalk.white('>>> ') + chalk.green(`Nih Code Pairing Mu Tuan: ${chalk.bold.green(code)}`));
      }, 3000);
    }

    //=====[ Pembaruan Koneksi ]======
        sock.ev.on("connection.update", async (update) => {
            const {
                connection,
                lastDisconnect
            } = update;
            if (connection === "close") {
                const reason = new Boom(lastDisconnect?.error)?.output.statusCode;
                if (lastDisconnect.error == "Error: Stream Errored (unknown)") {
                    process.exit(0)
                } else if (reason === DisconnectReason.badSession) {
                    console.log(chalk.bold.red('[ Warning ] ') + chalk.white('>>> ') + chalk.red(`File sesi buruk, Harap hapus sesi dan scan ulang`));
                    process.exit(0)
                } else if (reason === DisconnectReason.connectionClosed) {
                    console.log(chalk.bold.yellow('[ Warning ] ') + chalk.white('>>> ') + chalk.yellow(`Koneksi ditutup, sedang mencoba untuk terhubung kembali...`));
                    process.exit(0)
                } else if (reason === DisconnectReason.connectionLost) {
                    console.log(chalk.bold.yellow('[ Warning ] ') + chalk.white('>>> ') + chalk.yellow(`Koneksi hilang, mencoba untuk terhubung kembali...`));
                    process.exit(0)
                } else if (reason === DisconnectReason.connectionReplaced) {
                    console.log(chalk.bold.yellow('[ Warning ] ') + chalk.white('>>> ') + chalk.yellow(`Koneksi diganti, sesi lain telah dibuka. Harap tutup sesi yang sedang berjalan.`));
                    sock.logout();
                } else if (reason === DisconnectReason.loggedOut) {
                    console.log(chalk.bold.yellow('[ Warning ] ') + chalk.white('>>> ') + chalk.yellow(`Perangkat logout, harap scan ulang.`));
                    sock.logout();
                } else if (reason === DisconnectReason.restartRequired) {
                    console.log(chalk.bold.yellow('[ Warning ] ') + chalk.white('>>> ') + chalk.yellow(`Restart diperlukan, sedang memulai ulang...`));
                    system();
                } else if (reason === DisconnectReason.timedOut) {
                    console.log(chalk.bold.yellow('[ Warning ] ') + chalk.white('>>> ') + chalk.yellow(`Koneksi waktu habis, sedang mencoba untuk terhubung kembali...`));
                    process.exit(0)
                }
            } else if (connection === "connecting") {
                console.log(chalk.bold.green('[ Loading ] ') + chalk.white('>>> ') + chalk.green(`Menghubungkan ke WhatsApp...`));
            } else if (connection === "open") {
                const info = sock.user
                const informasi = {
                   "Name": info.name,
                   "Id": info.id,
                   "lid": info.lid,
                   "Sender": info.jid,
                   "Owner": config.owner.map(a => a) + '@s.whatsapp.net'
                };
                console.table(informasi)
                console.log(chalk.bold.green('[ Loading ] ') + chalk.white('>>> ') + chalk.green(`🔁 Memuat plugin dan scraper dan case...`));
                console.log(chalk.bold.green('[ Terconnect ] ') + chalk.white('>>> ') + chalk.green(`Bot berhasil terhubung.`));
            }
        });

    //=====[ Setelah Pembaruan Koneksi ]========//
    sock.ev.on("creds.update", saveCreds);

    sock.ev.on("contacts.update", (update) => {
      for (let contact of update) {
        let id = jidNormalizedUser(contact.id);
        if (store && store.contacts)
          store.contacts[id] = {
            ...(store.contacts?.[id] || {}),
            ...(contact || {}),
          };
      }
    });

    sock.ev.on("contacts.upsert", (update) => {
      for (let contact of update) {
        let id = jidNormalizedUser(contact.id);
        if (store && store.contacts)
          store.contacts[id] = { ...(contact || {}), isContact: true };
      }
    });

    sock.ev.on("groups.update", async (updates) => {
      for (const update of updates) {
        const id = update.id;
        const metadata = await sock.groupMetadata[id];
        groupCache.set(id, metadata);
        if (store.groupMetadata[id]) {
          store.groupMetadata[id] = {
            ...(store.groupMetadata[id] || {}),
            ...(update || {}),
          };
        }
      }
    });

        sock.ev.on("group-participants.update", async (groupUpdate) => {
            try {
                let {
                    id,
                    participants,
                    action
                } = groupUpdate;
                let groupMetadata = await sock.groupMetadata(id);
                let totalMembers = groupMetadata.participants.length;
                const metadata = await sock.groupMetadata[id];

                for (let participant of participants) {
                    if (action === "add") {
                      let ppuser;
                        try {
                          ppuser = await sock.profilePictureUrl(participant, 'image')
                        } catch (e) {
                          ppuser = 'https://e.top4top.io/s_3372u3s4b0.jpg'
                        }

                      const welcome = await new canvafy.WelcomeLeave()
                        .setAvatar(ppuser)
                        .setBackground("image", "https://f.top4top.io/p_3372ppurc1.jpg")
                        .setTitle("Welcome")
                        .setDescription(`Welcome Jangan Lupa Baca Rules🤗`)
                        .setBorder("#2a2e35")
                        .setAvatarBorder("#2a2e35")
                        .setOverlayOpacity(0.3)
                        .build();
                        sock.sendMessage(id, {
                            image: welcome,
                            caption: `Yokoso! (Selamat datang!) Untuk member baru! bernama @${participant.split("@")[0]} ${config.name}-Kun senang sekali bisa bertemu denganmu! *🤩*\nJan Lupa Baca Rules Ya Membaru`,
                            footer: config.name,
                            buttons: [{
                                buttonId: ".menu",
                                buttonText: {
                                    displayText: 'Welcome'
                                }
                            }],
                            viewOnce: true,
                            headerType: 6,
                            contextInfo: {
                                mentionedJid: [participant],
                                isForwarded: !0,
                                forwardingScore: 127,
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: config.saluran,
                                    newsletterName: Func.Styles(`${config.name} By Creator: ${config.ownername}`),
                                    serverMessageId: -1
                                },
                            }
                        });
                    } else if (action === "remove") {
                      let ppuser;
                        try {
                          ppuser = await sock.profilePictureUrl(participant, 'image')
                        } catch (e) {
                          ppuser = 'https://e.top4top.io/s_3372u3s4b0.jpg'
                        }

                      const welcome = await new canvafy.WelcomeLeave()
                        .setAvatar(ppuser)
                        .setBackground("image", "https://f.top4top.io/p_3372ppurc1.jpg")
                        .setTitle("Goodbye")
                        .setDescription(`Goodbye Semoga Kamu Datang Kembali🤗`)
                        .setBorder("#2a2e35")
                        .setAvatarBorder("#2a2e35")
                        .setOverlayOpacity(0.3)
                        .build();
                        sock.sendMessage(id, {
                            image: welcome,
                            caption: `Sayonara, @${participant.split("@")[0]}-kun! Mata ne! :)`,
                            footer: config.name,
                            buttons: [{
                                buttonId: ".menu",
                                buttonText: {
                                    displayText: 'Goodbye'
                                }
                            }],
                            viewOnce: true,
                            headerType: 6,
                            contextInfo: {
                                mentionedJid: [participant],
                                isForwarded: !0,
                                forwardingScore: 127,
                                forwardedNewsletterMessageInfo: {
                                    newsletterJid: config.saluran,
                                    newsletterName: Func.Styles(`${config.name} By Creator: ${config.ownername}`),
                                    serverMessageId: -1
                                },
                            }
                        });
                    }
                }
              groupCache.set(id, metadata);
            } catch (err) {
                console.log(err);
            }
        });
    
    sock.ev.on('presence.update', (m) => {
       if (!m) return
       const { id, presences } = m;
       if (id.endsWith('g.us')) {
          for (let jid in presences) {
             if (!presences[jid] || jid == sock.decodeJid(sock.user.id)) continue
             if ((presences[jid].lastKnownPresence === 'composing' || presences[jid].lastKnownPresence === 'recording') && global.db && db.list().user && db.list().user[jid] && db.list().user[jid].afk.afkTime > -1) {
                sock.sendMessage(id, { text: `Sistem mendeteksi aktivitas dari @${jid.replace(/@.+/, '')} setelah offline selama: ${Func.texted('bold', Func.toTime(new Date - db.list().user[jid].afk.afkTime))}\n\n➠ ${Func.texted('bold', 'Reason:')} ${db.list().user[jid].afk.afkReason ? db.list().user[jid].afk.afkReason : '-'}`, mentions: [jid] }, { quoted: db.list().user[jid].afk.afkObj });
                db.list().user[jid].afk.afkTime = -1
                db.list().user[jid].afk.afkReason = ''
                db.list().user[jid].afk.afkObj = {}
             }
          }
       } else { }
    });

    async function getMessage(key) {
      if (store) {
        const msg = await store.loadMessage(key.remoteJid, key.id);
        return msg;
      }
      return {
        conversation: "NekoBot",
      };
    }

    sock.ev.on("call", async (calls) => {
      if (!db.list().settings.anticall) return;
      for (const call of calls) {
        if (!call.id || !call.from) continue;
    
        let lastTime = lastCall.get(call.from);
        let now = Date.now();
    
        if (!lastTime || now - lastTime > 5000) {
          lastCall.set(call.from, now);
          await sock.rejectCall(call.id, call.from);
          await sock.sendMessage(call.from, {
            text: "> 🚫 *Mohon maaf*... Kami tidak bisa menerima telepon dari Anda, anti call aktif!",
            mentions: [call.from],
          });
        }
      }
    })
    
    sock.ev.on("messages.upsert", async (cht) => {
        if (cht.messages.length === 0) return;  
        const chatUpdate = cht.messages[0];
        if (!chatUpdate.message) return;    
        const userId = chatUpdate.key.id;
        global.m = await serialize(chatUpdate, sock, store)
        if (m.isBot) {
            if (block_message.has(userId)) return;
            block_message.add(userId);
            setTimeout(() => block_message.delete(userId), 5 * 60 * 1000);
        }
        require("./lib/logger.js")(m);
        await require("./system/handler.js")(m, sock, store);
    });

    sock.ev.on("messages.update", async (chatUpdate) => {
      for (const { key, update } of chatUpdate) {
        if (update.pollUpdates && key.fromMe) {
          const pollCreation = await getMessage(key);
          if (pollCreation) {
            let pollUpdate = await getAggregateVotesInPollMessage({
              message: pollCreation?.message,
              pollUpdates: update.pollUpdates,
            });
            let toCmd = pollUpdate.filter((v) => v.voters.length !== 0)[0]
              ?.name;
            console.log(toCmd);
            await appenTextMessage(m, sock, toCmd, pollCreation);
            await sock.sendMessage(m.cht, { delete: key });
          } else return false;
          return;
        }
      }
    });
    return sock;
  }
  system();
})();
