const { db } = require("./db.js");
async function recentDeliveredOrder(ts) {
  try {
    const snapshot = await db
      .ref("/orders")
      .orderByChild("deliveredAt")
      .startAt(ts)
      .endAt(Date.now())
      .once("value");
    if (snapshot.exists) {
      Object.values(snapshot.val() ?? {}).forEach((order) => {
        console.log(
          order
          //   new Date(order.deliveredAt).toLocaleString()
        );
      });
      // send notification for only the delivered order
    } else {
      console.log("no data present");
    }
  } catch (err) {
    console.log(err);
  }
}

async function updateOrderStatus(orderId, status) {
  try {
    console.log("update order status", orderId, status);
    await db.ref(`/orders/${orderId}/status`).set(status);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function updateDeliveryBoyStatus(orderId, status) {
  try {
    console.log("update delivery boy status", orderId, status);
    await db.ref(`/orders/${orderId}/deliveryBoy/status`).set(status);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function updateDeliveryBoy(orderId, data) {
  console.log("update delivery boy", orderId, data);
  try {
    await db.ref(`/orders/${orderId}/deliveryBoy/`).set(data);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function updateOrderDelivered(orderId) {
  console.log("update delivery boy", orderId);
  try {
    const newOrder = { status: "Delivered", deliveredAt: Date.now() };

    await db.ref(`/orders/${orderId}`).update(newOrder);
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

module.exports = {
  recentDeliveredOrder,
  updateDeliveryBoyStatus,
  updateDeliveryBoy,
  updateOrderStatus,
  updateOrderDelivered,
};
