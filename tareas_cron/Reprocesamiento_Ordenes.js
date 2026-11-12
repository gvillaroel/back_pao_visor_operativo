const cron = require("node-cron");
const reprocesamientoGenerarlOrdenes = require("../utils/ReprocesamientoGeneral");

// Define la tarea cron
const tareaReprocesoGeneralOrdenes = cron.schedule("*/3 * * * *", () => {
  // Esta función se ejecutará cada minuto

  console.log("La tarea Reprocesamiento de Ordenes Cron se ejecutó false a las", new Date());
  //reprocesamientoGenerarlOrdenes(false);

  console.log("La tarea Reprocesamiento de Ordenes Cron se ejecutó true a las", new Date());
  reprocesamientoGenerarlOrdenes(false);
});

reprocesamientoGenerarlOrdenes(false);

// Inicia la tarea cron
// tareaReprocesoGeneralOrdenes.start();

module.exports = tareaReprocesoGeneralOrdenes;
