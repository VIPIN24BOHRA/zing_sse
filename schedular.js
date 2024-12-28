require("dotenv").config();
const { db } = require("./src/moules/db.js");

async function readRecentDeliveredOrder() {
  const tsHalfAnHourBefore = Date.now() - 30 * 60 * 1000;
  console.log(
    tsHalfAnHourBefore,
    new Date(tsHalfAnHourBefore).toLocaleString()
  );
  try {
    const snapshot = await db
      .ref("/orders")
      .orderByChild("deliveredAt")
      .startAt(tsHalfAnHourBefore)
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
