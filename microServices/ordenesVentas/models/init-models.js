const { DataTypes } = require("sequelize");
const _Apikeys = require("./Apikeys");
const _BitacoraAccesos = require("./BitacoraAccesos");
const _errores = require("./Errores");

// Creacion de la Orden
const _OrdenVenta = require("./CreacionOrden/Orden_venta");
const _Integraciones = require("./CreacionOrden/Integraciones");
const _Envio = require("./CreacionOrden/Envio");
const _Linea = require("./CreacionOrden/Linea");
const _Incidencias = require("./CreacionOrden/Incidencias");
const _TOOrder = require("./CreacionOrden/TOOrder");
const _Producto = require("./CreacionOrden/Producto");
const _Cliente = require("./CreacionOrden/Cliente");
const _Cliente_nuevo = require("./CreacionOrden/Cliente_nuevo");
const _Cliente_contacto = require("./CreacionOrden/Cliente_contacto");
const _Cliente_contacto_nuevo = require("./CreacionOrden/Cliente_contacto_nuevo");
const _Cliente_direccion = require("./CreacionOrden/Cliente_direccion");
const _Cliente_direccion_nuevo = require("./CreacionOrden/Cliente_direccion_nuevo");
const _Notificacion = require("./CreacionOrden/Notificacion");
const _Cat_estatus_notificacion = require("./CreacionOrden/Cat_estatus_notificacion");
const _Gestor = require("./CreacionOrden/Gestor");
const _Cat_proveedores = require("./CreacionOrden/Cat_proveedores");
const _Cat_locaciones = require("./CreacionOrden/Cat_locaciones");
const _Orden_venta_vw = require("./CreacionOrden/Orden_venta_vw");
const _MultiStopTransfers = require("./CreacionOrden/MultiStopTransfers");
const _Fsoms = require("./CreacionOrden/Fsoms");
const _ComentariosOrdenes = require("./CreacionOrden/ComentariosOrdenes");
const _HistoricoComentario = require("./CreacionOrden/HistoricoComentarios");
const _Proveedores = require("./Proveedores");
const _Inventario = require("./Inventario");
const _PedidosImportacion = require("./PedidosImportacion");
const _PedidosNacionales = require("./PedidosNacionales");
const _Centros = require("./Centros");
const _Articulos = require("./Articulos");
const _PedidosExternos = require("./PedidosExternos");
const _ReporteOrdenVenta = require("./ReporteOrdenVenta");

