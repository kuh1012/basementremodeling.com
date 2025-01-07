const { Router } = require(`express`);
const router = new Router();
const { requestServiceByUrl, updateService } = require('../../models/services.model');

router.get(`/`, async (request, response, next) => {

    const data = { ...request.data};
    const template = `pages/services/services`;
    response.render(template, data);
});

router.get(`/:serviceUrl`, async (request, response, next) => {
    const { params: { serviceUrl }} = request;
    const queryResult = await requestServiceByUrl(serviceUrl)
     
    if (!queryResult.service) {
        return next();
    }
    const data = { ...request.data, ...queryResult};
    data.service.serviceImagesTop = data.service.serviceImagesTop.split(",")
    data.service.serviceImagesBottom = data.service.serviceImagesBottom.split(",")
    data['scripts'] = [`portfolio`];
    const template = `pages/services/service-page`;
    response.render(template, data);
});

module.exports = router;