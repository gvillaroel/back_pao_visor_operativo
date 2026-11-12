/* eslint-disable max-len */
const log4js = require("log4js");
const config = require("../log4js.json");

log4js.configure(config);
const logger = log4js.getLogger("OrdenesController");

async function esCadenaFechaValida(cadena) {
    try {
        logger.info("En metodo esCadenaFechaValida:", cadena);
        const fecha = Date.parse(cadena);
        if (isNaN(fecha)) {
            return false;
        }
        return true;
    } catch (error) {
        logger.error(error);
        return false;
    }
}

async function obtenerListaStatusShipment() {
    const statusShipment = {
        '1100': 'Pedido asignado',
        '1100.70.60.25': 'Pedido surtido',
        '1300': 'Pedido empacado',
        '1100.70.60.40': 'Listo para recoger',
        '1100.70.60.4': 'Listo para recoger',
        '1400': 'Pedido enviado',
        '1400.010': 'Pedido en camino',
        '1400.020': 'Pedido entregado',
        '1400.01': 'Pedido en camino',
        '1400.02': 'Pedido entregado',
        '9000': 'Pedido cancelado',
        '1100.70.60.35': 'Pedido empacado',
        '1100.71': 'Recibido en locación de entrega',
        '1600.01': 'Recibido',
        '1500': 'Not in use',
        '1200': 'Pedido en proceso de surtido',
        '1600': 'Incluido en el Recibo',
        '1600.001': 'Recibido',
        '1100.70.06.10': 'Pedido listo para surtir',
        '1100.70.06.30': 'Listo para recoger',
        '1100.70.06.50': 'Pedido listo para empacar',
        '1100.70.06.70': 'Pedido en proceso de empaque',
        '1100.70.60.20': 'Surtido Iniciado',
        '1100.70.06.1': 'Pedido listo para surtir',
        '1100.70.06.3': 'Listo para recoger',
        '1100.70.06.5': 'Pedido listo para empacar',
        '1100.70.06.7': 'Pedido en proceso de empaque',
        '1100.70.60.2': 'Surtido Iniciado',
        '1400.040': 'intento de entrega',
        '1400.04': 'intento de entrega',
        '1100.70.60.15': 'Pendiente fecha de entrega',
        '1100.70.60.45': 'Ruteado',
        '1100.70.60.17': 'Preparando Pedido',
    };
    return statusShipment;
}

function extractValuesByKeywords(str, keywords) {
    const result = [];
    // Separar la cadena por comas
    const parts = str.split(",");

    // Recorrer cada parte de la cadena
    parts.forEach((part) => {
        // Recorrer cada keyword
        keywords.forEach((keyword) => {
            // Buscar si la parte actual contiene la keyword
            if (part.includes(keyword)) {
                // Extraer el valor asociado con la keyword
                const value = part.split(keyword)[1].trim();
                result.push(value);
            }
        });
    });

    return result;
}

function cleanStr({ str, replace }) {
    const posicion = str.indexOf(replace);
    if (posicion !== -1) {
        return str.slice(0, posicion).trim();
    }
    return str.trim();
}

module.exports = { esCadenaFechaValida, obtenerListaStatusShipment, cleanStr, extractValuesByKeywords };