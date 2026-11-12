const { deleteKeysWithEmptyValues } = require("./Orden_venta");

const lineaJSON = (OrderLine, data201, previa) => {
    const jsonLinea = {
        ItemID: OrderLine?.Item?.ItemID ?? null,
        DeliveryMethod: OrderLine?.DeliveryMethod ?? null,
        ChangeInOrderedQty: OrderLine?.ChangeInOrderedQty ?? null,
        BackOrderedQuantity: OrderLine?.BackOrderedQuantity ?? null,
        PrimeLineNo: OrderLine?.PrimeLineNo ?? null,
        ShipNode: OrderLine?.ShipNode ?? null,
        ReceivingNode: OrderLine?.ReceivingNode ?? null,
        StoreDesc: OrderLine?.StoreDesc ?? null,
        StatusLine: OrderLine?.Status ?? null,
        StatusLinePrevio: previa?.StatusLine ?? null,
        OrderLineStatus: OrderLine?.OrderLineStatus ?? null,
        CarrierServiceCode: OrderLine?.CarrierServiceCodes?.CarrierServiceCode?.CarrierServiceCode
            ?? null, // Diferentes ubicaciones 201 y 300
        ShipNode_CarrierServiceCode: OrderLine?.CarrierServiceCodes?.CarrierServiceCode?.ShipNode
            ?? null, // Diferentes ubicaciones 201 y 300
        IsCancellable: OrderLine?.IsCancellable ?? null,
        LineType: OrderLine?.LineType ?? null,
        MaxLineStatus: OrderLine?.MaxLineStatus ?? null,
        MaxLineStatusDesc: OrderLine?.MaxLineStatusDesc ?? null,
        MinLineStatus: OrderLine?.MinLineStatus ?? null,
        MinLineStatusDesc: OrderLine?.MinLineStatusDesc ?? null,
        ReqDeliveryDate: OrderLine?.ReqDeliveryDate ?? null,
        SubLineNo: OrderLine?.SubLineNo ?? null,
        EDDHasChanged: OrderLine?.EDDHasChanged ?? null,
        ExpectedDeliveryDate: OrderLine?.ExpectedDeliveryDate ?? null,
        ExtnDeliveryType: OrderLine?.ExtnDeliveryType ?? null,
        ExtnNoSpotService: OrderLine?.Extn?.ExtnNoSpotService ?? null,
        ExtnIsFreeLine: OrderLine?.Extn?.ExtnIsFreeLine ?? null,
        // No esta el dato en 201
        ExtnCustomerDeliveryDate: OrderLine?.Extn?.ExtnCustomerDeliveryDate ?? null,
        // No esta el dato en 201 esta en 300 pero en shipment line
        ActualQuantity: OrderLine?.ActualQuantity ?? null,
        // No esta el dato en 201 esta en 300 en shipment line
        NetWeight: OrderLine?.NetWeight ?? null,
        // No esta el dato en 201 esta en 300 en shipment line
        NetWeightUom: OrderLine?.NetWeightUom ?? null,
        OrderedQty: OrderLine?.OrderedQty ?? null,
        StatusQuantity: OrderLine?.StatusQuantity ?? null,
        OriginalOrderedQty: OrderLine?.OriginalOrderedQty ?? null,
        // no viene en 201 esta en shipment line
        OrderReleaseKey: OrderLine?.OrderReleaseKey ?? null,
        // no viene en 201 esta en shipment line
        OverShipQuantity: OrderLine?.OverShipQuantity ?? null,
        // no viene en 201 viene en shipment line
        QuantityReduced: OrderLine?.QuantityReduced ?? null,
        ReleaseNo: OrderLine?.ReleaseNo ?? null, // no viene en 201 viene en shipment line
        Segment: OrderLine?.Segment ?? null, // no viene en 201 viene en shipment line
        SegmentType: OrderLine?.SegmentType ?? null, // no viene en 201 viene en shipment line
        // no viene en 201 // viene en shipment line
        ShipmentLineKey: OrderLine?.ShipmentLineKey ?? null,
        // no viene en 201 //a lo mejor valor en envios viene en shipment line
        ShipmentLineNo: OrderLine?.ShipmentLineNo ?? null,
        // no viene en 201 //a lo mejor valor en envios viene en shipment line
        StoreShipmentType: OrderLine?.StoreShipmentType ?? null,
        isHistory: OrderLine?.isHistory ?? null, // no viene en 201 viene en shipment line
        IntentoRecogido: OrderLine?.IntentoRecogido ?? null,
    };

    return deleteKeysWithEmptyValues(jsonLinea);
};

module.exports = { lineaJSON };
