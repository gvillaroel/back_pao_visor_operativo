const { deleteKeysWithEmptyValues } = require("./Orden_venta");

const clienteJSON = (
    data,
) => {
    const clienteInfo = data.ToAddress;
    const jsonCliente = {
        FirstName: clienteInfo?.FirstName ?? null,
        LastName: clienteInfo?.LastName ?? null,
        MiddleName: clienteInfo?.MiddleName ?? null,
        fch_nacimiento: clienteInfo?.fch_nacimiento ?? null, // no viene en 201
        CURP: clienteInfo?.CURP ?? null, // no viene en 201
        RFC: clienteInfo?.RFC ?? null, // no viene en 201
        genero: clienteInfo?.genero ?? null, // no viene en 201
        JobTitle: clienteInfo?.JobTitle ?? null, // no viene en 201
        PersonID: clienteInfo?.PersonID ?? null, // no viene en 201
        PersonInfoKey: clienteInfo?.PersonInfoKey.toString() ?? null, // no viene en 201
        Title: clienteInfo?.Title ?? null, // no viene en 201
    };

    return deleteKeysWithEmptyValues(jsonCliente);
};

module.exports = { clienteJSON };
