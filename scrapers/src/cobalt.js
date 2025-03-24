const axios = require('axios');
const {
    exec
} = require('child_process');
const {
    promisify
} = require('util');
const fs = require('fs');
const path = require('path');

const execPromise = promisify(exec);

const base = 'https://c.blahaj.ca/'
const format = {
    audio: ["320", "256", "128", "96", "64", "8"],
    video: ["max", "4320", "2160", "1440", "1080", "720", "480", "360", "240", "144"]
};

async function converter(inputBuffer, inputFormat, outputFormat) {
    // Validate input types
    if (!Buffer.isBuffer(inputBuffer)) {
        throw new Error('Input must be a Buffer');
    }
    if (typeof inputFormat !== 'string' || typeof outputFormat !== 'string') {
        throw new Error('Input and output formats must be strings');
    }

    const inputFilePath = path.resolve(`./tmp/temp_input.${inputFormat}`);
    const outputFilePath = path.resolve(`./tmp/temp_output.${outputFormat}`);

    try {
        await fs.promises.writeFile(inputFilePath, inputBuffer);
        console.log('Input file written successfully.');

        console.log('Starting conversion...');
        await execPromise(`ffmpeg -i ${inputFilePath} ${outputFilePath}`);
        console.log('Conversion completed successfully.');

        const outputBuffer = await fs.promises.readFile(outputFilePath);
        return outputBuffer;
    } catch (error) {
        console.error('Error while converting file:', error);
        throw error; // Re-throw error for higher-level handling
    } finally {
        // Cleanup temporary files
        try {
            if (fs.existsSync(inputFilePath)) await fs.promises.unlink(inputFilePath);
            if (fs.existsSync(outputFilePath)) await fs.promises.unlink(outputFilePath);
        } catch (cleanupError) {
            console.error('Error while cleaning up temp files:', cleanupError);
        }
    }
}

async function cobalt(url, mode = 'video', quality = '720') {
    if (!mode) throw 'Mau Mode Apa video/audio'
    try {
        let payload = {
            url: url,
            filenameStyle: "pretty"
        };
        if (mode === "video") {
            if (!format.video.includes(quality)) {
                return {
                    message: `Maaf Bre Kualitas Mu Salah Deh!`,
                    Kualitas: format.video.map(a => a)
                }
            }
            const cobalt = await axios.post(base, {
                ...payload,
                videoQuality: quality,
                downloadMode: "auto"
            }, {
                headers: {
                    Accept: "application/json",
                    "Content-type": "application/json"
                },
            }).then(x => x.data);

            const x = await axios.get(cobalt.url, {
                responseType: "arraybuffer"
            });
            const hasil = await converter(x.data, 'webp', 'mp4')
            return {
                status: true,
                data: {
                    buffer: hasil,
                    mode,
                    quality,
                    fileName: cobalt.filename
                }
            }
        } else if (mode === "audio") {
            if (!format.audio.includes(quality)) {
                return {
                    message: `Maaf Bre Kualitas Mu Salah Deh!`,
                    Kualitas: format.audio.map(a => a)
                }
            }
            const cobalt = await axios.post(base, {
                ...payload,
                audioBitrate: quality,
                audioFormat: "mp3",
                downloadMode: "audio",
            }, {
                headers: {
                    Accept: "application/json",
                    "Content-type": "application/json"
                },
            }).then(x => x.data)

            const x = await axios.get(cobalt.url, {
                responseType: "arraybuffer"
            })

            const hasil = await converter(x.data, 'ogg', 'mp3')
            return {
                status: true,
                data: {
                    buffer: hasil,
                    mode,
                    quality,
                    fileName: cobalt.filename
                }
            }
        }
    } catch (e) {
        console.error('error: ' + e)
        return {
            status: false,
            data: {
                message: e
            }
        }
    }
}

module.exports = cobalt
