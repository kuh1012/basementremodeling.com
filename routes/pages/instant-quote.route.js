const { Router } = require(`express`);
const router = new Router();

router.use((request, response, next) => {
    request.data['isAdaptiveHeader'] = false;
    request.data['isInstantQuote'] = true;
    request.data['scripts'] = [];
    request.data.hideFooter = true;
    next();
});

router.get(`/`, async (request, response, next) => {
    return response.redirect('/?open=quote');
});

router.get(`/page`, async (request, response, next) => {
    const metaTitle = "Basement Finishing Free Online Quote";
    const metaDescription = "It's easy to find out how much to budget in for your basement remodel with out basemnt finishing estimate tool. Just fill you a simple form in under 60 seconds!"
    const data = { ...request.data, page : {} };
    data.page.pageTitle = metaTitle;
    data.page.pageDescription = metaDescription;
    const template = `pages/instant-quote/instant-quote-single`;
    return response.render(template, data);
});

router.get(`/calculator`, async (request, response, next) => {
    const metaTitle = "Basement Remodeling Cost Calculator";
    const metaDescription = "Thinking about redoing your basement but wondering how much it's going to cost? We have developed this basement remodeling cost calculator to give you an easy way to find out how much to budget in for your upcoming basement renovation."
    const data = { ...request.data, page : {} };
    data.page.pageTitle = metaTitle;
    data.page.pageDescription = metaDescription;
    const template = `pages/instant-quote/instant-quote-calculator`;
    return response.render(template, data);
});

module.exports = router;