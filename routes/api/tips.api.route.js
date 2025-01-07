const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');
const formParser = multer();

const { requestTips, requestFilteredTips } = require("../../models/tips.model");

// API /api/tips/all - GET ALL TIPS
router.get(`/all`, async (request, response) => {
    const responseData = await requestTips({ limit: 100000 });
    return response.json(responseData);
});

// API /api/tips/all - GET ALL TIPS
router.get(`/category`, async (request, response) => {
    const responseData = await requestTips({ limit: 100000 });
    return response.json(responseData);
});

// API /api/tips/filter - GET TIPS with filter body
router.post(`/filter`, formParser.none(), async (request, response) => {
    const { body: { categories }} = request;
    const requestFunction = (categories) ? requestFilteredTips : requestTips;
    const responseData = await requestFunction({ categories });
    return response.json(responseData);
});


module.exports = router;