
const log4js = require("log4js");
const needle = require('needle');
const logger = log4js.getLogger();
logger.level = process.env.LOGGING_LEVEL;

const getPoints = async (userToken) => {

    let points
  
    var options = {
      headers: { 'Authorization': userToken }
    }
  
    logger.debug(` userToken ${userToken}`)
    logger.debug(` process.env.GET_LIFEUSER_POINTS ${process.env.GET_LIFEUSER_POINTS} `)
    const pointsApi = process.env.GET_LIFEUSER_POINTS
  
    try {
  
      const response = await needle('get', pointsApi, options)
      if (response.statusCode !== 200) {
        logger.error(`failed retrieving latest snapshot from ${pointsApi}: ${response.statusCode}`);
        throw new Error('failed on retrieval of total points for user ');
      }
  
      points = response.body.totalPoints
  
    } catch (err) { logger.error(err) }
  
  
    return points
  
  }

  module.exports = { getPoints }