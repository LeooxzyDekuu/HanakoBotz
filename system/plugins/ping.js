// © HanakoBotz
// • By: Leooxzy - Deku
// • Owner: 6283136099660

// By: Leooxzy
// Bio cr: Krz

// instal npm util, node-os-utils, human-readable, performance-now

const util = require('util');
const osu = require('node-os-utils');
const {
    sizeFormatter
} = require('human-readable');
const os = require('os');
const speed = require('performance-now');

let yukio = async (m, {
    sock,
    client,
    conn,
    DekuGanz,
    Func,
    Scraper,
    text,
    config
}) => {

    const used = process.memoryUsage();
    const formatp = sizeFormatter({
        std: 'JEDEC', //'SI' = default | 'IEC' | 'JEDEC'
        decimalPlaces: 2,
        keepTrailingZeroes: false,
        render: (literal, symbol) => `${literal} ${symbol}B`,
    });

    let timestamp = speed();
    let latensi = speed() - timestamp;
    const cpus = await os.cpus();
    const cpu = cpus.reduce((last, cpu, _, {
        length
    }) => {
        last.total += cpu.total
        last.speed += cpu.speed / length
        last.times.user += cpu.times.user
        last.times.nice += cpu.times.nice
        last.times.sys += cpu.times.sys
        last.times.idle += cpu.times.idle
        last.times.irq += cpu.times.irq
        return last
    });

    let dy9 = new Date(new Date + 3600000)
    let locale = 'id'
    let weeks9 = dy9.toLocaleDateString(locale, {
        weekday: 'long'
    });

    let dates9 = dy9.toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
    let times9 = dy9.toLocaleTimeString(locale, {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
    });

    let netsIn, netsOut
    await osu.netstat.inOut().then(info => {
        netsIn = (info.total.inputMb + ' MB'),
            netsOut = (info.total.outputMb + ' MB')
    }).catch(() => {
        netsIn = NotDetect,
            netsOut = NotDetect
    });

    let driveTotal, driveUsed, drivePer
    await osu.drive.info().then(info => {
        driveTotal = (info.totalGb + ' GB'),
            driveUsed = info.usedGb,
            drivePer = (info.usedPercentage + '%')
    }).catch(() => {
        driveTotal = NotDetect,
            driveUsed = NotDetect,
            drivePer = NotDetect
    });

    function runtime(seconds) {
        seconds = Number(seconds);
        var d = Math.floor(seconds / (3600 * 24));
        var h = Math.floor(seconds % (3600 * 24) / 3600);
        var m = Math.floor(seconds % 3600 / 60);
        var s = Math.floor(seconds % 60);
        var dDisplay = d > 0 ? d + (d == 1 ? " Hari, " : " Hari, ") : "";
        var hDisplay = h > 0 ? h + (h == 1 ? " Jam, " : " Jam, ") : "";
        var mDisplay = m > 0 ? m + (m == 1 ? " Menit, " : " Menit, ") : "";
        var sDisplay = s > 0 ? s + (s == 1 ? " Detik" : " Detik") : "";
        return dDisplay + hDisplay + mDisplay + sDisplay;
    };
    let cap = `ℹ️ Informasi Ping\n\n`;
    cap += `📈 Server Run\n> • Response Speed ${latensi.toFixed(4)}\n> • Runtime: ${runtime(process.uptime())}\n\n`;
    cap += `💻 Info Server
> • RAM: ${formatp(os.totalmem() - os.freemem())} / ${formatp(os.totalmem())}
> • Server: ${os.hostname()}
> • CPU Model: ${osu.cpu.model()}
> • CPU Core: ${osu.cpu.count()} Core
> • CPU Speed: ${cpu.speed} MHZ
> • Platform: ${os.platform()}
> • Architecture: ${os.arch()}
> • OS: ${osu.os.platform()}
> •Time Server: ${times9}

🎐 Other ._.
> • Hari: ${weeks9}
> • Tanggal: ${dates9}
> • Drive Total: ${driveTotal} GB
> • Drive Used: ${driveUsed} GB
> • Drive Perc: ${drivePer}

🧩 NodeJS Memory Usaage
${Object.keys(used).map((key, _, arr) => `> • ${key.padEnd(Math.max(...arr.map(v=>v.length)),' ')}: ${formatp(used[key])}`).join('\n')}\n\n`;
    cap += `🔴 Cpu\n> • ${cpus[0].model.trim()}\n> • Speed: (${cpu.speed} MHZ)\n${Object.entries(cpus[0].times).map(([a, b]) => `> • ${a}: ${b}`).join(`\n`)}`;
    await m.reply(cap);
};

yukio.command = "ping";
yukio.alias = ["run"];
yukio.category = ["main"];

module.exports = yukio;
