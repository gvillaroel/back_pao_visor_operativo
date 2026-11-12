const clienteContactoNJSONAddressAditional = (
    data,iDCliente
) => {
    if (data?.OrderLines?.OrderLine[0]?.AdditionalAddresses) {
        const clienteInfo = data?.OrderLines?.OrderLine[0]?.AdditionalAddresses?.AdditionalAddress?.PersonInfo;
        const jsonClienteContactoN = {
            IDCliente : iDCliente,
            telefono: clienteInfo?.telefono ?? null,
            tipo: clienteInfo?.tipo ?? null,
            extension_telefonica: clienteInfo?.extension_telefonica ?? null,
            AlternateEmailID: clienteInfo?.AlternateEmailID ?? null,
            DayFaxNo: clienteInfo?.DayFaxNo ?? null,
            DayPhone: (clienteInfo?.DayPhone == null || clienteInfo?.DayPhone === "") ? (clienteInfo?.DayPhone ?? null)
            : clienteInfo?.DayPhone,
            EMailID: clienteInfo?.EmailId ?? (clienteInfo?.EMailID ?? null),
            MobilePhone: clienteInfo?.MobilePhone ?? null,
            OtherPhone: clienteInfo?.OtherPhone ?? null,
        };

        return jsonClienteContactoN
    }else{
        null;
    }    
};

module.exports = {
    clienteContactoNJSONAddressAditional,    
};
