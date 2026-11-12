/**
 * en un JSON si las llaves son strings vacias se eliminan para evitar hacer updates y que se borre la informacion anterior
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

const orden_ventaJSON = (data, previo) => {
  const jsonOrden = {
    CustomerEMailID: data?.CustomerEMailID ?? null,
    EnterpriseCode: data?.EnterpriseCode ?? null,
    DocumentType: data?.DocumentType ?? null,
    SellerOrganizationCode: data?.SellerOrganizationCode ?? null,
    MessageType: data?.MessageType ?? null,
    StatusTimeStamp: (data?.StatusTimeStamp ?? null),
    CarrierServiceCode: data?.CarrierServiceCode ?? null, // Diferentes ubicaciones 201 y 300
    CancelledBy: data?.CancelledBy ?? null,
    ChainType: data?.ChainType ?? null,
    SalesOrderNo: data?.SalesOrderNo ?? null,
    OrderType: data?.OrderType ?? null,
    EntryType: data?.EntryType ?? null,
    TotalAmount: data?.TotalAmount ?? null,
    MaxOrderStatus: data?.MaxOrderStatus ?? null,
    MaxOrderStatusDesc: data?.MaxOrderStatusDesc ?? null,
    MinOrderStatus: data?.MinOrderStatus ?? null,
    MinOrderStatusDesc: data?.MinOrderStatusDesc ?? null,
    OrderDate: data?.OrderDate ?? null,
    OrderName: data?.OrderName ?? null,
    OrderStatusPrevio: data?.OrderStatus ?? null,
    OrderStatus: data?.OrderStatus ?? null,
    ExtnIsGiftPlusPurchase: data?.ExtnIsGiftPlusPurchase ?? null, // no viene en 201
    ExtnIsSelfAllocatedFromPOS: data?.ExtnIsSelfAllocatedFromPOS ?? null,
    ExtnPaymentType: data?.ExtnPaymentType ?? null,
    ExtnRegion: data?.ExtnRegion ?? null,
    DepartmentCode: data?.DepartmentCode ?? null, // En Order Line de la 300
    FulfillmentType: data?.FulfillmentType ?? null, // En OrderLine de la 300
    HasChainedLines: data?.HasChainedLines ?? null, // En Orderline de la 300
    ExtnGRDeliveryDays: data?.Extn?.ExtnGRDeliveryDays ?? null,
    ExtnGREventID: data?.Extn?.ExtnGREventID ?? null,
    ExtnGREventName: data?.Extn?.ExtnGREventName ?? null,
    ExtnGROwnerName: data?.Extn?.ExtnGROwnerName ?? null,
    ExtnPushEmailID: data?.Extn?.ExtnPushEmailID ?? null,
    ExtnOrderType: data?.Extn?.ExtnOrderType ?? null,
  };

  if (data?.References?.Reference?.length > 0) {
    for (referencia of data.References.Reference) {
      jsonOrden[referencia.Name.trim()] = referencia.Value;
    }
  }

  return deleteKeysWithEmptyValues(jsonOrden);
};

module.exports = { orden_ventaJSON, deleteKeysWithEmptyValues };
