const amqp = require("amqplib");
const config = require("../../../config.js");

const connectBroker = async () => {
  try {
    console.log("connecting to broker");
    const connection = await amqp.connect(config.rbmqConnectionString);
    console.log("creating channel");
    const channel = await connection.createChannel();
    return channel;
  } catch (err) {
    throw err;
  }
};

module.exports = { connectBroker };
