const { singleDB, DB } = require("./models/db.model");

//local
//const portfolioIds = [117, 115, 118, 121, 123, 124, 116, 126, 129, 130]


const portfolioIds = [114,
    115,
    122,
    116,
    117,
    118,
    120,
    139,
    125,
    121]

const seedLandingPages = async () => {
    const landingObjs = await DB(`SELECT landingID from landings`);
    const landingsArr = landingObjs.map(obj => obj.landingID)
    console.log(landingsArr)
    for (let landingID of landingsArr) {
        console.log(landingID);
        const bigQuery = `Insert into landings_portfolio_relationship (landing_id, portfolio_id) values
        (${landingID}, ?),
        (${landingID}, ?),
        (${landingID}, ?),
        (${landingID}, ?),
        (${landingID}, ?),
        (${landingID}, ?),
        (${landingID}, ?),
        (${landingID}, ?),
        (${landingID}, ?),
        (${landingID}, ?);`
        await DB(bigQuery,  portfolioIds);
    }

}

seedLandingPages();