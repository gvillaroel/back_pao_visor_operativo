const { deleteKeysWithEmptyValues } = require("./Orden_venta");

const envioJSON = (shipment, OrderLine, data201, previo) => {
    const jsonEnvio = {
        ShipmentKey: shipment?.ShipmentKey ?? null, // No viene en 201
        // No viene en 201
        RequestedCarrierServiceCode: shipment?.RequestedCarrierServiceCode ?? null,
        RequestedDeliveryDate: shipment?.RequestedDeliveryDate ?? null, // No viene en 201
        RequestedShipmentDate: shipment?.RequestedShipmentDate ?? null, // No viene en 201
        SCAC: OrderLine?.SCAC ?? null, // No viene en 201
        ShipDate: shipment?.ShipDate ?? null, // No viene en 201
        ShipNode: shipment?.ShipNode ?? (OrderLine?.ShipNode ?? null), // no viene en 201
        Description: shipment?.Description ?? null, // No viene en 201
        StatusDescriptionPrevio: previo?.StatusDescription ?? null,
        StatusDescription: shipment?.StatusDescription ?? null,
        NodeType: shipment?.NodeType ?? null, // No viene en 201
        StatusPrevio: previo?.Status ?? null,
        Status: shipment?.Status ?? null,
        StatusDate: shipment?.StatusDate ?? null, // No viene en 201
        TotalWeight: shipment?.TotalWeight ?? null, // No viene en 201
        TotalWeightUOM: shipment?.TotalWeightUOM ?? null, // No viene en 201
        UseGestor: shipment?.UseGestor ?? null, // No viene en 201
        TrackingNo: data201?.Containers?.Container?.TrackingNo,
        ContainerNo: data201?.Containers?.Container?.ContainerNo,
        IntentoEntrega: shipment?.IntentoEntrega ?? 0,
        ShipmentQuantity: shipment?.ShipmentLines?.ShipmentLine?.Quantity ?? null,
        ExpectedDeliveryDate: shipment?.ExpectedDeliveryDate,
        ExpectedShipmentDate: shipment?.ExpectedShipmentDate,
        MaxShipmentStatusDesc: OrderLine?.MaxShipmentStatusDesc,
        MinShipmentStatusDesc: OrderLine?.MinShipmentStatusDesc,
    };
    if (shipment?.StatusDescription == null || shipment?.StatusDescription === undefined) {
        if (OrderLine?.MaxShipmentStatusDesc !== "" || OrderLine?.MaxShipmentStatusDesc === null) {
            jsonEnvio['StatusDescription'] = OrderLine?.MaxShipmentStatusDesc;
        } else if (OrderLine?.MinShipmentStatusDesc !== "" || OrderLine?.MinShipmentStatusDesc === null) {
            jsonEnvio["StatusDescription"] = OrderLine?.MinShipmentStatusDesc;
        }
    }

    return deleteKeysWithEmptyValues(jsonEnvio);
};

module.exports = { envioJSON };
