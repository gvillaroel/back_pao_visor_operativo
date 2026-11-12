/* eslint-disable no-param-reassign */
const log4js = require("log4js");
const Sequelize = require("sequelize");
const { Op } = require("sequelize");
const { QueryTypes } = require("sequelize");
const { sequelize } = require("../../config/db");
const Schema = require("../../models/init-models");
const { esCadenaFechaValida, obtenerListaStatusShipment } = require("../../utils/utils");
const config = require("../../log4js.json");
const {
  FetchOneClienteNuevoEmailIfExist,
} = require("./ClienteNuevoRepository");

const {
 OrdenVenta
} = Schema.default(sequelize);
const { OrdenVentaVW } = Schema.default(sequelize);

log4js.configure(config);
const logger = log4js.getLogger("Orden Venta Repository");

exports.ObtenerTimeZone = async () => {
  const resultado = await sequelize.query(
    "SELECT current_setting('TIMEZONE') AS zona_horaria;",
    {
      type: QueryTypes.SELECT,
    },
  );
  return resultado;
};

/**
  * Recupera el nombre de las columnas de la tabla.
  *
  * @return JSON contiene las caracteristicas de la tabla
  */
exports.getCamposOrdenVenta = async () => {
  const campos = OrdenVenta.getAttributes();
  const camposSinPK = Object.keys(campos).filter((key) => campos[key].primaryKey === undefined);
  return camposSinPK;
};

/**
  * Crea una Orden de venta en BD.
  *
  * @param orden {JSON} informacion de una nueva orden
  * @return newOrden regresa el registro de la orden en BD
  */
exports.CreateOrden = async (orden, t) => {
  try {
    if (orden.StatusTimeStamp !== undefined) {
      logger.info("en metodo UpdateLinea: ", orden.StatusTimeStamp, await esCadenaFechaValida(orden.StatusTimeStamp));
      const calendario = orden.StatusTimeStamp.replaceAll("\n", "").replaceAll("\t", "");
      orden.StatusTimeStamp = await esCadenaFechaValida(calendario)
        ? calendario : null;
    }
    const newOrden = await OrdenVenta.create(
      orden,
      { transaction: t },
    );
    return newOrden;
  } catch (error) {
    throw error;
  }
};

/**
  * Verifica que exista una orden en BD buscando por numero de orden.
  *
  * @param OrdenNo {string} Numero de la orden para poder hacer la busqueda
  * @return orden regresa la orden de la BD
  */
exports.FetchOneOrdenNumbyIdCliente = async (IDCliente) => {
  const orden = await OrdenVenta.findOne({
    where: {
      IDCliente,
      OrderNo: {
        [Op.notLike]: "Y%",
      },
    },
    raw: true,
  });
  return orden;
};

/**
  * Verifica que exista una orden en BD buscando por numero de orden.
  *
  * @param OrdenNo {string} Numero de la orden para poder hacer la busqueda
  * @return orden regresa la orden de la BD
  */
exports.FetchOneOrdenNum = async (ordenNum) => {
  const orden = await OrdenVenta.findOne({
    where: { OrderNo: ordenNum },
    raw: true,
  });
  return orden;
};

/**
  * Verifica que exista una orden en BD buscando por OrderHeaderKey.
  *
  * @param OrdenNo {string} Numero de la orden para poder hacer la busqueda
  * @return orden regresa la orden de la BD
  */
exports.FetchOneOrden = async (OrderHeaderKey) => {
  const orden = await OrdenVenta.findOne({
    where: { OrderHeaderKey },
    attributes: {},
    raw: true,
  });
  return orden;
};

/**
  * Verifica que exista una orden en BD buscando por OrderHeaderKey.
  *
  * @param OrdenNo {string} Numero de la orden para poder hacer la busqueda
  * @return orden regresa la orden de la BD
  */
exports.FetchOneOrderNoOriginal = async (OrderNoOriginal) => {
  const orden = await OrdenVenta.findAll({
    where: { OrderNoOriginal },
    attributes: {},
    raw: true,
  });
  return orden;
};

