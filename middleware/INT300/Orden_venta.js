/**
 * en un JSON si las llaves son strings vacias se eliminan para evitar hacer updates
 * y que se borre la informacion anterior
 *
 * @param obj {JSON} Es el jason con campos que desean modificarse.
 * @return {JSON} JSON sin llaves que tengan como valor strings vacias.
 */
function deleteKeysWithEmptyValues(obj) {
  for (const key in obj) {
    if (obj[key] === "" || obj[key] === " " || obj[key] === undefined || obj[key] === null) {
      delete obj[key];
    }
  }
  return obj;
}

const orden_ventaJSON = (order, ShipmentLine, data300) => {
  const jsonOrden = {
    CustomerEMailID: order?.CustomerEMailID ?? null,
    EnterpriseCode: order?.EnterpriseCode ?? null,
    DocumentType: order?.DocumentType ?? null,
    SellerOrganizationCode: order?.SellerOrganizationCode ?? null,
    MessageType: order?.MessageType ?? null,
    StatusTimeStamp: order?.StatusTimeStamp ?? null,
    CarrierServiceCode: data300?.CarrierServiceCode ?? null, // Diferentes ubicaciones 201 y 300
    CancelledBy: order?.CancelledBy ?? null,
    ChainType: order?.ChainType ?? null,
    SalesOrderNo: order?.SalesOrderNo ?? null,
    OrderType: order?.OrderType ?? null,
    EntryType: order?.EntryType ?? null,
    TotalAmount: order?.TotalAmount ?? null,
    MaxOrderStatus: order?.MaxOrderStatus ?? null,
    MaxOrderStatusDesc: order?.MaxOrderStatusDesc ?? null,
    MinOrderStatus: order?.MinOrderStatus ?? null,
    MinOrderStatusDesc: order?.MinOrderStatusDesc ?? null,
    OrderDate: order?.OrderDate ?? null,
    OrderName: order?.OrderName ?? null,
    OrderStatus: order?.status ?? null,
    ExtnIsGiftPlusPurchase: order?.Extn?.ExtnIsGiftPlusPurchase ?? null, // no viene en 201
    ExtnIsSelfAllocatedFromPOS: order?.Extn?.ExtnIsSelfAllocatedFromPOS ?? null,
    ExtnPaymentType: order?.Extn?.ExtnPaymentType ?? null,
    ExtnRegion: order?.Extn?.ExtnRegion ?? null,
    DepartmentCode: order?.DepartmentCode ?? null, // En Order Line de la 300
    FulfillmentType: order?.FulfillmentType ?? null, // En OrderLine de la 300
    HasChainedLines: order?.HasChainedLines ?? null, // En Orderline de la 300
    ExtnGRDeliveryDays: order?.Extn?.ExtnGRDeliveryDays ?? null,
    ExtnGREventID: order?.Extn?.ExtnGREventID ?? null,
    ExtnGREventName: order?.Extn?.ExtnGREventName ?? null,
    ExtnGROwnerName: order?.Extn?.ExtnGROwnerName ?? null,
    ExtnPushEmailID: order?.Extn?.ExtnPushEmailID ?? null,
    ExtnOrderType: order?.Extn?.ExtnOrderType ?? null,
  };

  return deleteKeysWithEmptyValues(jsonOrden);
};

module.exports = { orden_ventaJSON, deleteKeysWithEmptyValues };
