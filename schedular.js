// require("dotenv").config();
// const { db } = require("./src/moules/db.js");
// const {
//   checkIfAlreadyRated,
//   sendPushNotification,
// } = require("./src/moules/firebase.js");

// const CRON_TIME_MS = 30 * 60 * 1000;

// async function sendRatingNotification(orderId, order) {
//   const isAlreadyRated = await checkIfAlreadyRated(orderId);
//   if (!isAlreadyRated) {
//     await sendPushNotification(
//       order.uid,
//       "Rate your order",
//       "How was your food ? Please rate your experience to help us serve you better"
//     );
//   }
// }

// async function readRecentDeliveredOrder() {
//   const startAt = Date.now() - 60 * 60 * 1000;
//   const endAt = Date.now() - 30 * 60 * 1000;
//   console.log(
//     "read recent order ",
//     new Date(startAt).toLocaleString(),
//     new Date(endAt).toLocaleString()
//   );
//   try {
//     const snapshot = await db
//       .ref("/orders")
//       .orderByChild("deliveredAt")
//       .startAt(startAt)
//       .endAt(endAt)
//       .once("value");
//     if (snapshot.exists) {
//       const orderMap = snapshot.val() ?? {};
//       const orderIds = Object.keys(orderMap);

//       for (let i = 0; i < orderIds.length; i++) {
//         const orderId = orderIds[i];
//         const order = orderMap[orderId];

//         console.log(
//           orderId,
//           order.orderNo,
//           order.uid,
//           new Date(order.deliveredAt).toLocaleString()
//         );

//         await sendRatingNotification(orderId, order);
//       }
//     } else {
//       console.log("no data present");
//     }
//   } catch (err) {
//     console.log(err);
//   }
// }

// const ratingSchedular = async () => {
//   console.log("rating cron is up and running");
//   setInterval(() => {
//     readRecentDeliveredOrder();
//   }, CRON_TIME_MS);
// };

// ratingSchedular();