/**
  * Verifica que exista una orden en BD buscando por numero de orden.
  *
  * @param OrderNo {string} Numero de la orden para poder hacer la busqueda
  * @return orden regresa la orden de la BD
  */
exports.FetchOneOrdenByOrdenNo = async (OrderNo) => {
  const orden = await OrdenVenta.findOne({
    where: { OrderNo },
    attributes: {},
    raw: true,
  });
  return orden;
};

exports.FetchCustomerInfoByOrderNo = async (OrderNo) => {
  const result = await OrdenVenta.findOne({
    attributes: ["IDCliente"],
    where: { OrderNo },
    raw: true,
  });

  if (result) {
    const clienteNuevo = await FetchOneClienteNuevoEmailIfExist(result.IDCliente);
    return clienteNuevo;
  }
  return null;
};

/**
  * Verifica que exista una orden en BD buscando por numero de orden
  * y empresa indicando si es liverpool o suburbia
  *
  * @param OrderNo {string} Numero de la orden para poder hacer la busqueda
  * @param Empresa {string} Valor de indica si es Liverpool o Suburbia
  * @return orden regresa la orden de la BD
  */
exports.FetchOneOrdenByOrdenNoEmp = async (OrderNo, Empresa) => {
  const orden = await OrdenVenta.findOne({
    where: {
      OrderNo,
      [Op.iLike]: Sequelize.literal(`LOWER("EnterpriseCode") LIKE LOWER('%${Empresa}%')`),
    },
    attributes: {},
    raw: true,
  });
  return orden;
};

/**
  * Regresa todas las ordenes en BD
  *
  * @return ordenes regresa un arreglo con todas las ordenes en BD
  */
exports.FetchAllOrdenes = async () => {
  const ordenes = await OrdenVenta.findAll({
    raw: true,
  });
  return ordenes;
};

/**
  * Regresa todas las ordenes en BD
  *
  * @return ordenes regresa un arreglo con todas las ordenes en BD
  */
exports.FetchAllOrdenesValidarSKUCantidad = async () => {
  const ordenes = await OrdenVenta.findAll({
    where: {
      [Op.and]: [
        sequelize.literal("TO_CHAR(\"OrderDate\", 'YYYY-MM-DD') < '2024-03-20'"),
        {
          [Op.or]: [
            {
              statusSKUCantidad: {
                [Op.notLike]: "%igual%",
              },
            },
            sequelize.where(sequelize.col("statusSKUCantidad"), null),
          ],
        },
        /* {
          "OrderNo": '9772811999'
        } */
      ],
    },
    limit: 200,
    raw: true,
  });
  return ordenes;
};

/**
  * Actualiza una Orden en BD.
  *
  * @param orden {JSON} informacion actualizada de la orden
  * @return updatedOrden regresa el numero de registros afectados
  */
exports.UpdateOrdenNoTransact = async (fieldsToUpdate, OrderHeaderKey) => {
  try {
    if (fieldsToUpdate.StatusTimeStamp !== undefined) {
      logger.info("en metodo UpdateLinea: ", fieldsToUpdate.StatusTimeStamp, await esCadenaFechaValida(fieldsToUpdate.StatusTimeStamp));
      const calendario = fieldsToUpdate.StatusTimeStamp.replaceAll("\n", "").replaceAll("\t", "");
      fieldsToUpdate.StatusTimeStamp = await esCadenaFechaValida(calendario)
        ? calendario : null;
    }
    fieldsToUpdate.update_time = new Date();
    const updatedOrden = await OrdenVenta.update(
      fieldsToUpdate,
      {
        where: {
          OrderHeaderKey,
        },
      },
    );
    return updatedOrden;
  } catch (error) {
    throw error;
  }
};

/**
  * Actualiza una Orden en BD.
  *
  * @param orden {JSON} informacion actualizada de la orden
  * @return updatedOrden regresa el numero de registros afectados
  */
