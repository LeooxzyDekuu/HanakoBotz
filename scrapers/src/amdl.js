/* *FIX YouTube Downloader* (kemarin error mp3 nya)
 * Asli *Daffa*
 * https://pastebin.com/cnEz08vm
 * https://t.me/+XCXiUjmqFG1iNzVl
 */

const axios = require('axios')
const FormData = require('form-data')
const WebSocket = require('ws')
const cheerio = require('cheerio')
const crypto = require('crypto')

async function Ytdl(url, type, quality) {
  const api = { base: { video: 'https://amp4.cc', audio: 'https://amp3.cc' } }
  const headers = { Accept: 'application/json', 'User-Agent': 'Postify/1.0.0' }
  const cookies = {}

  const parse_cookies = (set_cookie_headers) => {
    if (set_cookie_headers) {
      set_cookie_headers.forEach((cookie) => {
        const [key_value] = cookie.split(';')
        const [key, value] = key_value.split('=')
        cookies[key] = value
      })
    }
  }

  const get_cookie_string = () => Object.entries(cookies).map(([key, value]) => `${key}=${value}`).join('; ')

  const client_get = async (url) => {
    const res = await axios.get(url, { headers: { ...headers, Cookie: get_cookie_string() } })
    parse_cookies(res.headers['set-cookie'])
    return res
  }

  const client_post = async (url, data, custom_headers = {}) => {
    const res = await axios.post(url, data, { headers: { ...headers, Cookie: get_cookie_string(), ...custom_headers } })
    parse_cookies(res.headers['set-cookie'])
    return res
  }

  const yt_regex = /^((?:https?:)?\/\/)?((?:www|m|music)\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(?:embed\/)?(?:v\/)?(?:shorts\/)?([a-zA-Z0-9_-]{11})/
  const hash_challenge = async (salt, number, algorithm) => {
    return crypto.createHash(algorithm.toLowerCase()).update(salt + number).digest('hex')
  }

  const verify_challenge = async (challenge_data, salt, algorithm, max_number) => {
    for (let i = 0; i <= max_number; i++) {
      if (await hash_challenge(salt, i, algorithm) === challenge_data) {
        return { number: i, took: Date.now() }
      }
    }
    throw new Error('Captcha verification failed')
  }

  const solve_captcha = async (challenge) => {
    const { algorithm, challenge: challenge_data, salt, maxnumber, signature } = challenge
    const solution = await verify_challenge(challenge_data, salt, algorithm, maxnumber)
    return Buffer.from(
      JSON.stringify({
        algorithm,
        challenge: challenge_data,
        number: solution.number,
        salt,
        signature,
        took: solution.took
      })
    ).toString('base64')
  }

  const connect_ws = async (id, is_audio) => {
    return new Promise((resolve, reject) => {
      const ws = new WebSocket(`wss://${is_audio ? 'amp3' : 'amp4'}.cc/ws`, ['json'], {
        headers: { ...headers, Origin: `https://${is_audio ? 'amp3' : 'amp4'}.cc` },
        rejectUnauthorized: false
      })

      let file_info = {}
      let timeout_id = setTimeout(() => { ws.close() }, 30000)

      ws.on('open', () => ws.send(id))
      ws.on('message', (data) => {
        const res = JSON.parse(data)
        if (res.event === 'query' || res.event === 'queue') {
          file_info = { thumbnail: res.thumbnail, title: res.title, duration: res.duration, uploader: res.uploader }
        } else if (res.event === 'file' && res.done) {
          clearTimeout(timeout_id)
          ws.close()
          resolve({ ...file_info, ...res })
        }
      })
      ws.on('error', (err) => { clearTimeout(timeout_id) })
    })
  }

  try {
    const link_match = url.match(yt_regex)
    const is_audio = type === 'audio' || type === 'mp3'
    const base_url = is_audio ? api.base.audio : api.base.video
    const fixed_url = `https://youtu.be/${link_match[3]}`
    const page_data = await client_get(`${base_url}/`)
    const $ = cheerio.load(page_data.data)
    const csrf_token = $('meta[name="csrf-token"]').attr('content')

    if (!isNaN(quality)) quality = `${quality}${is_audio ? 'k' : 'p'}`

    const form = new FormData()
    form.append('url', fixed_url)
    form.append('format', is_audio ? 'mp3' : 'mp4')
    form.append('quality', quality)
    form.append('service', 'youtube')
    if (is_audio) form.append('playlist', 'false')
    form.append('_token', csrf_token)

    const captcha_data = await client_get(`${base_url}/captcha`)
    if (captcha_data.data) {
      const solved_captcha = await solve_captcha(captcha_data.data)
      form.append('altcha', solved_captcha)
    }

    const endpoint = is_audio ? '/convertAudio' : '/convertVideo'
    const res = await client_post(`${base_url}${endpoint}`, form, form.getHeaders())

    const ws = await connect_ws(res.data.message, is_audio)
    const dlink = `${base_url}/dl/${ws.worker}/${res.data.message}/${encodeURIComponent(ws.file)}`

    return {
      title: ws.title || '-',
      uploader: ws.uploader,
      duration: ws.duration,
      quality: quality,
      type: is_audio ? 'audio' : 'video',
      format: is_audio ? 'mp3' : 'mp4',
      thumbnail: ws.thumbnail || `https://i.ytimg.com/vi/${link_match[3]}/maxresdefault.jpg`,
      download: dlink
    }
  } catch (err) {
    throw Error(err.message)
  }
}

module.exports = Ytdl
