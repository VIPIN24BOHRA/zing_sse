const {
  updateDeliveryBoy,
  updateDeliveryBoyStatus,
  updateOrderStatus,
  updateOrderDelivered,
} = require("./firebase");

const pidgeDeliveryBoyEventHandler = async (data) => {
  if (!data) return false;
  const { status, fulfillment, dd_channel, id } = data;
  console.log(status, dd_channel);

  if (!status && !dd_channel && !id) return false;
  const orderId = dd_channel.order_id;

  if (status == "pending")
    return await updateDeliveryBoyStatus(
      orderId,
      id,
      "PENDING",
      data.updated_at
    );

  if (status != "fulfilled" && !fulfillment) return false;

  const currentStatus = fulfillment.status;
  const rider = fulfillment.rider;

  if (!rider && !orderId && !currentStatus) return false;

  const deliveryBoyData = {
    id: id,
    rider_id: rider?.id,
    name: rider?.name,
    mobile: rider?.mobile,
    created_on: data.created_at,
    last_updated_on: data.updated_at,
    status: currentStatus,
  };

  console.log(orderId, status, currentStatus, rider?.name);

  switch (currentStatus) {
    case "CREATED":
      return await updateDeliveryBoyStatus(
        orderId,
        id,
        currentStatus,
        data.updated_at
      );
    case "OUT_FOR_PICKUP":
      return updateDeliveryBoy(orderId, deliveryBoyData, data.updated_at);

    case "REACHED_PICKUP":
      return await updateDeliveryBoyStatus(
        orderId,
        id,
        currentStatus,
        data.updated_at
      );

    case "PICKED_UP":
      return await updateOrderStatus(orderId, "OUT FOR DELIVERY");
      // return await updateDeliveryBoyStatus(
      //   orderId,
      //   id,
      //   currentStatus,
      //   data.updated_at
      // );

    // case "OUT_FOR_DELIVERY":
    //   return await updateOrderStatus(orderId, "OUT FOR DELIVERY");

    case "REACHED_DELIVERY":
      return await updateDeliveryBoyStatus(
        orderId,
        id,
        currentStatus,
        data.updated_at
      );

    case "DELIVERED":
      return await updateOrderDelivered(orderId);

    default:
      return false;
  }
};

module.exports = { pidgeDeliveryBoyEventHandler };
