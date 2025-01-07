const { DB, singleDB } = require("./db.model");
const logger = require('../middlewares/logger.middleware');
// REQUEST

const requestQuotes = async () => {
    try {
        const query = `SELECT * FROM quotes ORDER BY timestamp`;
        return { quotes: await DB(query) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

const requestQuote = async (pageURL) => {
    try {
        const query = `SELECT * FROM quotes WHERE pageURL = ?`;
        return { page: await singleDB(query, [pageURL]) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

module.exports = {
    requestQuotes, requestQuote
};