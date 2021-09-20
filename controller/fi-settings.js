const { getFiSettings, getFi, getDynamoDbFi } = require('../service/fi-setting-service')
const { createErrorResponse, createSuccessPayloadResponse } = require('./responsewrapper');
const { closeGlobalConnection } = require('../database/db')
const log4js = require("log4js");
const logger = log4js.getLogger();

logger.level = process.env.LOGGING_LEVEL;

const getFiSettingsHandler = async (event) => {

    try {
        const { fi } = event.pathParameters;
        logger.debug(`  fi ${fi}`);

        let fiObj = await getFi(fi);
        let fiSettingsDoc = await getDynamoDbFi(fi)
        let fiSettings = await getFiSettings(fiObj);
      
        let rtnVal = {
            fi: fiObj[0],
            fiSettingsTravel: fiSettingsDoc.Item,
            fiSettingsLegacy: fiSettings
        }

        return createSuccessPayloadResponse(rtnVal, 200)
    } catch (error) {
        logger.error(error)
        return createErrorResponse(error, 500)
    } finally {
        await closeGlobalConnection();
    }

}

module.exports = { getFiSettingsHandler };