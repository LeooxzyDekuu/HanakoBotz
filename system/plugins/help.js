let deku = async (m, {
    sock,
    client,
    conn,
    DekuGanz,
    Func,
    Scraper,
    config
}) => {

    let text = `### **Nih Help/Tutorial**

1, ### **Cara Buat Stiker Pakai Bot WhatsApp**

1. **Reply Gambar/Kirim Gambar**:  
   reply gambar/video/kirim gambar/video yang mau dijadikan stiker trus command '.sticker'.

2. **Jika Video Sticker Lebih Dari 10 detik*:  
   Potong kan Durasi Sticker Nya Jadi 10detik

3. **Cara Buat Wm Sticker**:  
   reply sticker trus buat deh contoh '.s nama|nama2'

2, ### **Cara Menampilkan Menu**
1. **kalian mau menu list '.menu list' kalau mau liat menu lain**
2. **cara mau liat list cmd '.allmenu'**
3. **list menu nya ada anime/tools/downloader/all/search/case/menfess/game/rpg**

Nih Cara Mainkan Bot Menu

3, ### **Cara Mendownload Sosmed**
1. **cmd kan downloader contoh: '.tt https://vm.tiktok.com/ZMBB31Q1H/'**
2. **kalau mau putar music cmd '.play', contoh: '.play opening blue exorcist season 1' trus pilih 1 atau 2 **
3. **mendownload yt '.ytdl', contoh: '.ytdl https://youtu.be/37mvfbMlL70?si=8O1V5UOsvhttlZIX' trus pilih 1 atau 2**

Nih Cara Mainkan Bot WhatsApp Nya☺️`;
    m.reply(text);
};

deku.command = "help";
deku.alias = ["tutorial"];
deku.category = ["main"];
deku.loading = true;

module.exports = deku;
