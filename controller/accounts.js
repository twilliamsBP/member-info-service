const { getAccounts, getAccountsByUser } = require('../service/account-service')
const { createErrorResponse, createSuccessPayloadResponse } = require('./responsewrapper');
const log4js = require("log4js");
const logger = log4js.getLogger();

logger.level = process.env.LOGGING_LEVEL;

const getAccountsHandler = async (event) => {

    try {
  
        const token = event.headers.Authorization;

        let _accounts = await getAccounts(token);

        logger.debug(` accounts ${JSON.stringify(_accounts)} `)
       
        let rtnVal = {
            accounts: _accounts
        }

        return createSuccessPayloadResponse(rtnVal, 200)
    } catch (error) {
        logger.error(error)
        return createErrorResponse(error, 500)
    } 

}

const getAccountsByUserHandler = async (event) => {

    try {
        const { lifeuserid } = event.pathParameters;
        
        logger.debug(` lifeuserid ${lifeuserid} `);
      
        let _accounts = await getAccountsByUser(lifeuserid);

        logger.debug(` accounts ${JSON.stringify(_accounts)} `)
       
        let rtnVal = {
            accounts: _accounts
        }

        return createSuccessPayloadResponse(rtnVal, 200)
    } catch (error) {
        logger.error(error)
        return createErrorResponse(error, 500)
    } 

}

module.exports = { getAccountsHandler, getAccountsByUserHandler };