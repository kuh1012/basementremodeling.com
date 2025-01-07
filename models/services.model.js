const { DB, singleDB } = require("./db.model");
const logger = require('../middlewares/logger.middleware');


const requestServices = async (url) => {
    try {
        const query = `SELECT * FROM services`;
        return { services : await DB(query, [ url ]) };
    } catch (error) {
        return {};
    }
};



const requestServiceByUrl = async (url) => {
    try {
        const query = `SELECT * FROM services WHERE url = ?`;
        return { service: await singleDB(query, [ url ]) };
    } catch (error) {
        return {};
    }
};

// UPDATE

const updateService = async (id, { ...updateData }) => {
    try {
        const query = `UPDATE services SET ? WHERE id = ?`;
        const response = await DB(query, [ updateData, id ]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, error };
    }
};



module.exports = {
    requestServiceByUrl, updateService, requestServices
};