const { DB } = require("./db.model");
const logger = require('../middlewares/logger.middleware');

const requestFAQ = async () => {
    try {
        const query = `SELECT ourTitle, ourText, otherTitle, otherText, faqIcon FROM faq`;
        return { faq: await DB(query) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

module.exports = { requestFAQ };