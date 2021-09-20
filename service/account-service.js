const log4js = require("log4js");
const logger = log4js.getLogger();
const needle = require('needle');

const getAccounts = async (userToken) => {

    let accounts 

    var options = {
        headers: { 'Authorization': userToken }
    }

    logger.debug(` process.env.GET_LIFEUSER_ACCOUNTS ${process.env.GET_LIFEUSER_ACCOUNTS} `)
    const accountApi = process.env.GET_LIFEUSER_ACCOUNTS

    try {

        const response = await needle('get', accountApi, options);

        try { logger.debug(` response ${JSON.stringify(response.body)} `);  } catch (error) {logger.debug(`  error  ${error}`)}
        try { logger.debug(` response ${JSON.stringify(response.statusCode)} `);  } catch (error) {logger.debug(`  error  ${error}`)}
       
        if (response.statusCode !== 200) {
            logger.error(`failed retrieving latest Accounts from ${accountApi}: ${response.statusCode}`);
            throw new Error('failed on retrieval of Accounts for user ');
           }
          
           accounts = response.body.response.fiAccounts
       
    } catch(error){
      logger.error(`Error getting Accounts from API ${accountApi}  error: ${error}`);
    }
   
   
    return accounts

}

module.exports = { getAccounts }