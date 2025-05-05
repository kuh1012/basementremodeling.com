const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { requestSelectedSlider } = require("../../models/landings.model");


const formParser = multer();
const uploadDir = `public/upload/landings/`;
const imagesParser = multer({ dest: uploadDir });
const sliderDir = `public/upload/slider/`;
const sliderParser = multer({ dest: sliderDir });
const staticDir = `public/upload/static/`;
const staticParser = multer({ dest: staticDir});

const videoDir = `public/upload/videos/`; // Define the directory for video uploads
const videoParser = multer({
    dest: videoDir,
    limits: { fileSize: 500000000 }, // Limit file size to 500MB (adjust as needed)
    fileFilter: (req, file, cb) => {
        const allowedTypes = /mp4|mov|avi|mkv|webm/;  // Allowed video types
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());  // <-- Use path.extname
        const mimetype = allowedTypes.test(file.mimetype);
        
        if (extname && mimetype) {
            return cb(null, true);  // Accept the file
        } else {
            return cb(new Error('Invalid video type. Only mp4, mov, avi, mkv, and webm files are allowed.'));
        }
    }
});

const { requestContent } = require("../../models/utils.model");
const { requestMeta, requestTextContent, updateMeta, updateContent } = require("../../models/pages.model");
const { saveImages, deleteImages } = require("../../models/images.model");
const {requestLandingPortfolio} = require("../../models/portfolio.model");

const {
    createLanding, createSlide, updateSlidesSelectionVaried, updateStaticsSelectionVaried, createStatic, createTrendingVideo, requestLandings, requestLanding, requestSlider, requestStatic, requestTrendingVideo,
    updateLanding, updateSlide, updateStatic, updatePositions, updateStaticPositions, updateTrendingVideo, deleteLanding, deleteSlide, deleteStatic, updateLandingPortfolioRelations,
    
} = require("../../models/landings.model");
const { requestModerateCount } = require("../../models/ideas.model");
const { singleDB } = require('../../models/db.model');

const landingsImages = [
    {
        name: `landingImage`,
        maxCount: 1,
        sizes: [
            [480, 536, 80],
            [769, 637, 80],
            [1000, 537, 80],
            [1440, 594, 80],
            [1440, 960, 80]
        ],
        output: [`jpeg`, `webp`]
    }
];

const sliderImages = [
    {
        name: `sliderImage`,
        maxCount: 1,
        sizes: [
            [480, 722, 80], [960, 1444, 80],
            [768, 726, 80], [1536, 1452, 80],
            [1000, 619, 80], [2000, 1238, 80],
            [1440, 721, 80], [2880, 1442, 80],
            [1440, 877, 80], [2880, 1754, 80]
        ],
        output: [`jpeg`, `webp`]
    }
];

const staticImages = [
    {
        name: `sliderImage`,
        maxCount: 1,
        sizes: [
            [480, 722, 80], [960, 1444, 80],
            [768, 726, 80], [1536, 1452, 80],
            [1000, 619, 80], [2000, 1238, 80],
            [1440, 721, 80], [2880, 1442, 80],
            [1440, 877, 80], [2880, 1754, 80]
        ],
        output: [`jpeg`, `webp`]
    }
];

// LIST

