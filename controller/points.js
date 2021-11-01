const { getPoints, getPointsByUser } = require('../service/points-service')
const { createErrorResponse, createSuccessPayloadResponse } = require('./responsewrapper');
const log4js = require("log4js");
const logger = log4js.getLogger();

logger.level = process.env.LOGGING_LEVEL;



const getPointBalanceByUserHandler = async (event) => {

    try {
  
        const { lifeuserid } = event.pathParameters;
        
        logger.debug(` lifeuserid ${lifeuserid} `);

        let _points = await getPointsByUser(lifeuserid);

        logger.debug(` accounts ${JSON.stringify(_points)} `)
       
        let rtnVal = {
            pointBalance: _points
        }

        return createSuccessPayloadResponse(rtnVal, 200)
    } catch (error) {
        logger.error(error)
        return createErrorResponse(error, 500)
    } 

}


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
    } 

}

module.exports = { getPointBalanceHandler, getPointBalanceByUserHandler };