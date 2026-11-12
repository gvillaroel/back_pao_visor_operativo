const { deleteKeysWithEmptyValues } = require("./Orden_venta");

const chainedTOJSON = (ChainedTO, data201, previo) => {
    const jsonChainedTO = {
        OrderNo: ChainedTO?.OrderNo ?? null,
        Status: ChainedTO?.Shipments?.Shipment.Status ?? null,
        Quantity: ChainedTO?.Shipments?.Shipment.Quantity ?? null,
        ShipNode: ChainedTO?.Shipments?.Shipment.ShipNode ?? null,
        ShipmentNo: ChainedTO?.Shipments?.Shipment.ShipmentNo ?? null,
    };

    return deleteKeysWithEmptyValues(jsonChainedTO);
};

module.exports = { chainedTOJSON };
