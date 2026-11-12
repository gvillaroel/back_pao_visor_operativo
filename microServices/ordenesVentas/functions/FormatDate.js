function FormatDate(fecha) {
  const fechaObj = new Date(fecha);

  const year = fechaObj.getFullYear();
  const month = String(fechaObj.getMonth() + 1).padStart(2, '0');
  const day = String(fechaObj.getDate()).padStart(2, '0');
  const FormatDate = `${year}/${month}/${day}`;
  return FormatDate;
}
module.exports = { FormatDate };
