const { getPoints } = require('../service/points-service')
const { createErrorResponse, createSuccessPayloadResponse } = require('./responsewrapper');
const { closeGlobalConnection } = require('../database/db')
const log4js = require("log4js");
const logger = log4js.getLogger();

logger.level = process.env.LOGGING_LEVEL;

const getPointBalanceHandler = async (event) => {

    try {
  
        const token = event.headers.Authorization;

        let _points = await getPoints(token);

        logger.debug(` accounts ${JSON.stringify(_points)} `)
       
        let rtnVal = {
            pointBalance: _points
        }

        return createSuccessPayloadResponse(rtnVal, 200)
    } catch (error) {
        logger.error(error)
        return createErrorResponse(error, 500)
    } finally {
        await closeGlobalConnection();
    }

}

module.exports = { getPointBalanceHandler };