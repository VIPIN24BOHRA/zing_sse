const { getStatus, updateStatus, removeKey, viewCache } = require("./cache");
const Producer = require("./produce/index");
const handleCashpoint = async (orderId, order) => {
  if (order.status?.toLowerCase() == "delivered" && getStatus(orderId)) {
    Producer.cashpointHandler(order);
  }

  updateStatus(orderId, order.status);
  viewCache();
};

const connect = async () => {
  try {
    await Producer._init();
  } catch (err) {
    console.log(err);
  }
};

module.exports = { connect, handleCashpoint };
