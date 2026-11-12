const { deleteKeysWithEmptyValues } = require("./Orden_venta");

const clienteContactoJSON = (
    data,
) => {
    const clienteInfo = data?.OrderLines?.OrderLine[0]?.PersonInfoShipTo;
    const jsonClienteContacto = {
        telefono: clienteInfo?.telefono ?? null,
        tipo: clienteInfo?.tipo ?? null,
        extension_telefonica: clienteInfo?.extension_telefonica ?? null,
        AlternateEmailID: clienteInfo?.AlternateEmailID ?? null,
        DayFaxNo: clienteInfo?.DayFaxNo ?? null,
        DayPhone: clienteInfo?.DayPhone ?? null,
        EMailID: clienteInfo?.EMailID ?? null,
        MobilePhone: clienteInfo?.MobilePhone ?? null,
        OtherPhone: clienteInfo?.OtherPhone ?? null,
    };

    return deleteKeysWithEmptyValues(jsonClienteContacto);
};

module.exports = { clienteContactoJSON };
