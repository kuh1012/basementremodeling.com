const { Router } = require(`express`);
const router = new Router();

router.use((request, response, next) => {
    request.data['isAdaptiveHeader'] = false;
    request.data['scripts'] = [];
    request.data['isGreyMain'] = true;
    next();
});

router.get(`/`, async (request, response, next) => {
    const template = `pages/404/404`;
    return response.status(404).render(template, request.data);
});

module.exports = router;