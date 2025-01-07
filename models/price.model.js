const { DB } = require("./db.model");
const logger = require('../middlewares/logger.middleware');
const requestPrice = async () => {
    try {
        const query = `SELECT priceID, priceTitle, priceValue, priceCover, priceFields FROM price`;
        const price = await DB(query);
        price.forEach((field) => field.priceFields = field.priceFields.split(`, `));
        return { price };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

module.exports = { requestPrice };