const { Router } = require(`express`);
const router = new Router();

const { requestContent } = require("../../models/utils.model");
const {
    requestPortfolio, requestWorkByLink
} = require("../../models/portfolio.model");
const {
    requestPortfolioFilters
} = require("../../models/filters.model");
const { requestMeta } = require("../../models/pages.model");

router.use((request, response, next) => {
    request.data['isAdaptiveHeader'] = false;
    request.data['isPortfolio'] = true;
    request.data['scripts'] = [`portfolio`];
    next();
});

router.get(`/`, async (request, response) => {
    const pageID = 2;
    const content = requestContent(await Promise.all([
        requestMeta(pageID),
        requestPortfolio(16),
        requestPortfolioFilters()
    ]));
    request.data.raw_scripts = ['https://maps.googleapis.com/maps/api/js?key=AIzaSyCEOT_L52n8YUI1CvM_fqLM18QIH7S-uFc&callback=initMap']
    const data = { ...request.data, ...content };
    const template = `pages/portfolio/portfolio`;
    response.render(template, data);
});

router.get(`/map:param`, async (request, response) => {
    const pageID = 2;
    const { params: { param }} = request;
    if(param=='portfolioOnly'){
        const content = requestContent(await Promise.all([
            requestMeta(pageID),
            requestPortfolio(),
            requestPortfolioFilters()
        ]));
        content.page.pageTitle = "BasementRemodeling.com projects on a map."
        const data = { ...request.data, ...content };
        const template = `pages/portfolio/map/map`;
        response.render(template, data);
    }
    else{
        const content = requestContent(await Promise.all([
            requestMeta(pageID),
            requestPortfolio(),
            requestPortfolioFilters()
        ]));
        content.page.pageTitle = "BasementRemodeling.com projects on a map."
        const data = { ...request.data, ...content };
        const template = `pages/portfolio/map/map`;
        response.render(template, data);
    }
});

router.get(`/:workLink`, async (request, response, next) => {
    const { params: { workLink }} = request;
    const content = requestContent(await Promise.all([
        requestWorkByLink(workLink)
    ]));
    if (!content.page) return next();
    content.page.pageTitle = content.page.pageTitle || `BasementRemodeling.com - ${content.page.workSquare} finished in ${content.page.workCity}`;
    const data = { ...request.data, ...content };
    const template = `pages/portfolio/work/work`;
    response.render(template, data);
});

module.exports = router;