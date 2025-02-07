const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');

const formParser = multer();
const testimonialsDir = `public/upload/testimonials/`;
const pressDir = `public/upload/press/`;
const testimonialsImagesParser = multer({ dest: testimonialsDir });
const pressImagesParser = multer({ dest: pressDir });

const responseTimeout = 0;

const { requestContent } = require("../../models/utils.model");
const { requestMeta, updateMeta } = require("../../models/pages.model");
const { saveImages, deleteImages } = require("../../models/images.model");
const {
    createPress, requestPress, requestArticle, updatePress,
    updatePositions: updatePressPositions, deletePress
} = require("../../models/press.model");
const {
    createTestimonial, requestTestimonials, requestTestimonial,
    updateTestimonial, updatePositions: updateTestimonialsPositions, deleteTestimonial
} = require("../../models/testimonials.model");
const {
    addOffice, requestOffices, requestOfficeByID, updateOffice, deleteOffice
} = require("../../models/offices.model");
const { updateSettings } = require("../../models/settings.model");

const { requestModerateCount } = require("../../models/ideas.model");

const testimonialImages = [
    {
        name: `testimonialImage`,
        maxCount: 1,
        sizes: [
            [120, 83, 80], [240, 166, 80],
            [228, 123, 80], [456, 246, 80],
            [236, 123, 80], [472, 246, 80],
            [314, 173, 80], [628, 346, 80],
            [330, 173, 80], [660, 346, 80]
        ],
        output: [`jpeg`, `webp`]
    }
];

const pressImages = [
    {
        name: `pressImage`,
        maxCount: 1,
        sizes: [
            [120, 83, 80], [240, 166, 80],
            [228, 123, 80], [456, 246, 80],
            [236, 123, 80], [472, 246, 80],
            [314, 173, 80], [628, 346, 80],
            [330, 173, 80], [660, 346, 80]
        ],
        output: [`jpeg`, `webp`]
    }
];

// TESTIMONIALS REQUEST

