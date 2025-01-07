const { Router } = require(`express`);
const router = new Router();

router.get(`/links`, async (request, response, next) => {
    const template = `pages/links/links`;
    
    return response.render(template, {...request.data, hideFooter : true, hideStickyButton : true});
});

module.exports = router;