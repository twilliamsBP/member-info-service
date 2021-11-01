const { getFiSettings, getFi, getDynamoDbFi, getFiLifeUserObj } = require('../service/fi-setting-service')
const { getUserAddress } = require('../service/user-service')
const { createErrorResponse, createSuccessPayloadResponse } = require('./responsewrapper');
const { closeGlobalConnection } = require('../database/db')
const log4js = require("log4js");
const logger = log4js.getLogger();

logger.level = process.env.LOGGING_LEVEL;

const getMemberInfo = async (event) => {

    try {

        const { lifeuserid } = event.pathParameters;
     
        logger.debug(`  lifeuserid ${lifeuserid}`);
  
        let fiObj = await getFiLifeUserObj(lifeuserid);
        let profile;
        let program;
        let branding;
        let address = await getUserAddress(lifeuserid)

        logger.debug(` fiObbj = ${JSON.stringify(fiObj)}  `);
        const fi =  fiObj[0].id 
        logger.debug(` fi = ${JSON.stringify(fi)}  `);
       
        let fiSettingsDoc = await getDynamoDbFi(fi)
        let fiSettings = await getFiSettings(fiObj);
      
        let rtnVal = {
            fiSettingsDoc: fiSettingsDoc,
            fiettings: fiSettings,
            address: address,
            fi: fiObj[0]
        }

        return createSuccessPayloadResponse(rtnVal, 200)
    } catch (error) {
        logger.error(error)
        return createErrorResponse(error, 500)
    } finally {
        await closeGlobalConnection();
    }

}

module.exports = { getMemberInfo };