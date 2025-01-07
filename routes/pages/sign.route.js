const { Router } = require(`express`);
const router = new Router();

const { requestContent } = require("../../models/utils.model");
const { requestMeta } = require("../../models/pages.model");


router.get(`/up`, async (request, response) => {
    request.data['isAdaptiveHeader'] = false;
    request.data['isSignUp'] = true;
    request.data['scripts'] = [`sign-up`];
    const pageID = 14;
    const content = requestContent(await Promise.all([
        requestMeta(pageID),
    ]));
    const data = { ...request.data, ...content };
    const template = `pages/sign-up/sign-up`;
    response.render(template, data);
});

router.get(`/in`, async (request, response) => {
    const template = `pages/sign-up/sign-in`;
    request.data['raw_scripts'] = [
        "https://apis.google.com/js/api:client.js", 
        "https://connect.facebook.net/en_US/sdk.js#version=v2.2&appId=214466760546212&xfbml=false&autoLogAppEvents=true"
    ];
    request.data['scripts'] = [`sign-in`];
    response.render(template, {... request.data, });
});

module.exports = router;