const { connectBroker } = require("./connect");

let channel;

const QUEUE = "CASHPOINTS";

const cashpointHandler = (order) => {
  console.log("handle order delivered", order);
  if (!channel) {
    console.log("channel is not connected");
    return;
  }
  const event = {};

  if (order.coupon?.toLowerCase() == "cashpoint") {
    event.type = "remove";
    event.data = {
      uid: order.uid,
      removePoints: order.discount,
      createdAt: order.createdAt,
    };

    channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(event)));
  } else if (!order.coupon) {
    event.type = "add";

    event.data = {
      createdAt: order.createdAt,
      uid: order.uid,
      points: Math.floor(order.totalPrice * 0.05),  // 5 % of total value.
      expireAt: order.createdAt + 1000 * 60 * 60 * 24 * 3,
      isValid: `1${order.createdAt + 1000 * 60 * 60 * 24 * 3}`,
      queryField: `1_${order.uid}_${order.createdAt + 1000 * 60 * 60 * 24 * 3}`,
      orderNo: order.orderNo,
      name: order.name,
    };
    console.log("sending to queue", event);
    channel.sendToQueue(QUEUE, Buffer.from(JSON.stringify(event)));
  }
};

async function _init() {
  try {
    channel = await connectBroker();
    console.log("assert queue");
    await channel.assertQueue(QUEUE, {
      durable: false,
    });

    return channel;
  } catch (err) {
    throw err;
  }
}

module.exports = { _init, cashpointHandler };
