const FS = require(`fs`);
const fetch = require(`node-fetch`);
const logger = require('./middlewares/logger.middleware');
const fields = `media_type,media_url,thumbnail_url,permalink`;
const limit = 6;

const renewToken = async () => {
    let APItoken = FS.readFileSync('tokens/facebook_token.txt').toString();
    const renewTokenUrl = `https://graph.instagram.com/refresh_access_token?grant_type=ig_refresh_token&access_token=${APItoken}`;
    let updatedToken = await (await fetch(renewTokenUrl)).json();
    FS.writeFileSync('tokens/facebook_token.txt', updatedToken["access_token"]);
    return updatedToken["access_token"];
};



const requestData = async () => {
    try {
        console.log(`renewing instagram token`);
        let token = await renewToken();
        const instagramURL = `https://graph.instagram.com/me/media?fields=${fields}&limit=${limit}&access_token=${token}`;
        const instagramJSON = await fetch(instagramURL);
        const instagramData = await instagramJSON.json();
        const mapFunc = ({ media_type, media_url, permalink, thumbnail_url }) => {
            const thumbnail = (media_type === `VIDEO`) ? thumbnail_url : media_url;
            return { thumbnail, link: permalink };
        };
        const saveData = instagramData.data.map(mapFunc);
        FS.writeFileSync("data-mock/instagram.json", JSON.stringify(saveData));
        console.log(`...saved`);
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
    }
};


module.exports = {
    instagram : () => {
        requestData();
        //renew every 4-ish days
        setInterval(requestData, 345600000); 
    } 
}