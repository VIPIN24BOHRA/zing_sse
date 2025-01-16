const { db, messaging } = require("./db.js");

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

async function updateDeliveryBoyStatus(orderId, status, last_updated_on) {
  try {
    console.log("update delivery boy status", orderId, status);
    await db
      .ref(`/orders/${orderId}/deliveryBoy`)
      .update({ status, last_updated_on });
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

async function checkIfAlreadyRated(orderId) {
  console.log("check if already rated");
  try {
    const snapshot = await db.ref(`/ratings/${orderId}`).once("value");
    if (snapshot.exists()) {
      return true;
    } else return false;
  } catch (err) {
    console.log("error while checking already rated", err);
    return false;
  }
}

const sendPushNotification = async (userId, title, body) => {
  try {
    // Fetch user's FCM token
    const userSnapshot = await db.ref(`/users/${userId}/token`).once("value");
    const fcmToken = userSnapshot.val();

    if (!fcmToken) {
      console.log(`No FCM token for user ${userId}`);
      return;
    }

    // Create notification payload
    const payload = {
      notification: {
        title,
        body,
      },
      token: fcmToken,
    };

    // Send notification using Firebase Messaging
    await messaging.send(payload);
    console.log(`Notification sent to user ${userId}`);
  } catch (error) {
    console.error(`Error sending notification to user ${userId}:`, error);
  }
};

module.exports = {
  updateDeliveryBoyStatus,
  updateDeliveryBoy,
  updateOrderStatus,
  updateOrderDelivered,
  checkIfAlreadyRated,
  sendPushNotification,
};