function initModels(sequelize) {
  const Apikeys = _Apikeys(sequelize, DataTypes);
  const BitacoraAccesos = _BitacoraAccesos(sequelize, DataTypes);
  const errores = _errores(sequelize, DataTypes);

  // Creacion de la Orden
  const OrdenVenta = _OrdenVenta(sequelize, DataTypes);
  const OrdenVentaVW = _Orden_venta_vw(sequelize, DataTypes);
  const Integraciones = _Integraciones(sequelize, DataTypes);
  const Envio = _Envio(sequelize, DataTypes);
  const Linea = _Linea(sequelize, DataTypes);
  const Incidencias = _Incidencias(sequelize, DataTypes);
  const TOOrder = _TOOrder(sequelize, DataTypes);
  const Producto = _Producto(sequelize, DataTypes);
  const Cliente = _Cliente(sequelize, DataTypes);
  const Cliente_nuevo = _Cliente_nuevo(sequelize, DataTypes);
  const Cliente_direccion = _Cliente_direccion(sequelize, DataTypes);
  const Cliente_direccion_nuevo = _Cliente_direccion_nuevo(sequelize, DataTypes);
  const Cliente_contacto = _Cliente_contacto(sequelize, DataTypes);
  const Cliente_contacto_nuevo = _Cliente_contacto_nuevo(sequelize, DataTypes);
  const Notificacion = _Notificacion(sequelize, DataTypes);
  const Cat_estatus_notificacion = _Cat_estatus_notificacion(sequelize, DataTypes);
  const Gestor = _Gestor(sequelize, DataTypes);
  const Cat_proveedores = _Cat_proveedores(sequelize, DataTypes);
  const Cat_locaciones = _Cat_locaciones(sequelize, DataTypes);
  const MultiStopTransfers = _MultiStopTransfers(sequelize, DataTypes);
  const Fsoms = _Fsoms(sequelize, DataTypes);
  const ComentariosOrdenes = _ComentariosOrdenes(sequelize, DataTypes);
  const HistoricoComentarios = _HistoricoComentario(sequelize, DataTypes);
  const Proveedores = _Proveedores(sequelize, DataTypes);
  const Inventario = _Inventario(sequelize, DataTypes);
  const PedidosNacionales = _PedidosNacionales(sequelize, DataTypes);
  const PedidosImportacion = _PedidosImportacion(sequelize, DataTypes);
  const Centros = _Centros(sequelize, DataTypes);
  const Articulos = _Articulos(sequelize, DataTypes);
  const PedidosExternos = _PedidosExternos(sequelize, DataTypes);
  const ReporteOrdenVenta = _ReporteOrdenVenta(sequelize, DataTypes)
  // RELACIONES ENTRE LOS MODELOS.

  // Relaciones uno a uno
  Cliente.hasOne(OrdenVenta, { foreignKey: "IDCliente" });
  OrdenVenta.belongsTo(Cliente, { foreignKey: "IDCliente" });

  Cliente_nuevo.hasOne(OrdenVenta, { foreignKey: "IDClienteNuevo" });
  OrdenVenta.belongsTo(Cliente_nuevo, { foreignKey: "IDCliente" });

  // Relaciones uno a muchos
  OrdenVenta.hasMany(Linea, { foreignKey: "OrderHeaderKey" });

  Cliente.hasMany(Cliente_direccion, { foreignKey: "IDCliente" });
  Cliente.hasMany(Cliente_contacto, { foreignKey: "IDCliente" });
  Cliente_nuevo.hasMany(Cliente_direccion_nuevo, { foreignKey: "IDCliente" });
  Cliente_nuevo.hasMany(Cliente_contacto_nuevo, { foreignKey: "IDCliente" });

  Cliente_direccion.belongsTo(Cliente, { foreignKey: "IDCliente" });
  Cliente_contacto.belongsTo(Cliente, { foreignKey: "IDCliente" });
  Cliente_direccion_nuevo.belongsTo(Cliente_nuevo, { foreignKey: "IDCliente" });
  Cliente_contacto_nuevo.belongsTo(Cliente_nuevo, { foreignKey: "IDCliente" });

  Linea.hasMany(Notificacion, { foreignKey: "OrderLineKey" });
  Linea.hasMany(Envio, { foreignKey: "OrderLineKey" });
  Linea.hasMany(Producto, { foreignKey: "OrderLineKey" });
  Linea.hasMany(Incidencias, { foreignKey: "OrderLineKey" });
  Linea.belongsTo(OrdenVenta, { foreignKey: "OrderHeaderKey" });

  Envio.belongsTo(Linea, { foreignKey: "OrderLineKey" });

  Cat_estatus_notificacion.hasMany(Notificacion, { foreignKey: "id_estatus_notificacion" });
  Cat_estatus_notificacion.hasMany(Notificacion, { foreignKey: "id_estatus_notificacion" });
  Notificacion.belongsTo(Cat_estatus_notificacion, { foreignKey: "id_estatus_notificacion" });
  Notificacion.belongsTo(Cat_estatus_notificacion, { foreignKey: "id_estatus_notificacion" });

  ComentariosOrdenes.hasMany(HistoricoComentarios, { as: "historico_comentario", foreignKey: "id_comentario" });
  HistoricoComentarios.belongsTo(ComentariosOrdenes, { as: "comentario", foreignKey: "id_comentario" });

  PedidosImportacion.belongsTo(Articulos, {
    foreignKey: {
      name: "articulo",
    },
    as: "article",
  });

  Articulos.hasMany(PedidosImportacion, {
    foreignKey: "articulo",
    as: "pedidosImportacion",
  });

  PedidosNacionales.belongsTo(Articulos, {
    foreignKey: "sku",
    as: "articulo",
  });

  Articulos.hasMany(PedidosNacionales, {
    foreignKey: "sku",
    as: "pedidosNacionales",
  });

  /* Articulos.belongsTo(Proveedores, {
    foreignKey: "proveedor",
    as: "supplier",
  });
  Proveedores.hasMany(Articulos, {
    foreignKey: "proveedor",
    as: "supplier",
  }); */

  PedidosNacionales.hasOne(Centros, {
    foreignKey: {
      name: "centro",
    },
    as: "center",
  });

  PedidosImportacion.hasOne(Centros, {
    foreignKey: {
      name: "centro",
    },
    as: "center",
  });

  Inventario.belongsTo(Articulos, {
    foreignKey: {
      name: "articulo",
    },
    as: "inventario",
  });

  Articulos.hasOne(Inventario, {
    foreignKey: "articulo",
    as: "inventario",
  });

  Inventario.hasOne(Proveedores, {
    foreignKey: {
      name: "proveedor_id",
    },
    as: "proveedor",
  });

  PedidosExternos.belongsTo(PedidosNacionales, {
    foreignKey: {
      name: "nacional",
    },
    as: "pedidoNacional",
  });

  PedidosNacionales.hasMany(PedidosExternos, {
    foreignKey: "nacional",
    as: "pedidosExternos",
  });

  PedidosExternos.belongsTo(PedidosImportacion, {
    foreignKey: {
      name: "importacion",
    },
    as: "pedidoImportacion",
  });

  PedidosImportacion.hasMany(PedidosExternos, {
    foreignKey: "importacion",
    as: "pedidosExternos",
  });
  // REORDEREND

  return {
    Apikeys,
    BitacoraAccesos,
    errores,
    // Creacion de la Orden
    OrdenVenta,
    OrdenVentaVW,
    Integraciones,
    Envio,
    Linea,
    TOOrder,
    Producto,
    Cliente,
    Cliente_nuevo,
    Cliente_contacto,
    Cliente_contacto_nuevo,
    Cliente_direccion,
    Cliente_direccion_nuevo,
    Notificacion,
    Cat_estatus_notificacion,
    Gestor,
    Cat_proveedores,
    Cat_locaciones,
    MultiStopTransfers,
    Fsoms,
    Incidencias,
    ComentariosOrdenes,
    HistoricoComentarios,
    Proveedores,
    Inventario,
    PedidosNacionales,
    PedidosImportacion,
    Centros,
    Articulos,
    PedidosExternos,
    ReporteOrdenVenta,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
