const { deleteKeysWithEmptyValues } = require("./Orden_venta");

const clienteContactoJSON = (
    data,
) => {
    const clienteInfo = data?.PersonInfoShipTo;
    const jsonClienteContacto = {
        telefono: clienteInfo?.telefono ?? null,
        tipo: clienteInfo?.tipo ?? null,
        extension_telefonica: clienteInfo?.extension_telefonica ?? null,
        AlternateEmailID: clienteInfo?.AlternateEmailID ?? null,
        DayFaxNo: clienteInfo?.DayFaxNo ?? null,
        DayPhone: clienteInfo?.DayPhone ?? null,
        EMailID: clienteInfo?.EmailId ?? (clienteInfo?.EMailID ?? null),
        MobilePhone: clienteInfo?.MobilePhone ?? null,
        OtherPhone: clienteInfo?.OtherPhone ?? null,
    };

    return deleteKeysWithEmptyValues(jsonClienteContacto);
};

const clienteContactoJSONAddressAditional = (
    data,
) => {
    const clienteInfo = data?.PersonInfo;
    const jsonClienteContacto = {
        telefono: clienteInfo?.telefono ?? null,
        tipo: clienteInfo?.tipo ?? null,
        extension_telefonica: clienteInfo?.extension_telefonica ?? null,
        AlternateEmailID: clienteInfo?.AlternateEmailID ?? null,
        DayFaxNo: clienteInfo?.DayFaxNo ?? null,
        EMailID: clienteInfo?.EmailId ?? (clienteInfo?.EMailID ?? null),
        MobilePhone: clienteInfo?.MobilePhone ?? null,
        OtherPhone: clienteInfo?.OtherPhone ?? null,
    };

    return deleteKeysWithEmptyValues(jsonClienteContacto);
};

const clienteContactoJSONOrderLine = (
    data,
) => {
    const clienteInfo = Array.isArray(data?.OrderLines?.OrderLine) ?
        data?.OrderLines?.OrderLine[0]?.PersonInfoShipTo :
        data?.OrderLines?.OrderLine?.PersonInfoShipTo;
    const jsonClienteContacto = {
        telefono: clienteInfo?.telefono ?? null,
        tipo: clienteInfo?.tipo ?? null,
        extension_telefonica: clienteInfo?.extension_telefonica ?? null,
        AlternateEmailID: clienteInfo?.AlternateEmailID ?? null,
        DayFaxNo: clienteInfo?.DayFaxNo ?? null,
        DayPhone: (clienteInfo?.DayPhone == null || clienteInfo?.DayPhone === "") ? (clienteInfo?.MobilePhone ?? null)
            : clienteInfo?.DayPhone,
        EMailID: clienteInfo?.EmailId ?? (clienteInfo?.EMailID ?? null),
        MobilePhone: clienteInfo?.MobilePhone ?? null,
        OtherPhone: clienteInfo?.OtherPhone ?? null,
    };

    return deleteKeysWithEmptyValues(jsonClienteContacto);
};

module.exports = {
    clienteContactoJSON,
    clienteContactoJSONAddressAditional,
    clienteContactoJSONOrderLine,
};
