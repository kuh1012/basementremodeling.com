const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');
const formParser = multer();

// API /api/offer - POST | add offer (multiple)
router.post(`/`, formParser.none(), async (request, response) => {
    const formData = { ...request.body };
    const data = { code: 200 };
    return response.json(data);
});

module.exports = router;