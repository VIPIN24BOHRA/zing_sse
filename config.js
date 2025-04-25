const dotenv = require("dotenv");

dotenv.config();

const config = {
  fbServiceKey: process.env.FIREBASE_SERVICE_KEY,
  rbmqConnectionString: process.env.RABBIT_MQ_CONNECTION_STRING,
  port: process.env.PORT,
};

module.exports = config;