router.get(`/`, async (request, response, next) => {
    
    request.data['layout'] = `admin`;
    request.data['isAdminLandings'] = true;
    request.data['isHeaderHidden'] = true;
    const content = requestContent(await Promise.all([
        requestLandings(), requestModerateCount(), requestSelectedSlider(),
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/landings/landings.admin.hbs`;
    response.render(template, data);
});

// HOME

router.get(`/home`, async (request, response, next) => {
    
    request.data['layout'] = `admin`;
    request.data['isAdminHome'] = true;
    request.data['backButton'] = `/admin/landings/`;
    request.data['locationLink'] = `/`;
    const pageID = 1;
    const content = requestContent(await Promise.all([
        requestMeta(pageID), requestTextContent(pageID), requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/landings/home.admin.hbs`;
    response.render(template, data);
});

router.post(`/home`, formParser.none(), async (request, response, next) => {
    
    const { pageID, pageTitle, pageDescription, pageKeywords, ...content } = request.body;
    const metaData = { pageID, pageTitle, pageDescription, pageKeywords };
    const responseData = await updateMeta(metaData);
    await updateContent(content);
    return response.json(responseData);
});

// ADD

router.get(`/add`, async (request, response, next) => {
    
    request.data['layout'] = `admin`;
    request.data['isAdminLandingAdd'] = true;
    request.data['backButton'] = `/admin/landings/`;
    const content = requestContent(await Promise.all([
        requestModerateCount()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/landings/add-landing.admin.hbs`;
    response.render(template, data);
});

router.post(`/add`, imagesParser.fields(landingsImages), async (request, response, next) => {
    
    const formData = { ...request.body };
    const responseData = await createLanding(formData);
    const { requestID } = responseData;
    const files = await saveImages(landingsImages, request.files, requestID);
    const filesData = { ...files, ...{ landingID: requestID }};
    await updateLanding(filesData);
    return response.json(responseData);
});

// EDIT

router.get(`/edit/:requestID`, async (request, response, next) => {
    
    request.data['layout'] = `admin`;
    request.data['isAdminLandingsEdit'] = true;
    request.data['backButton'] = `/admin/landings/`;
    const { params: { requestID }} = request;
    const content = requestContent(await Promise.all([
        requestLanding(requestID, false), 
        requestLandingPortfolio({landingPageId : requestID}), 
        requestModerateCount()
    ]));
    request.data['locationLink'] = `/` + content['page']['pageURL'];
    content['portfolioIds'] = content.portfolio.map(obj => obj.portfolioID).join(", ")
    const data = { ...request.data, ...content };
    const template = `admin/landings/edit-landing.admin.hbs`;
    response.render(template, data);
});

router.post(`/edit`, imagesParser.fields(landingsImages), async (request, response, next) => {
    
    const { landingID } = request.body;
    const files = await saveImages(landingsImages, request.files, landingID);
    const { portfolioIds} = request.body;
    delete request.body.portfolioIds;
    const formData = { ...request.body, ...files };
    const responseData = await updateLanding(formData);
    await updateLandingPortfolioRelations({landingID: landingID, portfolioIdsArray : portfolioIds.split(',')})
    return response.json(responseData);
});

router.get(`/header-images`, async (request, response, next) => {
    request.data['layout'] = `admin`;
    request.data['isAdminHeaderImages'] = true;
    request.data['backButton'] = `/admin/landings/`;
    request.data['isHeaderHidden'] = false;
    const content = requestContent(await Promise.all([
        requestModerateCount(), requestSlider()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/landings/header-images.admin.hbs`;
    response.render(template, data);
});

router.post('/header-images/update', async (req, res) => {
    console.log("@@@");
    const { sliders } = req.body;
    console.log("backend - update : ", sliders);
    await updateSlidesSelectionVaried(sliders);
    // Handle the update logic here
    res.status(200).json({ success: true, msg:"Successfully Selected Sliders" });
});

router.post(`/header-images/add`, sliderParser.fields(sliderImages), async (request, response, next) => {
    const slideData = { ...request.body, sliderImage : request.files.sliderImage[0].path };
    const { requestID: sliderID } = await createSlide(slideData);
    const files = await saveImages(sliderImages, request.files, sliderID);
    const updateData = { ...files, sliderID };
    const responseData = await updateSlide(updateData);
    return response.json(responseData);
});

router.post(`/header-images/sort`, formParser.none(), async (request, response, next) => {
    const responseData = await updatePositions(request.body);
    return response.json(responseData);
});

// DELETE

router.delete(`/:landingID`, formParser.none(), async (request, response, next) => {
    
    const { params: { landingID }} = request;
    const responseData = await deleteLanding(landingID);
    await deleteImages(landingID, uploadDir);
    return response.json(responseData);
});

router.delete(`/header-images/:sliderID`, formParser.none(), async (request, response, next) => {
    
    const { params: { sliderID }} = request;
    const responseData = await deleteSlide(sliderID);
    await deleteImages(sliderID, sliderDir);
    return response.json(responseData);
});


//Static Images

router.get(`/static-images`, async (request, response, next) => {
    request.data['layout'] = `admin`;
    request.data['isAdminStaticImages'] = true;
    request.data['isHeaderHidden'] = false;
    request.data['backButton'] = `/admin/landings/`;

    const content = requestContent(await Promise.all([
        requestModerateCount(), requestStatic()
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/landings/static-images.admin.hbs`;
    response.render(template, data);
});

router.post(`/static-images/add`, staticParser.fields(staticImages), async (request, response, next) => {
    const staticData = { ...request.body, sliderImage : request.files.sliderImage[0].path };
    const { requestID: staticID } = await createStatic(staticData);
    const files = await saveImages(staticImages, request.files, staticID);
    const updateData = { ...files, staticID };
    const responseData = await updateStatic(updateData);
    return response.json(responseData);
});

router.post(`/static-images/update`, staticParser.fields(staticImages), async (request, response, next) => {
    const staticData = { ...request.body, sliderImage : request.files.sliderImage[0].path };
    const staticID = Number(staticData.staticID);
    const files = await saveImages(staticImages, request.files, staticID);
    const updateData = { ...files, staticID };
    console.log(staticData);
    const responseData = await updateStatic(updateData);
    return response.json(responseData);
});

router.post(`/static-images/sort`, formParser.none(), async (request, response, next) => {
    const responseData = await updateStaticPositions(request.body);
    return response.json(responseData);
});

router.delete(`/static-images/:staticID`, formParser.none(), async (request, response, next) => {
    
    const { params: { staticID }} = request;
    const responseData = await deleteStatic(staticID);
    await deleteImages(staticID, staticDir);
    return response.json(responseData);
});

router.post('/static-images/update', async (req, res) => {
    const { statics } = req.body;
    console.log("backend - update : ", statics);
    await updateStaticsSelectionVaried(statics);
    // Handle the update logic here
    res.status(200).json({ success: true, msg:"Successfully Selected Statics" });
});

router.get(`/trending-today`, async (request, response, next) => {
    request.data['layout'] = `admin`;
    request.data['isAdminTrendingVideo'] = true;
    request.data['backButton'] = `/admin/landings/`;
    const content = requestContent(await Promise.all([
        requestModerateCount(), requestTrendingVideo(),
    ]));
    const data = { ...request.data, ...content };
    const template = `admin/landings/trending-today.admin.hbs`;
    response.render(template, data);
});


router.post(`/trending-today`, formParser.none(), async (request, response, next) => {
    const videoData = { ...request.body };
    // const { requestID: videoID } = await createTrendingVideo(videoData);
    // const files = await saveImages(videoFile, request.files, videoID);
    // const updateData = { ...files, videoID };s
    const responseData = await updateTrendingVideo(videoData);
    return response.json(responseData);
});

// router.post(`/trending-today`, videoParser.single('videoFile'), async (request, response, next) => {
//     const { body } = request;

//     // if (!request.file) {
//     //     return response.status(400).json({ error: 'No video file uploaded.' });
//     // }

//     // Extract video file details
//     const videoData = {
//         // videoFile: `/${request.file.path}`,
//         ...body, // Include other data from the form if needed
//     };

//     // Save the video data and respond with a result
//     const responseData = await updateTrendingVideo(videoData);
//     return response.json(responseData);
// });

// // GET /api/user-video
// router.get('/trending-today/preview-image', async (req, res) => {
//     // Example: pretend we look this up from a DB
//     // const query = singleDB(`SELECT * FROM trendingVideos WHERE videoFile = ?`, [req.query.videoFile]);
//     const query = await singleDB(`SELECT videoFile FROM trendingVideos WHERE videoFile = ?`, [req.query.videoFile]);
//     if (!query) {
//         return res.status(404).json({ error: 'Video not found' });
//     }
//     const uploadedFilePath = query.videoFile; // or null if not uploaded
  
    
//       const fullPath = path.join('/home/kuh/Documents/v3', uploadedFilePath);
//   console.log(fullPath, uploadedFilePath);
//     fs.access(fullPath, fs.constants.F_OK, (err) => {
//         if (err) {
//             console.error('File does not exist or cannot be accessed:', err);
//             return res.json({ exists: false });
//         }

//         console.log('File exists at path:', fullPath);
//         res.json({ exists: true, path: uploadedFilePath });
//     });
// });


module.exports = router;