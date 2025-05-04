const { Router } = require(`express`);
const router = new Router();

const { requestContent } = require("../../models/utils.model");
const { requestMeta, requestTextContent } = require("../../models/pages.model");
const { requestHomePortfolio, requestLandingPortfolio } = require("../../models/portfolio.model");
const { requestTestimonials } = require("../../models/testimonials.model");
const logger = require('../../middlewares/logger.middleware');
const { requestInstagram } = require("../../models/instagram.model");
const { requestSubCategories } = require("../../models/categories.model");
const { requestHomeIdeas } = require("../../models/ideas.model");

const { requestTips } = require("../../models/tips.model");
const { requestLanding, requestSlider, requestSelectedSlider, requestStatic, requestTrendingVideo } = require("../../models/landings.model");

const states = {'md' : 'Maryland', 'va': "Virginia", "dc" : "District of Columbia"};
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }


router.get(`/`, async (request, response, next) => {
    request.data['isHomepage'] = true;
    request.data['isAdaptiveHeader'] = true;
    request.data['scripts'] = [`home`];
    request.data.home = true;
    const pageID = 1;
    const ideasURL = `spaces`;
    const userID = request.data['userID'];
    const hi = await requestHomeIdeas({ userID });
    const content = requestContent(await Promise.all([
        requestMeta(pageID),
        requestTextContent(pageID),
        requestSelectedSlider(),
        requestStatic(),
        requestTrendingVideo(),
        requestHomePortfolio(10),
        requestTestimonials({ limit: 6 }),
        requestInstagram(),
        requestSubCategories(ideasURL, true),
        requestHomeIdeas({ userID }),
        requestTips({ limit: 5 })
    ]));
    const data = { ...request.data, ...content };
    const template = `pages/home/home`;
    return (content.page) ? response.render(template, data) : next();
});

router.get(`/basement-finishing-area`, async (request, response, next) => {
    const data = { ...request.data }
    data.page = data.page || {};
    data.page.pageTitle = "Basementremodeling.com Service Area"
    data.page.pageDescription = "We service all of Maryland, DC and Northern Virginia!"
    const template = `pages/service-area/service-area`;
    return response.render(template, data);
})


router.get(`/basement-finishing-area/*`, async (request, response, next) => {
    request.data[`isAdaptiveHeader`] = true;
    request.data['scripts'] = [`landing`];
    request.data['raw_scripts'] = ['https://maps.googleapis.com/maps/api/js?key=AIzaSyCEOT_L52n8YUI1CvM_fqLM18QIH7S-uFc&callback=initMap']
    request.data['isLocalLanding'] = true;
    const params = request.path.split('/').splice(2);
    const state = params[0] ? params[0] + '/' : "";
    const county = params[1] ? params[1] + '/' : "";
    const city = params[2] || "";
    const landingUrl = `basement-finishing-area/${state}${county}${city}`;
    const content = requestContent(await Promise.all([
        requestLanding(landingUrl),
        requestTextContent(1),
        requestTestimonials({ limit: 6 }),
        requestSelectedSlider(),
        requestTrendingVideo(),
        // requestSlider(),
        requestLandingPortfolio({landingUrl : landingUrl} ),
        requestSubCategories(`spaces`, true),
        requestHomeIdeas()
    ]));
    if (!content.page) return next();
    // replace quotes for tinyMCE
    content.page.headerText = content.page.headerText.replace("&quot;", /"/g,);
    content.page.footerText = content.page.footerText.replace("&quot;", /"/g,);
    content.page.mapCoordinates = JSON.parse(content.page.mapCoordinates)
    const data = { ...request.data, 
        ...content, 
        state : {"label" :  states[state?.replace("/","")], "name" : state?.replace("/","")}, 
        county : {"label" : capitalizeFirstLetter(county?.replace("/","")), "name" : county?.replace("/","")}, 
        city : {"label" : capitalizeFirstLetter(city?.replace("/","")), "name" : city?.replace("/","")}
    }
    const template = `pages/landing/landing`;
    return (content.page) ? response.render(template, data) : next();
});


module.exports = router;