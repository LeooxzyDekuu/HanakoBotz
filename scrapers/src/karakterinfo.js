/**
 * @details: Created by andhika
 * @author: Andhika
 * @channel: https://whatsapp.com/channel/0029VaAMjXT4yltWm1NBJV3J
 * @note: Don't delete this WM!
 */

// IF ESM
/*
import axios from 'axios';
import BodyForm from 'form-data';
import { fileTypeFromBuffer } from 'file-type';
*/

// IF CJS
const axios = require('axios');
const BodyForm = require('form-data');
const { fromBuffer } = require('file-type');


function detect(buffer) {
    return new Promise(async (resolve, reject) => {
        try {
            const BASE_URL = "https://smilingwolf-wd-tagger.hf.space/gradio_api"
            const session_hash = Math.random().toString(36).substring(2)
            const file_name = Math.random().toString(36).substring(2)

            // headers
            const hr = {
                origin: "https://smilingwolf-wd-tagger.hf.space",
                referer: "https://smilingwolf-wd-tagger.hf.space/",
                "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36",
                "content-type": "application/json",
            }

            // Upload
            // const { ext, mime } = (await fileTypeFromBuffer(buffer)) || {}; // FOR ESM
            const { ext, mime } = (await fromBuffer(buffer)) || {}; // FOR CJS
            const form = new BodyForm();
            form.append("files", buffer, {
                filename: file_name + "." + ext,
                contentType: mime
            });

            const files = await axios.post(BASE_URL + "/upload?" + new URLSearchParams({
                upload_id: session_hash
            }), form, {
                headers: {
                    ...hr,
                    ...form.getHeaders()
                }
            }).then(i => i.data)

            // Init response file
            const file_res = {
                "path": files[0],
                "mime_type": mime,
                "orig_name": file_name + "." + ext,
                "meta": {
                    "_type": "gradio.FileData"
                },
                "size": buffer.length,
                "url": BASE_URL + "/file=" + files[0],
            }

            // Join process
            await axios.post(BASE_URL + "/queue/join?", {
                data: [
                    file_res,
                    "SmilingWolf/wd-swinv2-tagger-v3", // Change here to change model!
                    0.35, // General Thresh
                    true, // General MCut Enable
                    0.85, // Character Thresh
                    true // Character MCut Enable
                ],
                event_data: null,
                fn_index: 2,
                session_hash,
                trigger_id: 18,
            })

            // Waiting with stream and send result
            const stream = await axios.get(BASE_URL + "/queue/data?" + new URLSearchParams({
                session_hash
            }), {
                headers: {
                    ...hr,
                    "content-type": "text/event-stream"
                },
                responseType: "stream"
            })

            let result = '';
            stream.data.on('data', (chunk) => {
                result += chunk.toString();
                const lines = result.split('\n');
                result = lines.pop();
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const data = JSON.parse(line.substring(6));
                            if (data.msg !== "process_completed") continue;
                            if (!data.success) return resolve({
                                status: false,
                                data
                            });
                            const dt = data.output.data
                            const is_char = typeof dt[2]?.label === 'string';
                            const res = {
                                prompt: dt[0],
                                rating: dt[1].confidences,
                                character: {
                                    name: dt[2]?.label,
                                    list: dt[2]?.confidences
                                },
                                tags: {
                                    name: dt[3].label,
                                    list: dt[3].confidences
                                }
                            }
                            return resolve({
                                status: true,
                                data: res,
                                is_char
                            });
                        } catch (err) {
                            console.error('Error parsing JSON:', err);
                            resolve({
                                status: false,
                                msg: err.message
                            })
                        }
                    }
                }
            });
        } catch (e) {
            reject(e)
        }
    })
}

// IF ESM
// export default detect

// IF CJS
module.exports = detect
