const { deleteKeysWithEmptyValues } = require("./Orden_venta");

const envioJSON = (shipment, OrderLine, data201) => {
    const jsonEnvio = {
        // No viene en 201
        RequestedCarrierServiceCode: shipment?.RequestedCarrierServiceCode ?? null,
        RequestedDeliveryDate: shipment?.RequestedDeliveryDate ?? null, // No viene en 201
        RequestedShipmentDate: shipment?.RequestedShipmentDate ?? null, // No viene en 201
        SCAC: OrderLine?.SCAC ?? null, // No viene en 201
        ShipDate: shipment?.ShipDate ?? null, // No viene en 201
        // no viene en 201
        ShipNode: (OrderLine?.ShipNode && shipment.ShipNode.length > 0)
            ? shipment.ShipNode[0] : null,
        Description: shipment?.Description ?? null, // No viene en 201
        StatusDescription: shipment?.StatusDescription ?? null,
        NodeType: shipment?.NodeType ?? null, // No viene en 201
        Status: (shipment?.Status && shipment.Status.length > 0)
            ? shipment?.Status[0] ?? null : shipment?.Status ?? null,
        StatusDate: shipment?.StatusDate ?? null, // No viene en 201
        TotalWeight: shipment?.TotalWeight ?? null, // No viene en 201
        TotalWeightUOM: shipment?.TotalWeightUOM ?? null, // No viene en 201
        UseGestor: shipment?.UseGestor ?? null, // No viene en 201
        TrackingNo: data201?.Containers?.Container?.TrackingNo,
        ContainerNo: data201?.Containers?.Container?.ContainerNo,
        IntentoEntrega: shipment?.IntentoEntrega ?? null,
        // Diferentes ubicaciones 201 y 300
        CarrierServiceCode: shipment?.CarrierServiceCode ?? null,
    };

    return deleteKeysWithEmptyValues(jsonEnvio);
};

module.exports = { envioJSON };
