const { deleteKeysWithEmptyValues } = require("./Orden_venta");

const productoJSON = (OrderLine, data201) => {
    const jsonProducto = {
        ItemID: OrderLine?.Item?.ItemID ?? null,
        ProductClass: OrderLine?.Item?.ProductClass ?? null,
        SupplierItem: OrderLine?.Item?.SupplierItem ?? null,
        UnitPrice: OrderLine?.LinePriceInfo?.UnitPrice ?? null,
        // --> Esa llave no viene en OrderLines esta en shipment line
        Quantity: OrderLine?.Quantity ?? null,
        skuAmount: OrderLine?.skuAmount ?? null, // --> Esa llave no viene en orderLines ni en 300
        Seller: OrderLine?.Seller ?? null, // --> Esa llave no viene en OrderLines ni en 300
        ItemDesc: OrderLine?.Item?.ItemDesc ?? null,
        // --> Esa llave no viene en OrderLines
        ExtnIsReturnPickup: OrderLine?.Extn?.ExtnIsReturnPickup ?? null,
        // --> Esa llave no viene en OrderLines
        ExtnSpecialItem: OrderLine?.Extn?.ExtnSpecialItem ?? null,
        UnitOfMeasure: OrderLine?.Item?.UnitOfMeasure ?? null,
        ImageURL: OrderLine?.Item?.ImageURL ?? null,
        ItemType: OrderLine?.ItemType ?? null, // Esa llave no viene en OrderLines
    };

    return deleteKeysWithEmptyValues(jsonProducto);
};

module.exports = { productoJSON };