exports.UpdateOrden = async (fieldsToUpdate, OrderHeaderKey, t) => {
    if (fieldsToUpdate.StatusTimeStamp !== undefined) {
      logger.info("en metodo UpdateLinea: ", fieldsToUpdate.StatusTimeStamp, await esCadenaFechaValida(fieldsToUpdate.StatusTimeStamp));
      const calendario = fieldsToUpdate.StatusTimeStamp.replaceAll("\n", "").replaceAll("\t", "");
      fieldsToUpdate.StatusTimeStamp = await esCadenaFechaValida(calendario)
        ? calendario : null;
    }
    if (fieldsToUpdate?.ExtnComments) {
      fieldsToUpdate.ExtnComments = fieldsToUpdate?.ExtnComments.substring(0, 100)
    }

    fieldsToUpdate.update_time = new Date();
    const updatedOrden = await OrdenVenta.update(
      fieldsToUpdate,
      {
        where: {
          OrderHeaderKey,
        },
      },
      { transaction: t },
    );
    return updatedOrden;
};


exports.UpdateOrdenIDClienteNuevo = async (fieldsToUpdate, OrderHeaderKey, t) => { 
  try {     
    const updatedOrden = await OrdenVenta.update(
      {IDClienteNuevo : fieldsToUpdate.IDClienteNuevo},
      {
        where: {
          OrderHeaderKey,          
        },
      },
      { transaction: t },
    );
    return updatedOrden;
  } catch (error) {
    console.log(" Error" +error)
    throw error;
  }
};
/**
  * Elimina una Orden en BD.
  *
  * @param OrderHeaderKey {string} es el numero de la orden que se quiere eliminar
  * @return deletedOrder regresa el numero de registros afectados
  */
exports.Delete = async (OrderHeaderKey) => {
  const deletedOrder = await OrdenVenta.destroy({
    where: {
      OrderHeaderKey,
    },
  });
  return deletedOrder;
};

function ConcatPl(OrderNo, itemid, primeline) {
  return `${OrderNo}${itemid}${primeline}`;
}

/**
  * Limpieza de ordenes con letra solo aplica proceso apigee
  * @param dato {string} cadena que contiene el numero de orden
  */
function OrderLinesLimpiaLetras(dato) {
  const patron = /[a-zA-Z-]/g;
  const datoLimpio = dato.replace(patron, "");
  return datoLimpio;
}

/**
  * Ajusta el número de telefono a retornar
  * @param AddAddresses {object} datos de direcciones adicionales a nivel de linea
  * @param OriginAdd {object} datos de direccion a nivel de orden
  * @param Adicional {bool} true indica numero adicional
*/
function EvaluaDayPhone(AddAddresses, OriginlAdd, Adicional){
  try{
    let TelefonoAdicional = AddAddresses?.MobilePhone
    let TelefonoOriginal = OriginlAdd?.MobilePhone
 
    //caso para número adicional
    if(Adicional){
      if(TelefonoAdicional === '' || TelefonoAdicional === null || TelefonoAdicional === 'Undefined'){
        TelefonoAdicional = AddAddresses?.DayPhone
        return TelefonoAdicional
      }
      return TelefonoAdicional
    }
    else
    //caso para número original
    {
      if(TelefonoOriginal === '' || TelefonoOriginal === null || TelefonoOriginal === 'Undefined'){
        TelefonoOriginal = OriginlAdd?.DayPhone
        return TelefonoOriginal
      }
      return TelefonoOriginal
    }
  }catch(error){
    logger.error('Error en logica télefono apigee 2010', error)
     // en caso de error se retornan datos de contacto original
     return OriginlAdd?.MobilePhone ? OriginlAdd?.MobilePhone: OriginlAdd?.DayPhone
  }
}

