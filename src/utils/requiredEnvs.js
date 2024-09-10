const config = require("../config");
const logger = require("./logger");
const {
  PORT
} = process.env;
const requiredEnvs = {
  PORT
};

const validateRequiredEnvs = () => {
  let errCount=0;

  for (const [ key, value ] of Object.entries(requiredEnvs)) {
    if(!value){
      errCount++;
      logger.error(`The ${key} environment variable is required !!!`);
    }
  }
  if (errCount>0) {
    // logger.error(errors);
    process.exit(1);
  }
};

module.exports = validateRequiredEnvs;