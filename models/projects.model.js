const { DB, singleDB } = require("./db.model");
const logger = require('../middlewares/logger.middleware');
// CREATE

const createProject = async ({ filterArray, projectImages, ...projectData }) => {
    try {
        const query = `INSERT INTO projects SET ?`;
        const response = await DB(query, projectData);
        const projectID = response.insertId;
        let filters = [];
        if (typeof filterArray === `string`) filters.push(filterArray);
        if (typeof filterArray === `object`) filters = [ ...filterArray ];
        for (const filterID of filters) {
            const query = `INSERT INTO project_properties SET ?`;
            await DB(query, { projectID, filterID });
        }
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(response.insertId) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, error };
    }
};


// REQUEST

const requestProject = async (limit = 1000) => {
    try {
        const query = `
            SELECT 
                portfolio.portfolioID, portfolio.workLink, portfolio.workTitle, portfolio.workCity, 
                portfolio.workSquare, portfolio.isHomeVisible, portfolio.lat, portfolio.lng,
                ideas.ideaImage as workImage 
            FROM portfolio 
            LEFT JOIN ideas ON portfolio.workImage = ideas.ideaID 
            ORDER BY portfolio.position LIMIT ?
        `;
        return { portfolio: await DB(query, [limit]) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};


module.exports = {
    createProject
};