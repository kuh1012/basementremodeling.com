const fs = require(`fs`);
const logger = require('../middlewares/logger.middleware');
const requestInstagram = async () => {
    try {
        const instagramJSON = fs.readFileSync(`data-mock/instagram.json`);
        return { instagram: JSON.parse(instagramJSON) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

module.exports = { requestInstagram };