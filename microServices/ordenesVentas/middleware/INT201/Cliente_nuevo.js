
const clienteNuevoJSON = (data201,order) => {
    let dataName;
    if (   data201?.OrderLines?.OrderLine[0]?.AdditionalAddresses?.AdditionalAddress
          ?.PersonInfo ) {
            dataName = data201?.OrderLines?.OrderLine[0]?.AdditionalAddresses?.AdditionalAddress
                ?.PersonInfo;        
      }else{
        return null;
      }
      const jsonClienteNuevo = {
        IDCliente : order ? order.IDCliente: null,
        FirstName: dataName ? dataName?.FirstName :  null,
        LastName: dataName ? dataName?.LastName :  null,
        MiddleName: dataName ? dataName?.MiddleName : null,
      };
    return   jsonClienteNuevo;

}    

module.exports = { clienteNuevoJSON };
