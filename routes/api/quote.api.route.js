const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');
const formParser = multer();

// API /api/quote - POST - save quote data form
router.post(`/`, formParser.none(), async (request, response) => {
    const data = { code: 200 };
    return response.json(data);
});

module.exports = router;