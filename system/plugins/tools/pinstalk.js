const axios = require("axios");

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
    if (!text) throw '⚠️Mau Stalking Account Siapa?'
    const {
        key
    } = await sock.sendMessage(m.chat, {
        text: '⌛ Bentar ya.... Lagi Di Proses Please Wait'
    }, {
        quoted: m
    })
    try {
        const reply = await sock.sendMessage(m.chat, {
            text: '✅ Loading Selesai',
            edit: key
        }, {
            quoted: m
        })

        const stalking = await profile(text)
        if (!stalking) throw '⚠️ Maaf User Yg Lu Stalking Gada!'
        let caption = `🧑‍💻 Stalking Pinterest
> • Id: ${stalking.result.id || ''}
> • Username: ${stalking.result.username || ''}
> • Fullname: ${stalking.result.full_name || ''}
> • Bio: ${stalking.result.bio || ''}
> • Url: ${stalking.result.profile_url || ''}`
        sock.sendMessage(m.chat, {
            image: {
                url: stalking.result.image.original
            },
            caption
        }, {
            quoted: reply
        })
    } catch (e) {
        console.log(e)
        await sock.sendMessage(m.chat, {
            text: '❌Account Tidak Dapat Di Stalk Error' + e,
            edit: key
        }, {
            quoted: m
        })
    }
}

deku.command = "pintereststalk"
deku.alias = ["pinstalk"]
deku.category = ["tools"]
deku.loading = true

module.exports = deku

const base = "https://www.pinterest.com";
const user = "/resource/UserResource/get/";

const headers = {
    'accept': 'application/json, text/javascript, */*, q=0.01',
    'referer': 'https://www.pinterest.com/',
    'user-agent': 'Postify/1.0.0',
    'x-app-version': 'a9522f',
    'x-pinterest-appstate': 'active',
    'x-pinterest-pws-handler': 'www/[username]/[slug].js',
    'x-pinterest-source-url': '/search/pins/?rs=typed&q=kucing%20anggora/',
    'x-requested-with': 'XMLHttpRequest'
}

async function getCookies() {
    try {
        const response = await axios.get(base);
        const setHeaders = response.headers['set-cookie'];
        if (setHeaders) {
            const cookies = setHeaders.map(cookieString => {
                const cp = cookieString.split(';');
                const cv = cp[0].trim();
                return cv;
            });
            return cookies.join('; ');
        }
        return null;
    } catch (error) {
        console.error(error);
        return null;
    }
}

async function profile(username) {
    if (!username) {
        return {
            status: false,
            code: 400,
            result: {
                message: "Usernamenya mana bree? Lu expect gua jadi paranormal gitu? Minimal kasi username lah yak 🙄"
            }
        };
    }

    try {
        const cookies = await getCookies();
        if (!cookies) {
            return {
                status: false,
                code: 400,
                result: {
                    message: "Cookies nya failed retrieve nih. Nanti lagi ae yak.. "
                }
            };
        }

        const params = {
            source_url: `/${username}/`,
            data: JSON.stringify({
                options: {
                    username: username,
                    field_set_key: "profile",
                    isPrefetch: false,
                },
                context: {}
            }),
            _: Date.now()
        };

        const {
            data
        } = await axios.get(`${base}${user}`, {
            headers: {
                ...headers,
                'cookie': cookies
            },
            params: params
        });

        if (!data.resource_response.data) {
            return {
                status: false,
                code: 404,
                result: {
                    message: "Usernya kagak exist bree! Lu stalking siapa sih sebenernya? 🤨"
                }
            };
        }

        const userx = data.resource_response.data;

        return {
            status: true,
            code: 200,
            result: {
                id: userx.id,
                username: userx.username,
                full_name: userx.full_name || "",
                bio: userx.about || "",
                email: userx.email || null,
                type: userx.type || "user",
                profile_url: `https://pinterest.com/${userx.username}`,
                image: {
                    small: userx.image_small_url || null,
                    medium: userx.image_medium_url || null,
                    large: userx.image_large_url || null,
                    original: userx.image_xlarge_url || null
                },
                stats: {
                    pins: userx.pin_count || 0,
                    followers: userx.follower_count || 0,
                    following: userx.following_count || 0,
                    boards: userx.board_count || 0,
                    likes: userx.like_count || 0,
                    saves: userx.save_count || 0
                },
                website: userx.website_url || null,
                domain_url: userx.domain_url || null,
                domain_verified: userx.domain_verified || false,
                explicitly_followed_by_me: userx.explicitly_followed_by_me || false,
                implicitly_followed_by_me: userx.implicitly_followed_by_me || false,
                location: userx.location || null,
                country: userx.country || null,
                is_verified: userx.verified_identity || false,
                is_partner: userx.is_partner || false,
                is_indexed: userx.indexed || false,
                is_tastemaker: userx.is_tastemaker || false,
                is_employee: userx.is_employee || false,
                is_blocked: userx.blocked_by_me || false,
                meta: {
                    first_name: userx.first_name || null,
                    last_name: userx.last_name || null,
                    full_name: userx.full_name || "",
                    locale: userx.locale || null,
                    gender: userx.gender || null,
                    partner: {
                        is_partner: userx.is_partner || false,
                        partner_type: userx.partner_type || null
                    }
                },
                account_type: userx.account_type || null,
                personalize_pins: userx.personalize || false,
                connected_to_etsy: userx.connected_to_etsy || false,
                has_password: userx.has_password || true,
                has_mfa: userx.has_mfa || false,
                created_at: userx.created_at || null,
                last_login: userx.last_login || null,
                social_links: {
                    twitter: userx.twitter_url || null,
                    facebook: userx.facebook_url || null,
                    instagram: userx.instagram_url || null,
                    youtube: userx.youtube_url || null,
                    etsy: userx.etsy_url || null
                },
                custom_gender: userx.custom_gender || null,
                pronouns: userx.pronouns || null,
                board_classifications: userx.board_classifications || {},
                interests: userx.interests || []
            }
        };

    } catch (error) {
        if (error.response?.status === 404) {
            return {
                status: false,
                code: 404,
                result: {
                    message: "Username nya kagak valid bree! Lu main asal search aja, googling dulu kek 🙄"
                }
            };
        }

        return {
            status: false,
            code: error.response?.status || 500,
            result: {
                message: "Servernya lagi chaos bree! Lu ganggu mulu sih, Servernya butuh break. Try again later yak 😂"
            }
        };
    }
}
