const KnexClient = require('knex');
const log4js = require("log4js");
const logger = log4js.getLogger();
logger.level = process.env.LOGGING_LEVEL;
let fiConn = new Map();
let globalConn;
let rewardConn;
let cardHolderConn;

const isEmpty = (val) => {
    return (val === null || (typeof val === 'undefined')) ? true : false;
}

const getFi = async (lifeUserId) => {
    

    try {
  
      globalClient = await getGlobalClient();
  
      await globalClient.transaction(async trx => {

        fi = await trx.select('fi.id','fi.ivrid',
        {lifeuserid: 'lifeuser.id'},'lifeuser.email')
          .from('ficonnection')
          .join('fi', 'ficonnection.fi_id', '=', 'fi.id')
          .join('lifeuser', 'ficonnection.lifeuser_id' ,'lifeuser.id')
          .where('ficonnection.lifeuser_id', lifeUserId)
      });

      return fi
  
    } catch (error) {
      logger.error(error)
      throw  error
    } 
  
  }

const closeMappedFiClients = async () => {

    try {

        if (fiConn.size > 0 ) {
            fiConn.forEach(conn => {
                try {
                    logger.debug(' Destroying FI client')
                    conn.destroy();
                   
                } catch (error) {
                    logger.error(error)
                }
            });
        } 

    } catch (error) {
        logger.error(error)
    } finally {
        logger.debug(' Clearing fiConn Map')
        fiConn.clear()

    }

}

const closeGlobalConnection = async () => {

        if (!isEmpty(globalConn)) {
            logger.debug(' closing globalconn')
                try {
                    globalConn.destroy();
                    globalConn = null;
                } catch (error) {
                    logger.error(error)
                }
    }

}

const closeRewardConnection = async () => {

    if (!isEmpty(rewardConn)) {
        logger.debug(' closing rewardConn')
            try {
                rewardConn.destroy();
                rewardConn = null;
            } catch (error) {
                logger.error(error)
            }
    }

}

const closeCardHolderConnection = async () => {

    if (!isEmpty(cardHolderConn)) {
        logger.debug(' closing cardHolderConn')
            try {
                cardHolderConn.destroy();
                cardHolderConn = null;
            } catch (error) {
                logger.error(error)
            }
    }

}

const closeMappedFiClient = async (fi) => {

    try {

        logger.debug(fiConn.size)

        if (fiConn.has(fi)) {
           conn =  fiConn.get(fi)
                try {
                    conn.destroy();
                    fiConn.delete(fi)
                    logger.debug(' Closed ' + fi + ' connection' )
                } catch (error) {
                    logger.error(error)
                }
            }

    } catch (error) {
        logger.error(error)
    } finally {
        if (fiConn.size === 0) {
            logger.debug(` All Fi's have been removed Clearing fiConn map`)
            fiConn.clear()
        }
       
    }

}

const getMappedFiClient = async (fi) => {

    if (!fiConn.has(fi)) {
        logger.debug(' Instantiating new connection for FI ' + fi)
        try {
            fiConn.set(fi, new KnexClient({
                client: 'pg',
                version: '7.2',
                connection: {
                    host: process.env.RDS_PROXY_FI_ENDPOINT,
                    user: process.env.RDS_IAM_USER_FI,
                    password: process.env.RDS_IAM_USER_FI,
                    database: `${process.env.RDS_DATABASE_FI}_${fi}`,
                    ssl: {
                        rejectUnauthorized: false
                    },
                    port: 5432
                }
            }))
        } catch (error) {
            logger.error('ERROR ' + error)
            throw new Error(error)
        }
    } else {logger.debug(' getting cached connection for FI ' + fi)}

    return fiConn.get(fi)
}


const getFiClient = async (fi) => {

    try {
        return new KnexClient({
            client: 'pg',
            version: '7.2',
            connection: {
                host: process.env.RDS_PROXY_FI_ENDPOINT,
                user: process.env.RDS_IAM_USER_FI,
                password: process.env.RDS_IAM_USER_FI,
                database: `${process.env.RDS_DATABASE_FI}_${fi}`,
                ssl: {
                    rejectUnauthorized: false
                },
                port: 5432
            }
        })
    } catch (err) {
        logger.error(err)
    }
}

const getGlobalClient = async () => {

    if (isEmpty(globalConn)) {
        logger.debug(' instantiating globalConn client')
        try{
        globalConn = new KnexClient({
            client: 'pg',
            version: '7.2',
            connection: {
                host: process.env.RDS_PROXY_ENDPOINT_GLOBAL,
                user: process.env.RDS_IAM_USER_GLOBAL,
                password: process.env.RDS_IAM_USER_GLOBAL,
                database: process.env.RDS_DATABASE_GLOBAL,
                ssl: {
                    rejectUnauthorized: false
                },
                port: 5432
            }
        })
    } catch(error) {
        logger.error(`error getting globalClient ${error}`)
       }
    } else {
        logger.debug(' using active globalConn client')
    }

    return globalConn
}

const getRewardClient = async () => {

    if (isEmpty(rewardConn)) {
        logger.debug(' instantiating rewardConn client')
        rewardConn = new KnexClient({
            client: 'pg',
            version: '7.2',
            connection: {
                host: process.env.RDS_PROXY_ENDPOINT_CLR,
                user: process.env.RDS_IAM_USER_CLR,
                password: process.env.RDS_IAM_USER_CLR,
                database: process.env.RDS_DATABASE_REWARD,
                ssl: {
                    rejectUnauthorized: false
                },
                port: 5432
            }
        })

    }  else {
        logger.debug(' using active rewardConn client')
    }

    return rewardConn

}

const getCardHolderClient = async () => {

    if (isEmpty(cardHolderConn)) {
        logger.debug(' instantiating cardHolderConn client')
        cardHolderConn = new KnexClient({
            client: 'pg',
            version: '7.2',
            connection: {
                host: process.env.RDS_PROXY_ENDPOINT_CLR,
                user: process.env.RDS_IAM_USER_CLR,
                password: process.env.RDS_IAM_USER_CLR,
                database: process.env.RDS_DATABASE_CARDHOLDER,
                ssl: {
                    rejectUnauthorized: false
                },
                port: 5432
            }
        })

    }  else {
        logger.debug(' using active cardHolderConn client')
    }

    return cardHolderConn

}

module.exports = { getGlobalClient, getFiClient, getRewardClient, getMappedFiClient, 
                   closeMappedFiClients, closeMappedFiClient, closeGlobalConnection,
                   getFi, getCardHolderClient, closeRewardConnection , closeCardHolderConnection}