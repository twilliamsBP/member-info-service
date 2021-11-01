const { getGlobalClient, getMappedFiClient } = require('../database/db');
const log4js = require("log4js");
const needle = require('needle');
const logger = log4js.getLogger();
logger.level = process.env.LOGGING_LEVEL;

const getUserInfo = async (lifeuserid) => {



}

const getUserAddress = async (lifeuserid) => {

        logger.debug(`getting userAddress for  ${lifeuserid}`)
        let userAddress;
      
        try {

    
          await (await getGlobalClient()).transaction(async trx => {
      
            userAddress = await trx.select('address.addressline1', 'address.addressline2','address.city',
            'address.state','address.zip', 'lifeuser.homephone', 'lifeuser.mobilephone', 'lifeuser.email')
              .from('lifeuser')
              .join('address', 'lifeuser.homeaddress_id', '=', 'address.id')
              .where('lifeuser.id', lifeuserid)
          });
      
        } catch (error) {
          logger.error(`Error getting User Info ${error}`);
          throw error
      
        }
      
        return userAddress
      }




module.exports = { getUserInfo, getUserAddress }