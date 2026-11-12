const DocumentType = Object.freeze({
  salesOrder: '0001', // 'Orden de Venta',
  transfer: '0006', // 'Transferencia',
  collected: '0003', // 'Recogidos',
  Marketplace: '0005', // 'Marketplace',
});

module.exports = {
  PAGE_NUMBER: 1,
  PAGE_SIZE: 10,
  DocumentType,
};