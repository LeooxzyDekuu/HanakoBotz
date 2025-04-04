let deku = async (m, {
    sock,
    client,
    conn,
    DekuGanz,
    Func,
    Scraper,
    text,
    config
}) => {
    if (!text) throw '⚠️ Tentang Informasi Di FeloAi'
    const {
        key
    } = await sock.sendMessage(m.cht, {
        text: '⌛ Sedang Mencari... _Informasi Saat Ini_ Please Wait...'
    }, {
        quoted: m
    })
    try {
        await Scraper.FeloAi.ask(text).then(async (a) => {
            await sock.sendMessage(m.cht, {
                text: 'Informasi Saat Ini Sudah Di Temukan👍',
                edit: key
            }, {
                quoted: m
            })
            let cap = `\`[ Title ]\`\n${a.title.map(a => `> • ${a}`).join("\n")}\n\n`
            cap += `\`[ Source ]\`\n${a.source
  .map((a) =>
    Object.entries(a)
      .map(([b, c]) => `> • *${b.capitalize()} :* ${c}`)
      .join("\n"),
  )
  .join("\n\n")}`
            await sock.sendMessage(m.cht, {
                text: cap,
                edit: key
            }, {
                quoted: m
            })
        })
    } catch (e) {
        console.error('Error: ' + e)
        await sock.sendMessage(m.cht, {
            text: '❌ Error Bang Silakan Di Coba Lagi😞',
            edit: key
        }, {
            quoted: m
        })
    }
}

deku.command = "feloai"
deku.alias = ["felo", "flai"]
deku.category = ["ai"]
deku.settings = {
    limit: true
}
deku.loading = true

module.exports = deku
