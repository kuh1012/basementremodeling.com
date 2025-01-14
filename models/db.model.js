require(`dotenv`).config();
const pool = require('./pool');

const requestDB = async (query) => {
    const response = await pool.query(query);
    return await response;
};

const DB = async (query, params) => {
    const response = await pool.query(query, params);
    const result = await response;
    console.log("DB connection:", DB)
    return result;
};

const singleDB = async (query, params) => {
    const response = await pool.query(query, params);
    return await response[0];
};

module.exports = { requestDB, DB, singleDB};