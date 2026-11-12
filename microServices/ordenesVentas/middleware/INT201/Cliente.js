const { deleteKeysWithEmptyValues } = require("./Orden_venta");

const clienteJSON = (data) => {
  let dataName;
  if (
    data?.OrderLines?.OrderLine[0]?.AdditionalAddresses?.AdditionalAddress
      ?.PersonInfo
  ) {
    dataName = data?.OrderLines?.OrderLine[0]?.AdditionalAddresses?.AdditionalAddress
        ?.PersonInfo;
  }
  const clienteInfo = data?.OrderLines?.OrderLine[0]?.PersonInfoShipTo;
  const jsonCliente = {
    FirstName: dataName ? dataName?.FirstName : clienteInfo?.FirstName ?? null,
    LastName: dataName ? dataName?.LastName : clienteInfo?.LastName ?? null,
    MiddleName: clienteInfo?.MiddleName ?? null,
    fch_nacimiento: clienteInfo?.fch_nacimiento ?? null, // no viene en 201
    CURP: clienteInfo?.CURP ?? null, // no viene en 201
    RFC: clienteInfo?.RFC ?? null, // no viene en 201
    genero: clienteInfo?.genero ?? null, // no viene en 201
    JobTitle: clienteInfo?.JobTitle ?? null, // no viene en 201
    PersonID: clienteInfo?.PersonID ?? null, // no viene en 201
    PersonInfoKey: clienteInfo?.PersonInfoKey ?? null, // no viene en 201
    Title: clienteInfo?.Title ?? null, // no viene en 201
  };

  return deleteKeysWithEmptyValues(jsonCliente);
};

module.exports = { clienteJSON };
