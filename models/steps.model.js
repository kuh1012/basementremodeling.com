const { DB } = require("./db.model");
const logger = require('../middlewares/logger.middleware');
const requestSteps = async () => {
    try {
        const query = `SELECT stepID, stepTitle, stepDay, stepCover FROM steps`;
        return { steps: await DB(query) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

module.exports = { requestSteps };