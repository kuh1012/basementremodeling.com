const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');

const formParser = multer();
const uploadDir = `public/upload/services/`;
const imagesParser = multer({ dest: uploadDir });

const { requestContent } = require("../../models/utils.model");
const { saveImages, deleteImages } = require("../../models/images.model");

const { requestServiceByUrl, updateService , requestServices} = require("../../models/services.model");

const { requestModerateCount } = require("../../models/ideas.model");

const imageSizes = [
    {
        name: `serviceImagesTop`,
        maxCount: 10,
        sizes: [
            [240, 166, 80],[628, 346, 80],
            [964, 502, 80],[1540, 586, 80]
        ],
        output: [`jpeg`, `webp`]
    },
    {
        name: `serviceImagesBottom`,
        maxCount: 10,
        sizes: [
            [240, 166, 80],[628, 346, 80],
            [964, 502, 80],[1540, 586, 80]
        ],
        output: [`jpeg`, `webp`]
    }
];

// OUR PROCESS

router.get(`/`, async (request, response, next) => {
    
    request.data['layout'] = `admin`;
    request.data['isAdminProcess'] = true;
    request.data['backButton'] = `/admin/`;
    request.data['locationLink'] = `/services/`;
    const pageID = 3;
    const content = requestContent(await Promise.all([
        requestModerateCount(), requestServices()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/services/services.hbs`;
    response.render(template, data);
});

router.get(`/:serviceUrl`, async (request, response, next) => {
    const { params: { serviceUrl }} = request;
    request.data['layout'] = `admin`;
    request.data['isAdminProcess'] = true;
    request.data['backButton'] = `/admin/`;
    request.data['locationLink'] = `/services/`;
    const content = requestContent(await Promise.all([
        requestModerateCount(), requestServiceByUrl(serviceUrl)
    ]));
    const data = { ...request.data, ...content };
    if(content.service?.serviceImagesTop) {
        data.service.serviceImagesTop = data.service.serviceImagesTop.split(",")
    }
    if(content.service?.serviceImagesBottom) {
        data.service.serviceImagesBottom = data.service.serviceImagesBottom.split(",")
    }
    
    request.data['locationLink'] = `/services/${content.service.url}`;
    
    const template = `admin/services/edit.hbs`;
    response.render(template, data);
});


const processImages = async (name, index, formData, files, responseData) => {
    let resp = await saveImages([ imageSizes[index] ], files, formData.id, removeFolder = false);
    if(resp[name]) {
        if (responseData[name]) {
            serviceImages = `${responseData[name]},${resp[name]}`;
        }
        if (name === "serviceImagesTop") {
            await updateService(formData.id, {"serviceImagesTop" : resp["serviceImagesTop"]});
        } else {
            await updateService(formData.id, {"serviceImagesBottom" : resp["serviceImagesBottom"]});
        }
    }
}

router.post(`/edit`, imagesParser.fields(imageSizes), async (request, response, next) => {
    const formData = { ...request.body };
    delete formData.serviceImages
    const responseData = await updateService(formData.id, formData);
    await processImages("serviceImagesTop", 0, formData, request.files, responseData) 
    await processImages("serviceImagesBottom", 1, formData, request.files, responseData)
    // let serviceImagesTop = request.files.serviceImagesTop
    // let serviceImagesBottom = request.files.serviceImagesBottom
    // for (let imgArr of [{'files' : serviceImagesTop, 'name' : 'serviceImagesTop', 'index' : 0 }, {'files' : serviceImagesBottom, 'name' : 'serviceImagesBottom','index' : 1  }]) {
    //     console.log(imgArr)
    //     let resp = await saveImages([ imageSizes[imgArr.index] ], request.files, formData.id, removeFolder = false);
    //     console.log(resp)
    //     let { serviceImages } = resp;
    //     if(resp[imgArr[name]]) {
    //         if (responseData[imgArr.name]) {
    //             serviceImages = `${responseData[imgArr.name]},${resp[imgArr[name]]}`;
    //         }
    //         await updateService(formData.id, {imgArr[name] : resp[imgArr[name]]});
    //     }
    // }

    return response.json(responseData);
});




module.exports = router;