const { Router } = require(`express`);
const router = new Router();

const { searchRedirect } = require("../../models/redirects.model");

// API /redirect/:redirectKey
router.get(`/*`, async (request, response, next) => {
    const potentialRedirect = request.path.split('/').splice(1).join('/')
    const responseData = await searchRedirect(potentialRedirect);
    if (responseData.length != 0) {
        response.status(301).redirect(responseData[0].toUrl);
        return;
    }
    next();
});

module.exports = router;