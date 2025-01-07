const { DB } = require("./db.model");
const logger = require('../middlewares/logger.middleware');

const requestAwards = async (limit = 1000) => {
    try {
        const query = `SELECT awardImage, awardTitle FROM awards ORDER BY timestamp LIMIT ?`;
        return { awards: await DB(query, [limit]) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

module.exports = { requestAwards };