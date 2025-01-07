const { DB, singleDB } = require("./db.model");
const logger = require('../middlewares/logger.middleware');
// REQUEST

const requestMeta = async (pageID) => {
    try {
        const query = `
            SELECT pageID, pageTitle, pageDescription, pageKeywords 
            FROM pages WHERE pageID = ?
        `;
        return { page: await singleDB(query, [pageID])};
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

const requestTextContent = async (pageID) => {
    try {
        const query = `SELECT fieldTitle, fieldContent FROM text_content WHERE pageID = ?`;
        const data = await DB(query, [pageID]);
        const content = {};
        data.forEach(({ fieldTitle, fieldContent }) => content[fieldTitle] = fieldContent);
        return { content };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

// UPDATE

const updateMeta = async ({ pageID, ...updateData }) => {
    try {
        const query = `UPDATE pages SET ? WHERE pageID = ?`;
        const response = await DB(query, [updateData, pageID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, pageID: Number(pageID) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, pageID: Number(pageID), error };
    }
};

const updateContent = async (content) => {
    try {
        for (const fieldName in content) {
            if (content.hasOwnProperty(fieldName)) {
                const data = { fieldContent: content[fieldName] };
                const query = `UPDATE text_content SET ? WHERE fieldTitle = ?`;
                await DB(query, [data, fieldName]);
            }
        }
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
    }
};

module.exports = { requestMeta, requestTextContent, updateMeta, updateContent };