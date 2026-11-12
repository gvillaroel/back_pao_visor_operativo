const { deleteKeysWithEmptyValues } = require("./Orden_venta");

const clienteDireccionJSON = (
    data,
) => {
    const clienteInfo = data?.OrderLines?.OrderLine[0]?.PersonInfoShipTo;
    const jsonClienteDireccion = {
        AddressLine1: clienteInfo?.AddressLine1 ?? null,
        AddressLine2: clienteInfo?.AddressLine2 ?? null,
        AddressLine3: clienteInfo?.AddressLine3 ?? null,
        AddressLine4: clienteInfo?.AddressLine4 ?? null,
        AddressLine5: clienteInfo?.AddressLine5 ?? null,
        AddressLine6: clienteInfo?.AddressLine6 ?? null,
        AddressHash: clienteInfo?.AddressHash ?? null, // no viene en 201
        City: clienteInfo?.City ?? null,
        Country: clienteInfo?.Country ?? null,
        State: clienteInfo?.State ?? null,
        ZipCode: clienteInfo?.ZipCode ?? null,
        Beeper: clienteInfo?.Beeper ?? null, // no viene en 201
        Company: clienteInfo?.Company ?? null, // no viene en 201
        Department: clienteInfo?.Department ?? null, // no viene en 201
        ErrorTxt: clienteInfo?.ErrorTxt ?? null, // no viene en 201
        EveningFaxNo: clienteInfo?.EveningFaxNo ?? null, // no viene en 201
        EveningPhone: clienteInfo?.EveningPhone ?? null, // no viene en 201
        HttpUrl: clienteInfo?.HttpUrl ?? null, // no viene en 201
        PreferredShipAddress: clienteInfo?.PreferredShipAddress ?? null, // no viene en 201
        Suffix: clienteInfo?.Suffix ?? null, // no viene en 201
        UseCount: clienteInfo?.UseCount ?? null, // no viene en 201
        VerificationStatus: clienteInfo?.VerificationStatus ?? null, // no viene en 201
    };

    return deleteKeysWithEmptyValues(jsonClienteDireccion);
};

module.exports = { clienteDireccionJSON };
