const { deleteKeysWithEmptyValues } = require("./Orden_venta");

const lineaJSON = (OrderLine, ShipmentLine, data300) => {
    const jsonLinea = {
        ItemID: (OrderLine?.Item?.ItemID ?? (ShipmentLine.ItemID ?? null)),
        DeliveryMethod: OrderLine?.DeliveryMethod ?? null,
        ChangeInOrderedQty: OrderLine?.ChangeInOrderedQty ?? null,
        BackOrderedQuantity: OrderLine?.BackOrderedQuantity ?? null,
        PrimeLineNo: ShipmentLine?.PrimeLineNo ?? null,
        ReceivingNode: OrderLine?.ReceivingNode ?? null,
        StoreDesc: OrderLine?.StoreDesc ?? null,
        StatusLine: OrderLine?.status ?? null,
        OrderLineStatus: OrderLine?.OrderLineStatus ?? null,
        IsCancellable: OrderLine?.IsCancellable ?? null,
        LineType: OrderLine?.LineType ?? null,
        MaxLineStatus: OrderLine?.MaxLineStatus ?? null,
        MaxLineStatusDesc: OrderLine?.MaxLineStatusDesc ?? null,
        MinLineStatus: OrderLine?.MinLineStatus ?? null,
        MinLineStatusDesc: OrderLine?.MinLineStatusDesc ?? null,
        ReqDeliveryDate: OrderLine?.ReqDeliveryDate ?? null,
        SubLineNo: ShipmentLine?.SubLineNo ?? null,
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
        NetWeight: ShipmentLine?.NetWeight ?? null,
        // No esta el dato en 201 esta en 300 en shipment line
        NetWeightUom: ShipmentLine?.NetWeightUom ?? null,
        OrderedQty: OrderLine?.OrderedQty ?? null,
        StatusQuantity: OrderLine?.StatusQuantity ?? null,
        OriginalOrderedQty: OrderLine?.OriginalOrderedQty ?? null,
        // no viene en 201 esta en shipment line
        OrderReleaseKey: ShipmentLine?.OrderReleaseKey ?? null,
        // no viene en 201 esta en shipment line
        OverShipQuantity: ShipmentLine?.OverShipQuantity ?? null,
        // no viene en 201 viene en shipment line
        QuantityReduced: ShipmentLine?.QuantityReduced ?? null,
        ReleaseNo: ShipmentLine?.ReleaseNo ?? null, // no viene en 201 viene en shipment line
        Segment: ShipmentLine?.Segment ?? null, // no viene en 201 viene en shipment line
        SegmentType: ShipmentLine?.SegmentType ?? null, // no viene en 201 viene en shipment line
        // no viene en 201 //a lo mejor valor en envios viene en shipment line
        ShipmentLineNo: ShipmentLine?.ShipmentLineNo ?? null,
        // no viene en 201 //a lo mejor valor en envios viene en shipment line
        StoreShipmentType: ShipmentLine?.StoreShipmentType ?? null,
        isHistory: ShipmentLine?.isHistory ?? null, // no viene en 201 viene en shipment line
        IntentoRecogido: OrderLine?.IntentoRecogido ?? null,
    };

    return deleteKeysWithEmptyValues(jsonLinea);
};

module.exports = { lineaJSON };
