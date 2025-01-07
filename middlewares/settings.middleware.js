const { requestSettingsData } = require("../models/settings.model");
const fs = require("fs")
const logger = require('./logger.middleware');
const version = fs.readFileSync('.applicationVersion').toString();
const requestSettings = async (request, response, next) => {
    try {
        const settingsData = await requestSettingsData();
        request.data = { ...request.data, ...settingsData, applicationVersion : version };
        next();
    } catch (error) {
        logger.log({'level':'error','message' : error.stack, 'inputs' : [...arguments][0] })
        request.data['applicationVersion'] = version;
        next();
    }
};

module.exports = requestSettings;