exports.OrderBuilder = async (orderInt) => {
  const statusShipments = await obtenerListaStatusShipment();

  const orderOut = {
    Order: {
      Extn: {
        ExtnRegion: orderInt?.ExtnRegion ?? null,
        ExtnPaymentType: orderInt?.ExtnPaymentType ?? null,
        ExtnIsGiftPlusPurchase: orderInt?.ExtnIsGiftPlusPurchase ?? null,
        ExtnIsSelfAllocatedFromPOS: orderInt?.ExtnIsSelfAllocatedFromPOS ?? null,
        ExtnStoreNumber: orderInt?.ExtnStoreNumber ?? null,
        ExtnStoreSalesCredit: orderInt?.ExtnStoreSalesCredit ?? null,
        ExtnOrderType: orderInt?.ExtnOrderType ?? null,
        ExtnGREventId: orderInt?.ExtnGREventId ?? null,
        ExtnGREventName: orderInt?.ExtnGREventName ?? null,
        ExtnGROwnerName: orderInt?.ExtnGROwnerName ?? null,
        ExtnGRDeliveryDays: orderInt?.ExtnGRDeliveryDays ?? null,
        EDDHasChanged: orderInt?.EDDHasChanged ?? null,
        ExpectedDeliveryDate: orderInt?.ExpectedDeliveryDate ?? null,
        StatusOrder: orderInt?.StatusOrder ?? null,
        ExtnDesignCenterID: orderInt?.Extn?.ExtnDesignCenterID,
      },
      SCAC: "",
      Status: orderInt.StatusOrder,
      OrderNo: orderInt.OrderNo,
      EntryType: orderInt.EntryType,
      OrderDate: orderInt.OrderDate,
      OrderName: orderInt.OrderName,
      OrderType: orderInt.OrderType,
      Containers: {
        Container: {
          TrackingNo: "",
          ContainerNo: "",
          ContainerDetails: {
            ContainerDetail: [],
          },
        },
      },
      OrderLines: {
        OrderLine: orderInt.OrderLines.map((item) => {
          const {
            Extn,
            Item,
            ShipmentLines,
            AdditionalAddresses,
          } = item.OrderLine;
          const { ShipmentLine } = ShipmentLines;
          // Validacion de email ya que apigee no manda el email en adittional address cuando se edita
          const AdditionalAddressEmail = (AdditionalAddresses?.AdditionalAddress?.PersonInfo?.EMailID ?? '').trim();
          const ShipToEmail = orderInt?.PersonInfoShipTo?.EMailID || orderInt?.PersonInfoShipTo?.EmailId || '';
          return {

            Extn: {
              ExtnIsExpedited: Extn?.ExtnIsExpedited,
              ExtnLineType: Extn?.ExtnLineType,
              ExtnSpecialItem: Extn?.ExtnSpecialItem,
              ExtnNoSpotService: Extn?.ExtnNoSpotService,
              ExtnIsReturnPickup: Extn?.ExtnIsReturnPickup,
              ExtnCustomerDeliveryDate: Extn?.ExtnCustomerDeliveryDate,
              ExtnPauseForRDDADD: Extn?.ExtnPauseForRDDADD,
            },
            Item: {
              ItemID: Item.ItemID,
              ImageURL: "",
              ItemDesc: Item.ItemDesc,
              ProductClass: Item.ProductClass,
              UnitOfMeasure: Item.UnitOfMeasure,
            },
            SCAC: item.OrderLine.SCAC,
            Status: item.Status ?? (item.OrderLine.Status ?? null),
            LineType: Item.LineType,
            ShipNode: item.OrderLine.ShipNode,
            Shipments: {
              Shipment: {
                Status: ShipmentLine?.Shipment?.Status,
                StatusDescription: statusShipments[ShipmentLine?.Shipment?.Status],
                ShipNode: ShipmentLine?.Shipment?.ShipNode,
                ShipmentNo: ShipmentLine?.Shipment?.ShipmentNo,
                DocumentType: ShipmentLine?.DocumentType,
                StatusDate: ShipmentLine?.Shipment?.StatusDate,
                ShipmentLines: {
                  ShipmentLine: {
                    Quantity: ShipmentLine?.Quantity,
                    OrderLine: {
                      OrderedQty: "",
                    },
                  },
                },
              },
            },
            StoreDesc: "",
            SubLineNo: item.OrderLine.SubLineNo,
            OrderedQty: item.OrderLine.OrderedQty,
            References: {
              Reference: (item.OrderLine?.References?.Reference?.length > 0)
              ? item.OrderLine.References.Reference.map((ref) => ({
                  Name: ref.Name,
                  Value: String(ref.Value),
                }))
              : [],
            },
            PrimeLineNo: item.OrderLine.PrimeLineNo,
            OrderLineKey: ConcatPl(
              OrderLinesLimpiaLetras(orderInt.OrderNo),
              Item.ItemID,
              item.OrderLine.PrimeLineNo,
            ),
            IsCancellable: item.OrderLine.IsCancellable,
            MaxLineStatus: item.OrderLine.MaxLineStatus,
            MinLineStatus: item.OrderLine.MinLineStatus,
            DeliveryMethod: item.OrderLine.DeliveryMethod,
            DepartmentCode: item.OrderLine.DepartmentCode,
            OrderHeaderKey: item.OrderLine.OrderHeaderKey,
            StatusQuantity: "",
            FulfillmentType: item.OrderLine.FulfillmentType,
            PersonInfoShipTo: {
              City: orderInt?.PersonInfoShipTo.City,
              State: orderInt.PersonInfoShipTo.State,
              Title: "",
              Beeper: "",
              Suffix: "",
              Company: orderInt?.PersonInfoShipTo.Company,
              Country: orderInt?.PersonInfoShipTo.Country,
              EMailID: orderInt?.PersonInfoShipTo.EMailID ?? (orderInt?.PersonInfoShipTo.EmailId ?? null),
              HttpUrl: "",
              ZipCode: orderInt?.PersonInfoShipTo.ZipCode,
              DayFaxNo: "",
              DayPhone: EvaluaDayPhone(AdditionalAddresses?.AdditionalAddress?.PersonInfo, orderInt?.PersonInfoShipTo, false),
              MobilePhone: EvaluaDayPhone(AdditionalAddresses?.AdditionalAddress?.PersonInfo, orderInt?.PersonInfoShipTo, true),
              ErrorTxt: "",
              JobTitle: "",
              LastName: AdditionalAddresses.AdditionalAddress.PersonInfo.LastName ?? orderInt?.PersonInfoShipTo.LastName,
              PersonID: "",
              UseCount: "",
              FirstName: AdditionalAddresses?.AdditionalAddress?.PersonInfo?.FirstName ?? orderInt?.PersonInfoShipTo.FirstName,
              Department: "",
              MiddleName: AdditionalAddresses.AdditionalAddress.PersonInfo.MiddleName ?? orderInt?.PersonInfoShipTo.MiddleName,
              OtherPhone: "",
              AddressLine1: orderInt?.PersonInfoShipTo.AddressLine1,
              AddressLine2: orderInt?.PersonInfoShipTo.AddressLine2,
              AddressLine3: orderInt?.PersonInfoShipTo.AddressLine3,
              AddressLine4: orderInt?.PersonInfoShipTo.AddressLine4,
              AddressLine5: orderInt?.PersonInfoShipTo.AddressLine5,
              AddressLine6: orderInt?.PersonInfoShipTo.AddressLine6,
              EveningFaxNo: "",
              EveningPhone: "",
              PersonInfoKey: orderInt?.PersonInfoShipTo.PersonInfoKey,
              AlternateEmailID: "",
              VerificationStatus: "",
              PreferredShipAddress: "",
            },
            MaxLineStatusDesc: "",
            MaxShipmentStatus: "",
            MinLineStatusDesc: "",
            MinShipmentStatus: "",
            OriginalOrderedQty: item.OrderLine.OriginalOrderedQty,
            AdditionalAddresses: {
              AdditionalAddress: {
                EntityKey: AdditionalAddresses.AdditionalAddress.EntityKey,
                EntityType: AdditionalAddresses.AdditionalAddress.EntityType,
                PersonInfo: {
                  City: AdditionalAddresses.AdditionalAddress.PersonInfo.City ?? orderInt?.PersonInfoShipTo?.City,
                  State: AdditionalAddresses.AdditionalAddress.PersonInfo.State ?? orderInt?.PersonInfoShipTo?.State,
                  Title: '',
                  Beeper: '',
                  Suffix: '',
                  Company: AdditionalAddresses.AdditionalAddress.PersonInfo.Company ?? orderInt?.PersonInfoShipTo?.Company,
                  Country: AdditionalAddresses.AdditionalAddress.PersonInfo.Country ?? orderInt?.PersonInfoShipTo?.Country,
                  EMailID: AdditionalAddressEmail !== '' ? AdditionalAddressEmail : ShipToEmail,
                  ZipCode: AdditionalAddresses.AdditionalAddress.PersonInfo.ZipCode ?? orderInt?.PersonInfoShipTo?.ZipCode,
                  DayFaxNo: '',
                  DayPhone: EvaluaDayPhone(AdditionalAddresses?.AdditionalAddress?.PersonInfo, orderInt?.PersonInfoShipTo, false),
                  JobTitle: '',
                  LastName: AdditionalAddresses.AdditionalAddress.PersonInfo.LastName ?? orderInt?.PersonInfoShipTo?.LastName,
                  PersonID: '',
                  FirstName: AdditionalAddresses.AdditionalAddress.PersonInfo.FirstName ?? orderInt?.PersonInfoShipTo?.FirstName,
                  Department: '',
                  MiddleName: AdditionalAddresses.AdditionalAddress.PersonInfo.MiddleName ?? orderInt?.PersonInfoShipTo?.MiddleName,
                  OtherPhone: '',
                  MobilePhone: EvaluaDayPhone(AdditionalAddresses?.AdditionalAddress?.PersonInfo, orderInt?.PersonInfoShipTo, true),
                  AddressLine1: AdditionalAddresses.AdditionalAddress.PersonInfo.AddressLine1 ?? orderInt?.PersonInfoShipTo.AddressLine1,
                  AddressLine2: AdditionalAddresses.AdditionalAddress.PersonInfo.AddressLine2 ?? orderInt?.PersonInfoShipTo.AddressLine2,
                  AddressLine3: AdditionalAddresses.AdditionalAddress.PersonInfo.AddressLine3 ?? orderInt?.PersonInfoShipTo.AddressLine3,
                  AddressLine4: AdditionalAddresses.AdditionalAddress.PersonInfo.AddressLine4 ?? orderInt?.PersonInfoShipTo.AddressLine4,
                  AddressLine5: AdditionalAddresses.AdditionalAddress.PersonInfo.AddressLine5 ?? orderInt?.PersonInfoShipTo.AddressLine5,
                  AddressLine6: AdditionalAddresses.AdditionalAddress.PersonInfo.AddressLine6 ?? orderInt?.PersonInfoShipTo.AddressLine6,
                  EveningFaxNo: '',
                  EveningPhone: '',
                  PersonInfoKey: AdditionalAddresses.AdditionalAddress.PersonInfoKey,
                  AlternateEmailID: "",
                },
                AddressType: AdditionalAddresses.AdditionalAddress.AddressType,
                PersonInfoKey: AdditionalAddresses.AdditionalAddress.PersonInfoKey,
                EntityParentKey: AdditionalAddresses.AdditionalAddress.EntityParentKey,
                EntityAddressKey: AdditionalAddresses.AdditionalAddress.EntityAddressKey,
              },
            },
            MaxShipmentStatusDesc: "",
            MinShipmentStatusDesc: "",

          };
        }),
      },
      References: {
        Reference: orderInt.References?.Reference?.map((ref) => ({
          Name: ref.Name,
          Value: String(ref.Value),
        })),
      },
      IsDuplicate: "",
      MessageType: orderInt.MessageType,
      StatusOrder: orderInt.StatusOrder,
      DocumentType: orderInt.DocumentType,
      EnterpriseCode: orderInt.EnterpriseCode,
      MaxOrderStatus: orderInt.MaxOrderStatus,
      MinOrderStatus: orderInt.MinOrderStatus,
      CustomerEMailID: orderInt.CustomerEmailId,
      StatusTimeStamp: null,
      // StatusTimeStamp: '2024-03-08T08:57:34-06:00',
      MaxOrderStatusDesc: orderInt.MaxLineStatusDesc,
      MinOrderStatusDesc: orderInt.MinOrderStatusDesc,
      SellerOrganizationCode: orderInt.SellerOrganizationCode,
    },
  };

  return orderOut;
};

exports.ActualizaOrderKeys = async (BuscarLinea, HeaderNuevo) => {
  await OrdenVenta.update(
    {
      OrderHeaderKey: HeaderNuevo,
    },
    {
      where: {
        OrderHeaderKey: BuscarLinea,
      },
    },
  );
};
