const clienteDireccionNAditionalAddressJSON = (
    data,iDCliente
) => {
    const clienteInfo = data?.OrderLines?.OrderLine[0]?.AdditionalAddresses?.AdditionalAddress?.PersonInfo;
    const jsonClienteDireccion = {
        IDCliente : iDCliente,
        AddressLine1: clienteInfo?.AddressLine1 ?? null,
        AddressLine2: clienteInfo?.AddressLine2 ?? null,
        AddressLine3: clienteInfo?.AddressLine3 ?? null,
        AddressLine4: clienteInfo?.AddressLine4 ?? null,
        AddressLine5: clienteInfo?.AddressLine5 ?? null,
        AddressLine6: clienteInfo?.AddressLine6 ?? null,
        AddressHash: clienteInfo?.AddressHash ?? null,
        City: clienteInfo?.City ?? null,
        Country: clienteInfo?.Country ?? null,
        State: clienteInfo?.State ?? null,
        ZipCode: clienteInfo?.ZipCode ?? null,
        Beeper: clienteInfo?.Beeper ?? null,
        Company: clienteInfo?.Company ?? null,
        Department: clienteInfo?.Department ?? null,        
        EveningFaxNo: clienteInfo?.EveningFaxNo ?? null,
        EveningPhone: clienteInfo?.EveningPhone ?? null,                
        Suffix: clienteInfo?.Suffix ?? null,
        UseCount: clienteInfo?.UseCount ?? null,        
    };

    return jsonClienteDireccion
};

module.exports = {  clienteDireccionNAditionalAddressJSON };
