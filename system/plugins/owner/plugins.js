// © HanakoBotz
// • By: Leooxzy - Deku
// • Owner: 6283136099660

// By: Leooxzy
// Bio cr: Krz

const fs = require("node:fs");

module.exports = {
  command: "plugins",
  alias: ["plugin"],
  category: ["owner"],
  settings: {
    owner: true,
  },
  description: "Untuk Pengelolaan Plugins bot",
  async run(m, { sock, Func, text, config }) {
    let src = pg.plugins;
    if (!text)
      throw `> *- 乂 Cara Penggunaan*\n> *\`--get\`* Untuk mengambil plugins\n> *\`--add\`* Untuk menambahkan plugins\n> *\`--delete\`* Untuk menghapus plugins\n\n> *- 乂 List Pluginsr yang tersedia :*\n${Object.keys(
        src,
      )
        .map((a, i) => `> *${i + 1}.* ${a.split("/plugins/")[1]}`)
        .join("\n")}`;

    if (text.includes("--get")) {
      let input = text.replace("--get", "").trim();
      if (!isNaN(input)) {
        let list = Object.keys(src).map((a) => a.split("/plugins/")[1]);
        let file = pg.directory + "/" + list[parseInt(input) - 1];
        try {
          m.reply(fs.readFileSync(file.trim()).toString());
        } catch (e) {
          m.reply(
            `> Plugins ${file} Tidak ditemukan, cek kembali list Plugins yang kamu simpan`,
          );
        }
      } else {
        try {
          let file = pg.directory + "/" + input;
          m.reply(fs.readFileSync(file.trim()).toString());
        } catch (e) {
          m.reply(
            `> Plugins ${input} Tidak ditemukan, cek kembali list Plugins yang kamu simpan`,
          );
        }
      }
    } else if (m.text.includes("--add")) {
      if (!m.quoted) throw "> Reply Plugins yang mau kamu simpan";
      let input = m.text.replace("--add", "").trim();
      try {
        let file = pg.directory + "/" + input + ".js";
        fs.writeFileSync(file.trim(), `// © HanakoBotz
// • By: Leooxzy - Deku
// • Owner: 6283136099660

// By: Leooxzy
// Bio cr: Krz\n\n${m.quoted.body}`);
        m.reply("> Berhasil Menyimpan Plugins : " + input);
      } catch (e) {
        m.reply(`> Gagal menyimpan Plugins, coba lagi`);
      }
    } else if (text.includes("--delete")) {
      let input = text.replace("--delete", "").trim();
      if (!isNaN(input)) {
        let list = Object.keys(src).map((a) => a.split("/plugins/")[1]);
        let file = pg.directory + "/" + list[parseInt(input) - 1];
        try {
          fs.unlinkSync(file.trim());
          m.reply("> Plugins Berhasil dihapus");
        } catch (e) {
          m.reply(
            `> Plugins ${file} Tidak ditemukan, cek kembali list Plugins yang kamu simpan`,
          );
        }
      } else {
        try {
          let file = pg.directory + "/" + input;
          fs.unlinkSync(file.trim());
          m.reply("> Plugins Berhasil dihapus");
        } catch (e) {
          m.reply(
            `> Plugins ${input} Tidak ditemukan, cek kembali list Plugins yang kamu simpan`,
          );
        }
      }
    }
  },
};
