const { SaveXd } = require("../repositories/XdRepository");
const log4js = require('log4js');
const configlog4 = require('../log4js.json');
log4js.configure(configlog4);
const logger = log4js.getLogger('XdServices');
exports.InsertXd = async (payload, res) =>{
    logger.info("En metodo persistir tabla XD")

    try {
        const newXd = await SaveXd(payload)
        if (newXd !== null){
            logger.info("Insert on XD Table")
        } else {
            logger.info("Fail on Insert XD")
        }
    }catch (error){
        logger.error(error)
    }
}
