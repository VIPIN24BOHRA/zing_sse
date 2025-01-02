const {
  updateDeliveryBoy,
  updateDeliveryBoyStatus,
  updateOrderStatus,
  updateOrderDelivered,
} = require("./firebase");

const deliveryBoyEventHandler = async (type, event, data) => {
  const deliveryBoyData = {
    rider_id: data.rider_id,
    name: data.rider_name,
    mobile: data.mobile_number,
    created_on: data.created_on,
    last_updated_on: data.last_updated_on,
    status: event.toLowerCase(),
  };

  const order_id = data.notes;

  console.log(order_id, deliveryBoyData.status);
  if (type && type.toLowerCase() == "update") {
    switch (event.toLowerCase()) {
      case "accepted":
        return updateDeliveryBoy(order_id, deliveryBoyData);

      case "assigned":
        return await updateDeliveryBoy(order_id, deliveryBoyData);

      case "reached_destination":
        return await updateDeliveryBoyStatus(order_id, event.toLowerCase());

      case "dispatch":
        return await updateOrderStatus(order_id, "OUT FOR DELIVERY");

      case "reached_pick_up":
        return await updateDeliveryBoyStatus(order_id, event.toLowerCase());

      case "delivered":
        return await updateOrderDelivered(order_id);

      case "rider_removed":
        return await updateDeliveryBoyStatus(order_id, event.toLowerCase());

      default:
        return false;
    }
  }
  return false;
};

module.exports = { deliveryBoyEventHandler };
