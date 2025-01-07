const { DB, singleDB } = require("./db.model");
const logger = require('../middlewares/logger.middleware');
// CREATE

const createWork = async ({ filterArray, portfolioImages, ...portfolioData }) => {
    try {
        const query = `INSERT INTO portfolio SET ?,
        position = (
            SELECT portf.position FROM portfolio as portf
            ORDER BY portf.position DESC LIMIT 1
        ) + 1`;
        const response = await DB(query, portfolioData);
        const portfolioID = response.insertId;
        let filters = [];
        if (typeof filterArray === `string`) filters.push(filterArray);
        if (typeof filterArray === `object`) filters = [ ...filterArray ];
        for (const filterID of filters) {
            const query = `INSERT INTO portfolio_properties SET ?`;
            await DB(query, { portfolioID, filterID });
        }
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(response.insertId) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, error };
    }
};

const addCreator = async (pageData) => {
    try {
        const query = `INSERT INTO portfolio_creators SET ?`;
        const response = await DB(query, pageData);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(response.insertId) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, error };
    }
};

// REQUEST

const requestPortfolio = async (limit = 1000) => {
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

const requestFilteredPortfolio = async ({ filters }) => {
    try {
        const { filterArray, square: { 0: minSquare, 1: maxSquare }} = filters;
        const filtersQuery = `
            SELECT 
                portfolio.portfolioID, portfolio.workLink, portfolio.workTitle, 
                portfolio.workCity, portfolio.workSquare, portfolio.isHomeVisible, 
                portfolio.lat, portfolio.lng, ideas.ideaImage as workImage 
            FROM portfolio_properties 
            JOIN portfolio ON portfolio.portfolioID = portfolio_properties.portfolioID 
            LEFT JOIN ideas ON portfolio.workImage = ideas.ideaID 
            WHERE 
                portfolio_properties.filterID IN (?) && 
                portfolio.workSquare > ? && portfolio.workSquare < ?
            GROUP BY portfolio.portfolioID
            ORDER BY portfolio.position
        `;
        const squareQuery = `
            SELECT 
                portfolio.portfolioID, portfolio.workLink, portfolio.workTitle, 
                portfolio.workCity, portfolio.workSquare, portfolio.isHomeVisible, 
                portfolio.lat, portfolio.lng, ideas.ideaImage as workImage 
            FROM portfolio 
            LEFT JOIN ideas ON portfolio.workImage = ideas.ideaID 
            WHERE portfolio.workSquare > ? && portfolio.workSquare < ? 
            ORDER BY portfolio.position
        `;
        const query = (filterArray) ? filtersQuery : squareQuery;
        const params = (filterArray) ? [filterArray, minSquare, maxSquare] : [minSquare, maxSquare];
        return { portfolio: await DB(query, params) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

const requestHomePortfolio = async (limit = 1000) => {
    try {
        const query = `
            SELECT 
                portfolio.portfolioID, portfolio.workLink, portfolio.workTitle, 
                portfolio.workCity, portfolio.workSquare, portfolio.isHomeVisible, 
                ideas.ideaImage as workImage
            FROM portfolio 
            LEFT JOIN ideas ON portfolio.workImage = ideas.ideaID
            WHERE isHomeVisible = 1 
            ORDER BY portfolio.position LIMIT ?
        `;
        return { portfolio: await DB(query, [limit]) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

const requestLandingPortfolio = async ({landingUrl, landingPageId}) => {
    try {
        let landingID = landingPageId;
        if (!landingID) {
            const landing = await DB(`SELECT landingID from landings WHERE pageURL = ?`, [landingUrl]);
            landingID = landing[0].landingID
        }
        const query = `
            SELECT 
                p.portfolioID, p.workLink, p.workTitle, 
                p.workCity, p.workSquare, 
                ideas.ideaImage as workImage
            FROM portfolio p
            LEFT JOIN ideas ON p.workImage = ideas.ideaID 
            LEFT JOIN landings_portfolio_relationship l ON p.portfolioID = l.portfolio_id
            WHERE l.landing_id = ? 
            LIMIT 20
        `;
        return { portfolio: await DB(query, [landingID]) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};
const requestWork = async (portfolioID) => {
    try {
        const query = `
            SELECT 
                portfolio.portfolioID, portfolio.workLink, portfolio.pageTitle, 
                portfolio.pageDescription, portfolio.pageKeywords, portfolio.workTitle, 
                portfolio.workCity, portfolio.creatorID, portfolio.workSquare, portfolio.workImage, 
                portfolio.workText, portfolio.workAddress, portfolio.lat, portfolio.lng, 
                portfolio.isHomeVisible, portfolio_creators.creatorName, 
                (
                    SELECT temp1.workLink FROM portfolio as temp1 
                    WHERE temp1.portfolioID < portfolio.portfolioID
                    ORDER BY temp1.portfolioID DESC LIMIT 1
                ) AS prevLink,
                (
                    SELECT temp2.workLink FROM portfolio as temp2 
                    WHERE temp2.portfolioID > portfolio.portfolioID
                    ORDER BY temp2.portfolioID LIMIT 1
                ) AS nextLink
            FROM portfolio 
            LEFT JOIN portfolio_creators ON portfolio_creators.creatorID = portfolio.creatorID
            WHERE portfolioID = ?
        `;
        const workData = await singleDB(query, [ portfolioID ]);
        return { page: workData };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

const requestWorkByLink = async (workLink) => {
    try {
        const query = `
            SELECT 
                portfolio.portfolioID, portfolio.workLink, portfolio.pageTitle, 
                portfolio.pageDescription, portfolio.pageKeywords, portfolio.workTitle, 
                portfolio.workCity, portfolio.creatorID, portfolio.workSquare, portfolio.workImage, 
                portfolio.workText, portfolio.workAddress, portfolio.lat, portfolio.lng, 
                portfolio.isHomeVisible, portfolio_creators.creatorName, 
                (
                    SELECT temp1.workLink FROM portfolio as temp1 
                    WHERE temp1.portfolioID < portfolio.portfolioID
                    ORDER BY temp1.portfolioID DESC LIMIT 1
                ) AS prevLink,
                (
                    SELECT temp2.workLink FROM portfolio as temp2 
                    WHERE temp2.portfolioID > portfolio.portfolioID
                    ORDER BY temp2.portfolioID LIMIT 1
                ) AS nextLink
            FROM portfolio 
            LEFT JOIN portfolio_creators ON portfolio_creators.creatorID = portfolio.creatorID
            WHERE portfolio.workLink = ?
        `;
        const workData = await singleDB(query, [ workLink ]);
        if (!workData) {
            return {};
        }
        const { portfolioID } = workData;
        const imagesQuery = `
            SELECT ideas.ideaImage, ideas.ideaID, ideas.ideaTitle
            FROM ideas WHERE ideas.portfolioID = ? 
            ORDER BY ideas.position
        `;
        workData.images = await DB(imagesQuery, [ portfolioID ]);
        return { page: workData };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

const requestImages = async (portfolioID) => {
    try {
        const query = `
            SELECT ideaID, ideaImage, ideaTitle,
                (   
                    SELECT COUNT(*) FROM portfolio 
                    WHERE portfolio.workImage = ideas.ideaID
                ) as isCurrent
            FROM ideas WHERE portfolioID = ? 
            ORDER BY position
        `;
        return { images: await DB(query, [ portfolioID ]) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

const requestCreators = async () => {
    try {
        const query = `SELECT creatorID, creatorName FROM portfolio_creators`;
        return { creators: await DB(query) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return {};
    }
};

// UPDATE

const updatePositions = async (requestData) => {
    try {
        const promises = [];
        for (const portfolioID in requestData) {
            const updateData = { position: requestData[portfolioID] };
            const query = `UPDATE portfolio SET ? WHERE portfolioID = ?`;
            promises.push(DB(query, [updateData, portfolioID]))
        }
        await Promise.all(promises);
        return { status: 1 };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, error };
    }
};

const updateImagePositions = async (requestData) => {
    try {
        const promises = [];
        for (const ideaID in requestData) {
            const updateData = { position: requestData[ideaID] };
            const query = `UPDATE ideas SET ? WHERE ideaID = ?`;
            promises.push(DB(query, [updateData, ideaID]))
        }
        await Promise.all(promises);
        return { status: 1 };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, error };
    }
};

const updateFiltersPositions = async (requestData) => {
    try {
        const promises = [];
        for (const portfolioID in requestData) {
            const updateData = { position: requestData[portfolioID] };
            const query = `UPDATE portfolio_filters SET ? WHERE filterID = ?`;
            promises.push(DB(query, [updateData, portfolioID]))
        }
        await Promise.all(promises);
        return { status: 1 };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, error };
    }
};

const updateWork = async (requestData, hasFilters = false) => {
    const { portfolioID, portfolioImages, filterArray, ...updateData } = requestData;
    try {
        const query = `UPDATE portfolio SET ? WHERE portfolioID = ?`;
        const response = await DB(query, [updateData, portfolioID]);
        if (hasFilters) {
            const deleteQuery = `DELETE FROM portfolio_properties WHERE portfolioID = ?`;
            await DB(deleteQuery, [portfolioID]);
            let filters = [];
            if (typeof filterArray === `string`) filters.push(filterArray);
            if (typeof filterArray === `object`) filters = [ ...filterArray ];
            for (const filterID of filters) {
                const relationData = { portfolioID, filterID };
                const query = `INSERT INTO portfolio_properties SET ?`;
                await DB(query, relationData);
            }
        }
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(portfolioID) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, requestID: Number(portfolioID), error };
    }
};

const updateCreator = async ({ creatorID, ...updateData }) => {
    try {
        const query = `UPDATE portfolio_creators SET ? WHERE creatorID = ?`;
        const response = await DB(query, [updateData, creatorID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(creatorID) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, requestID: Number(creatorID), error };
    }
};

// DELETE

const deleteWork = async (portfolioID) => {
    try {
        const deleteRelationshipQuery = `DELETE FROM landings_portfolio_relationship WHERE portfolio_id = ?`
        const deleteRelationshipResponse = await DB(deleteRelationshipQuery, [portfolioID]);
        const query = `DELETE FROM portfolio WHERE portfolioID = ?`;
        const response = await DB(query, [portfolioID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(portfolioID) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, requestID: Number(portfolioID), error };
    }
};

const deleteCreator = async ({ creatorID }) => {
    try {
        const query = `DELETE FROM portfolio_creators WHERE creatorID = ?`;
        const response = await DB(query, [creatorID]);
        const status = Number(response.affectedRows && response.affectedRows === 1);
        return { status, requestID: Number(creatorID) };
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        return { status: 0, requestID: Number(creatorID), error };
    }
};

module.exports = {
    createWork, addCreator, requestFilteredPortfolio, requestPortfolio, requestHomePortfolio, requestWork,
    requestWorkByLink, requestImages, requestCreators, updatePositions, updateImagePositions,
    updateFiltersPositions, updateWork, updateCreator, deleteWork, deleteCreator, requestLandingPortfolio
};