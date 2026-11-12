// utils/excelUtils.js
const writeXlsxFile = require('write-excel-file/node');

/**
 * Genera un archivo Excel a partir de los datos proporcionados.
 *
 * @param {Array} rows - Array de objetos que representan las filas de datos.
 * @param {Array} columns - Array de objetos que definen las columnas (header, width, etc.).
 * @param {Object} options - Opciones adicionales para la configuración del archivo.
 * @param {string} fileName - Nombre del archivo a generar.
 * @returns {Promise<void>} - Promesa que se resuelve cuando el archivo se ha generado.
 */
async function generateExcelFile(data) {

  // Generar el archivo Excel
  try {
    const buffer = await writeXlsxFile(data, { buffer: true });
    console.log('Archivo generado exitosamente.');
    return buffer;
  } catch (error) {
    console.error('Error al generar el archivo Excel:', error);
    throw new Error('Error al generar el archivo Excel.');
  }
}

module.exports = {
  generateExcelFile,
};