router.get(`/testimonials`, async (request, response, next) => {
    
    request.data['layout'] = `admin`;
    request.data['isAdminTestimonials'] = true;
    request.data['backButton'] = `/admin/`;
    request.data['locationLink'] = `/about-us/testimonials/`;
    const pageID = 6;
    const content = requestContent(await Promise.all([
        requestMeta(pageID),
        requestTestimonials(),
        requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/about-us/testimonials/testimonials.admin.hbs`;
    response.render(template, data);
});

router.post(`/testimonials`, formParser.none(), async (request, response, next) => {
    
    const { pageID, pageTitle, pageKeywords, pageDescription, ...settingsData } = request.body;
    const metaData = { pageID, pageTitle, pageKeywords, pageDescription };
    const responseData = await updateMeta(metaData);
    await updateSettings(settingsData);
    return response.json(responseData);
});

// TESTIMONIALS CREATE

router.get(`/testimonials/add`, async (request, response, next) => {
    
    request.data['layout'] = `admin`;
    request.data['isAdminTestimonialsAdd'] = true;
    request.data['backButton'] = `/admin/about-us/testimonials/`;
    const content = requestContent(await Promise.all([
        requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/about-us/testimonials/add-testimonial.admin.hbs`;
    response.render(template, data);
});

router.post(`/testimonials/add`, testimonialsImagesParser.fields(testimonialImages), async (request, response, next) => {
    
    const formData = { ...request.body };
    const responseData = await createTestimonial(formData);
    const { requestID } = responseData;
    const files = await saveImages(testimonialImages, request.files, requestID);
    const filesData = { ...files, ...{ testimonialID: requestID }};
    await updateTestimonial(filesData);
    return response.json(responseData);
});

// TESTIMONIALS EDIT

router.get(`/testimonials/edit/:testimonialID`, async (request, response, next) => {
    
    request.data['layout'] = `admin`;
    request.data['isTestimonialEdit'] = true;
    request.data['backButton'] = `/admin/about-us/testimonials/`;
    const { params: { testimonialID }} = request;
    const content = requestContent(await Promise.all([
        requestTestimonial(testimonialID),
        requestModerateCount()
    ]));
    if (!content.page) return next();
    request.data['locationLink'] = `/about-us/testimonials/` + content['page']['testimonialLink'];
    // replace quotes for tinyMCE
    if (content.page.testimonialText) {
        content.page.testimonialText = content.page.testimonialText.replace(/"/g, "&quot;");
    }
    const data = { ...request.data, ...content };
    const template = `admin/about-us/testimonials/edit-testimonial.admin.hbs`;
    response.render(template, data);
});

router.post(`/testimonials/edit`, testimonialsImagesParser.fields(testimonialImages), async (request, response, next) => {
    
    const { testimonialID } = request.body;
    const files = await saveImages(testimonialImages, request.files, testimonialID);
    const formData = { ...request.body, ...files };
    const responseData = await updateTestimonial(formData);
    return response.json(responseData);
});

router.post(`/testimonials/sort`, formParser.none(), async (request, response, next) => {
    
    const responseData = await updateTestimonialsPositions(request.body);
    return response.json(responseData);
});

// TESTIMONIALS DELETE

router.delete(`/testimonials/:testimonialID`, formParser.none(), async (request, response, next) => {
    
    const { params: { testimonialID }} = request;
    const responseData = await deleteTestimonial(testimonialID);
    await deleteImages(testimonialID, testimonialsDir);
    return response.json(responseData);
});

// PRESS REQUEST

router.get(`/press`, async (request, response, next) => {
    
    request.data['layout'] = `admin`;
    request.data['isAdminPress'] = true;
    request.data['backButton'] = `/admin/`;
    request.data['locationLink'] = `/about-us/in-the-press/`;
    const pageID = 7;
    const content = requestContent(await Promise.all([
        requestMeta(pageID), requestPress(), requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/about-us/press/press.admin.hbs`;
    response.render(template, data);
});

router.post(`/press`, formParser.none(), async (request, response, next) => {
    
    const formData = { ...request.body };
    const responseData = await updateMeta(formData);
    return response.json(responseData);
});

// PRESS CREATE

router.get(`/press/add`, async (request, response, next) => {
    
    request.data['layout'] = `admin`;
    request.data['isAdminPressAdd'] = true;
    request.data['backButton'] = `/admin/about-us/press/`;
    const content = requestContent(await Promise.all([
        requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/about-us/press/add-press.admin.hbs`;
    response.render(template, data);
});

router.post(`/press/add`, pressImagesParser.fields(pressImages), async (request, response, next) => {
    
    const formData = { ...request.body };
    const responseData = await createPress(formData);
    const { requestID } = responseData;
    const files = await saveImages(pressImages, request.files, requestID);
    const filesData = { ...files, ...{ pressID: requestID }};
    await updatePress(filesData);
    return response.json(responseData);
});

// PRESS EDIT

router.get(`/press/edit/:pressID`, async (request, response, next) => {
    
    request.data['layout'] = `admin`;
    request.data['isPressEdit'] = true;
    request.data['backButton'] = `/admin/about-us/press/`;
    const { params: { pressID }} = request;
    const content = requestContent(await Promise.all([
        requestArticle(pressID), requestModerateCount()
    ]));
    if (!content.page) return next();
    request.data['locationLink'] = `/about-us/in-the-press/` + content['page']['pressLink'];
    // replace quotes for tinyMCE
    if (content.page.pressText) {
        content.page.pressText = content.page.pressText.replace(/"/g, "&quot;");
    }
    const data = { ...request.data, ...content };
    const template = `admin/about-us/press/edit-press.admin.hbs`;
    response.render(template, data);
});

router.post(`/press/edit`, pressImagesParser.fields(pressImages), async (request, response, next) => {
    
    const { pressID } = request.body;
    const files = await saveImages(pressImages, request.files, pressID);
    const formData = { ...request.body, ...files };
    const responseData = await updatePress(formData);
    return response.json(responseData);
});

router.post(`/press/sort`, formParser.none(), async (request, response, next) => {
    
    const responseData = await updatePressPositions(request.body);
    return response.json(responseData);
});

// PRESS DELETE

router.delete(`/press/:pressID`, formParser.none(), async (request, response, next) => {
    
    const { params: { pressID }} = request;
    const responseData = await deletePress(pressID);
    await deleteImages(pressID, pressDir);
    return response.json(responseData);
});

// FINANCING OFFERS

router.get(`/offers`, async (request, response, next) => {
    
    request.data['layout'] = `admin`;
    request.data['isAdminOffers'] = true;
    request.data['backButton'] = `/admin/`;
    request.data['locationLink'] = `/about-us/financing-offers`;
    const pageID = 8;
    const content = requestContent(await Promise.all([
        requestMeta(pageID), requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/about-us/offers/offers.admin.hbs`;
    response.render(template, data);
});

router.post(`/offers`, formParser.none(), async (request, response, next) => {
    
    const formData = { ...request.body };
    const responseData = await updateMeta(formData);
    return response.json(responseData);
});

// CONTACT US

router.get(`/contact-us`, async (request, response, next) => {
    
    request.data['layout'] = `admin`;
    request.data['isAdminContact'] = true;
    request.data['backButton'] = `/admin/`;
    request.data['locationLink'] = `/about-us/contact-us/`;
    const pageID = 9;
    const content = requestContent(await Promise.all([
        requestMeta(pageID), requestModerateCount(), requestOffices()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/about-us/contact-us/contact-us.admin.hbs`;
    response.render(template, data);
});

router.post(`/contact-us`, formParser.none(), async (request, response, next) => {
    
    const { pageID, pageTitle, pageKeywords, pageDescription, ...settingsData } = request.body;
    const metaData = { pageID, pageTitle, pageKeywords, pageDescription };
    const responseData = await updateMeta(metaData);
    await updateSettings(settingsData);
    return response.json(responseData);
});

router.get(`/contact-us/offices/add`, async (request, response, next) => {
    
    request.data['layout'] = `admin`;
    request.data['isAdminOfficesAdd'] = true;
    request.data['backButton'] = `/admin/about-us/contact-us/`;
    const content = requestContent(await Promise.all([
        requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/about-us/contact-us/offices-add.admin.hbs`;
    response.render(template, data);
});

router.post(`/contact-us/offices/add`, formParser.none(), async (request, response, next) => {
    
    const responseData = await addOffice(request.body);
    return response.json(responseData);
});

router.get(`/contact-us/offices/edit/:officeID`, async (request, response, next) => {
    
    const { params: { officeID }} = request;
    request.data['layout'] = `admin`;
    request.data['isAdminOfficesEdit'] = true;
    request.data['backButton'] = `/admin/about-us/contact-us/`;
    const content = requestContent(await Promise.all([
        requestModerateCount(), requestOfficeByID(officeID)
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/about-us/contact-us/offices-edit.admin.hbs`;
    response.render(template, data);
});

router.post(`/contact-us/offices/edit`, formParser.none(), async (request, response, next) => {
    
    const responseData = await updateOffice(request.body);
    return response.json(responseData);
});

router.delete(`/contact-us/offices/:officeID`, formParser.none(), async (request, response, next) => {
    
    const { params: { officeID }} = request;
    const responseData = await deleteOffice(officeID);
    return response.json(responseData);
});

// PROJECTS MAP

router.get(`/projects-map`, async (request, response, next) => {
    
    request.data['layout'] = `admin`;
    request.data['isAdminProjectsMap'] = true;
    request.data['backButton'] = `/admin/`;
    request.data['locationLink'] = `/about-us/projects-map`;
    const pageID = 8;
    const content = requestContent(await Promise.all([
        requestMeta(pageID), requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/about-us/projects-map/projects-map.admin.hbs`;
    response.render(template, data);
});

module.exports = router;