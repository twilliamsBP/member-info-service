const { getGlobalClient, getMappedFiClient } = require('../database/db');
const log4js = require("log4js");
const AWS = require("aws-sdk");
AWS.config.update({ region: 'us-east-1' });

const logger = log4js.getLogger();
logger.level = process.env.LOGGING_LEVEL;

const getFiSettings = async (fiObj) => {
  let rtnVal;

  try {

    globalClient = await getGlobalClient();

    logger.debug(`fiId = ${fiObj[0].id}`);

    await globalClient.transaction(async trx => {

      rtnVal = await trx.select('key', 'value')
        .from('fi_setting')
        .where({ fi_id: fiObj[0].id })
    });

  } catch (error) {
    logger.error(`Error getting FI Settings ${error}`);
    throw error;
  } finally {

  }

  return rtnVal;

}

const getDynamoDbFi = async (fi_id) => {

  let docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-10-17' });
  let docResult;

  logger.debug(`   passed in fi = ${fi_id} `)

  try {

    const params = {
      TableName: 'fi-settings',
      Key: {
       fi: fi_id
      }
     };

     try {
        docResult = await docClient.get(params).promise();
      }
      catch (error) { logger.error(` doc error ${error}`) }
    
  
  } catch (error) {
    logger.error(` Dynamo error ${error} `);
  }

  return docResult;
}

const getFiLifeUserObj = async (lifeUserId) => {
  logger.debug(`getting fi for  ${lifeUserId}`)
  let fi

  try {

    await (await getGlobalClient()).transaction(async trx => {

      fi = await trx.select('fi.id','fi.ivrid',
      {lifeUserId: 'lifeuser.id'},'lifeuser.email')
        .from('ficonnection')
        .join('fi', 'ficonnection.fi_id', '=', 'fi.id')
        .join('lifeuser', 'ficonnection.lifeuser_id' ,'lifeuser.id')
        .where('ficonnection.lifeuser_id', lifeUserId)
    });

  } catch (error) {
    logger.error(`Error getting FI ${error}`);
    throw error

  }

  return fi
}


const getFi = async (fi_id) => {
  logger.debug(`getting fi for  ${fi_id}`)
  let fi

  try {

    globalClient = await getGlobalClient();

    await globalClient.transaction(async trx => {

      fi = await trx.select('fi.id', 'fi.ivrid', 'fi.title', 'fi.status')
        .from('fi')
        .where('fi.id', fi_id)
    });

  } catch (error) {
    logger.error(`Error getting FI ${error}`);
    throw error

  }

  logger.debug(` fi ${JSON.stringify(fi)} `)

  return fi
}


module.exports = { getFiSettings, getDynamoDbFi, getFi, getFiLifeUserObj }