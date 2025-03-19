const axios = require('axios')
const cheerio = require('cheerio')

class zerochan {
    search = async function(search) {
        const url = `https://www.zerochan.net/search?q=${encodeURIComponent(search)}`;
        try {
            const {
                data
            } = await axios.get(url);
            const $ = cheerio.load(data);
            const imageDetails = [];

            $('.thumb img').each((index, element) => {
                const imgUrl = $(element).attr('data-src') || $(element).attr('src');
                const link = $(element).closest('a').attr('href');
                const title = $(element).attr('alt');

                if (imgUrl && link && title) {
                    imageDetails.push({
                        id: `https://www.zerochan.net${link}`,
                        title: title,
                        imgUrl: imgUrl
                    });
                }
            });

            return imageDetails;
        } catch (error) {
            console.error('Error:', error);
        }
    }
    detail = async function(url) {
        try {
            const {
                data
            } = await axios.get(`${url}`);
            const $ = cheerio.load(data);

            const scriptContent = $('script[type="application/ld+json"]').html();
            const jsonData = JSON.parse(scriptContent);

            const title = jsonData.name;
            const downloadLink = jsonData.contentUrl;

            return {
                title,
                downloadLink
            };
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

module.exports = new zerochan()
