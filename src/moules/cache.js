// create a localCache store status of orders [order_id] : order_status
// remove the key if the order_status changes to delivered or cancelled.

const orderStatusCache = {};

const getStatus = (key) => orderStatusCache[key];

const updateStatus = (key, status) => {
  if (
    status?.toLowerCase() === "delivered" ||
    status?.toLowerCase() === "cancelled"
  ) {
    console.log(`remove ${key}`);
    delete orderStatusCache[key];
  } else {
    orderStatusCache[key] = status?.toLowerCase();
  }
};

const removeKey = (key) => delete orderStatusCache[key];

const viewCache = () => console.log(orderStatusCache);

module.exports = { getStatus, updateStatus, removeKey, viewCache };
