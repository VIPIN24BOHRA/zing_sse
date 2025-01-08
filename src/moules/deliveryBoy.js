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

const pidgeDeliveryBoyEventHandler = async (data) => {
  if (!data) return false;
  const { reference_id, status, fulfillment } = data;
  if (!reference_id && !status && status != "fulfilled" && !fulfillment)
    return false;
  const currentStatus = fulfillment.status;
  const rider = fulfillment.rider;
  if (!rider) return false;

  const deliveryBoyData = {
    rider_id: rider?.id,
    name: rider?.name,
    mobile: rider?.mobile,
    created_on: data.created_at,
    last_updated_on: data.updated_at,
    status: currentStatus.toLowerCase(),
  };

  console.log(reference_id, status, currentStatus, deliveryBoyData);

  switch (currentStatus.toLowerCase()) {
    case "out_for_pickup":
      return updateDeliveryBoy(reference_id, deliveryBoyData);

    case "reached_pickup":
      return await updateDeliveryBoyStatus(
        reference_id,
        currentStatus.toLowerCase()
      );

    case "out_for_delivery":
      return await updateOrderStatus(reference_id, "OUT FOR DELIVERY");

    case "REACHED_DELIVERY":
      "reached_delivery";
      return await updateDeliveryBoyStatus(
        reference_id,
        currentStatus.toLowerCase()
      );

    case "delivered":
      return await updateOrderDelivered(reference_id);

    default:
      return false;
  }
};

module.exports = { deliveryBoyEventHandler, pidgeDeliveryBoyEventHandler };
