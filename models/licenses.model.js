const { DB } = require("./db.model");
const logger = require('../middlewares/logger.middleware');

const requestLicenses = async () => {
    try {
        const query = `SELECT licenseTitle, licenseCover FROM licenses`;
        return { licenses: await DB(query) };
    } catch(error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

module.exports = { requestLicenses };