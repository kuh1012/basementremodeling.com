const { DB, singleDB } = require("./db.model");
const logger = require('../middlewares/logger.middleware');
const requestRedirectsData = async () => {
    try {
        const query = `SELECT ruleId, fromPath, toUrl FROM redirect_rules`;
        return { rules: await DB(query) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

const searchRedirect = async (fromPath) => {
    try {
        const query = `
            SELECT ruleId, fromPath, toUrl 
            FROM redirect_rules
            WHERE fromPath = ?
            LIMIT 1
            `;
        return await DB(query, [fromPath]);
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return [];
    }
};

const updateRedirectRule = async ({ ruleId, ...updateData }) => {
    try {
        const query = `UPDATE redirect_rules SET ? WHERE ruleId = ?`;
        const response = await DB(query, [updateData, ruleId]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(settingID) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, requestID: Number(ruleId), error };
    }
};

const addRedirectRule = async (addData) => {
    try {
        const query = `INSERT INTO redirect_rules SET ?`;
        const response = await DB(query, addData);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(response.insertId) };
    } catch (error) {
        return { status: 0, error };
    }
};

const deleteRedirectRule = async (ruleId) => {
    try {
        const query = `DELETE FROM redirect_rules WHERE ruleId = ?`;
        const response = await DB(query, [ruleId]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(ruleId) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, error };
    }
};

module.exports = { 
    requestRedirectsData, 
    deleteRedirectRule, 
    addRedirectRule, 
    updateRedirectRule, 
    searchRedirect 
};