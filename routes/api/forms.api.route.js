const { Router } = require(`express`);
const router = new Router();
const multer = require('multer');
const formParser = multer();

const { sendClientMail, sendOwnerMail,sendWebhook } = require("../../models/mail.model");

const {
    checkRequestData, checkQuoteData
} = require("../../controllers/forms.controller");
const { saveRequest, saveQuote } = require("../../models/forms.model");

// API /api/forms/request - POST
router.post(`/request`, formParser.none(), async (request, response) => {
    //const clientTemplate = `contact-us.email`;
    //const ownerTemplate = `contact-us.admin.email`;
    const formData = checkRequestData(request.body);
    //const clientMail = request.body['email'];
    //await sendClientMail(formData, clientTemplate, clientMail);
    //await sendOwnerMail(formData, ownerTemplate);
    sendWebhook({...formData},'contactUsWebhook');
    const data = await saveRequest(formData);
    return response.json(data);
});
 
// API /api/forms/quote - POST
router.post(`/quote`, formParser.none(), async (request, response) => {
    //const clientTemplate = `booking.email`;
    //const ownerTemplate = `booking.admin.email`;
    const formData = checkQuoteData(request.body);
    //const clientMail = request.body['email'];
    //await sendClientMail(formData, clientTemplate, clientMail);
    //await sendOwnerMail(formData, ownerTemplate);
    sendWebhook({...formData},'getOnlineQuoteWebhook');
    const data = await saveQuote(formData);
    return response.json(data);
});

module.exports = router;