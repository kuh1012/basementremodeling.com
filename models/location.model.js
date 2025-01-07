const { stat } = require("fs-extra");
const { DB } = require("./db.model");
const logger = require('../middlewares/logger.middleware');

const requestLocation = async () => {
    try {
        const query = `
            SELECT 
                location_categories.categoryTitle, location.locationTitle, 
                location.locationCounties
            FROM location_categories 
            LEFT JOIN location ON location_categories.categoryID = location.categoryID
        `;
        const response = await DB(query);
        const locationMap = ({ categoryTitle }) => categoryTitle;
        const locationCategories = [...(new Set(response.map(locationMap)))];
        const location = [];
        locationCategories.forEach((category) => {
            if (category != "We also service most parts of Washington DC") {
                const counties = [];
                location.push({ category, counties })
            }
        });
        response.forEach(({ categoryTitle, locationTitle, locationCounties }) => {
            const findFunc = ({ category }) => category === categoryTitle;
            const categoryIndex = location.findIndex(findFunc);
            if (!locationTitle) return false;
            const countyData = { locationTitle, locationCounties }
            location[categoryIndex].counties.push(countyData);
        });
        const x = JSON.parse(JSON.stringify(staticLocation));
        return { location };
    } catch (error) {
        logger.log({ 'level': 'error', 'message': error.stack, 'inputs': [...arguments][0] })
        return {};
    }
};

module.exports = { requestLocation };