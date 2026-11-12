const { deleteKeysWithEmptyValues } = require("./Orden_venta");

const productoJSON = (OrderLine, ShipmentLine, data201) => {
    const jsonProducto = {
        ItemID: OrderLine?.Item?.ItemID ?? null,
        ProductClass: ShipmentLine?.ProductClass ?? null,
        SupplierItem: OrderLine?.Item?.SupplierItem ?? null,
        UnitPrice: OrderLine?.LinePriceInfo?.UnitPrice ?? null,
        // --> Esa llave no viene en OrderLines esta en shipment line
        Quantity: ShipmentLine?.Quantity ?? null,
        skuAmount: OrderLine?.skuAmount ?? null, // --> Esa llave no viene en orderLines ni en 300
        Seller: OrderLine?.Seller ?? null, // --> Esa llave no viene en OrderLines ni en 300
        ItemDesc: OrderLine?.Item?.ItemDesc ?? null,
        // --> Esa llave no viene en OrderLines
        ExtnIsReturnPickup: OrderLine?.Extn?.ExtnIsReturnPickup ?? null,
        // --> Esa llave no viene en OrderLines
        ExtnSpecialItem: OrderLine?.Extn?.ExtnSpecialItem ?? null,
        UnitOfMeasure: OrderLine?.Item?.UnitOfMeasure ?? null,
        ImageURL: OrderLine?.ItemDetails?.PrimaryInformation?.ImageURL ?? null,
        // Esa llave no viene en OrderLines
        ItemType: OrderLine?.ItemDetails?.PrimaryInformation?.ItemType ?? null,
    };

    return deleteKeysWithEmptyValues(jsonProducto);
};

module.exports = { productoJSON };
