const { DataTypes } = require("sequelize");
const _Apikeys = require("./Apikeys");
const _BitacoraAccesos = require("./BitacoraAccesos");
const _errores = require("./Errores");

//Creacion de la Orden
const _OrdenVenta = require("./CreacionOrden/Orden_venta")
const _Integraciones = require("./CreacionOrden/Integraciones")
const _Envio = require("./CreacionOrden/Envio")
const _Linea = require("./CreacionOrden/Linea")
const _Producto = require("./CreacionOrden/Producto")
const _Cliente = require("./CreacionOrden/Cliente")
const _Cliente_contacto = require("./CreacionOrden/Cliente_contacto")
const _Cliente_direccion = require("./CreacionOrden/Cliente_direccion")
const _Notificacion = require("./CreacionOrden/Notificacion")
const _Cat_estatus_notificacion = require("./CreacionOrden/Cat_estatus_notificacion");
const _Gestor = require("./CreacionOrden/Gestor")
const _Cat_proveedores = require("./CreacionOrden/Cat_proveedores")
const _Cat_locaciones = require("./CreacionOrden/Cat_locaciones")

function initModels(sequelize) {
  const Apikeys = _Apikeys(sequelize, DataTypes);
  const BitacoraAccesos = _BitacoraAccesos(sequelize, DataTypes);
  const errores = _errores(sequelize, DataTypes);

  //Creacion de la Orden
  const OrdenVenta = _OrdenVenta(sequelize, DataTypes);
  const Integraciones = _Integraciones(sequelize, DataTypes);
  const Envio = _Envio(sequelize, DataTypes);
  const Linea = _Linea(sequelize, DataTypes);
  const Producto = _Producto(sequelize, DataTypes);
  const Cliente = _Cliente(sequelize, DataTypes);
  const Cliente_direccion = _Cliente_direccion(sequelize, DataTypes);
  const Cliente_contacto = _Cliente_contacto(sequelize, DataTypes);
  const Notificacion = _Notificacion(sequelize, DataTypes);
  const Cat_estatus_notificacion = _Cat_estatus_notificacion(sequelize, DataTypes);
  const Gestor = _Gestor(sequelize, DataTypes);
  const Cat_proveedores = _Cat_proveedores(sequelize, DataTypes);
  const Cat_locaciones = _Cat_locaciones(sequelize, DataTypes);

  //RELACIONES ENTRE LOS MODELOS.

  // Relaciones uno a uno
  Cliente.hasOne(OrdenVenta, { foreignKey: "IDCliente" });
  OrdenVenta.belongsTo(Cliente, { foreignKey: "IDCliente" });

  //Relaciones uno a muchos
  OrdenVenta.hasMany(Linea, { foreignKey: 'OrderHeaderKey' });

  Cliente.hasMany(Cliente_direccion, { foreignKey: 'IDCliente' });
  Cliente.hasMany(Cliente_contacto, { foreignKey: 'IDCliente' });

  Cliente_direccion.belongsTo(Cliente, { foreignKey: 'IDCliente' });
  Cliente_contacto.belongsTo(Cliente, { foreignKey: 'IDCliente' });

  Linea.hasMany(Notificacion, { foreignKey: 'OrderLineKey' });
  Linea.hasMany(Envio, { foreignKey: 'OrderLineKey' });
  Linea.hasMany(Producto, { foreignKey: 'OrderLineKey' });

  Cat_estatus_notificacion.hasMany(Notificacion, { foreignKey: 'id_estatus_notificacion' });
  Cat_estatus_notificacion.hasMany(Notificacion, { foreignKey: 'id_estatus_notificacion' });
  Notificacion.belongsTo(Cat_estatus_notificacion, { foreignKey: 'id_estatus_notificacion' });
  Notificacion.belongsTo(Cat_estatus_notificacion, { foreignKey: 'id_estatus_notificacion' });

  // REORDEREND

  return {
    Apikeys,
    BitacoraAccesos,
    errores,
    //Creacion de la Orden
    OrdenVenta,
    Integraciones,
    Envio,
    Linea,
    Producto,
    Cliente,
    Cliente_contacto,
    Cliente_direccion,
    Notificacion,
    Cat_estatus_notificacion,
    Gestor,
    Cat_proveedores,
    Cat_locaciones,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
