const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

const db = require("../config/db");
const initModels = require("../models/init-models");

async function syncDatabase() {
  try {
    console.log("Conectando a la base de datos...");
    await db.authenticate();
    console.log(`Conexión exitosa a la base de datos "${process.env.DB_NAME}" en ${process.env.DB_HOST}:${process.env.DB_PORT || 5432}.`);

    // Asegurar que exista el esquema cnpao
    await db.query("CREATE SCHEMA IF NOT EXISTS cnpao;");
    console.log("Esquema 'cnpao' verificado/creado exitosamente.");

    // Cargar modelos y definir relaciones
    initModels(db);
    console.log("Modelos y relaciones inicializados.");

    // Sincronizar tablas con la base de datos
    await db.sync({ alter: true });
    console.log("¡Tablas sincronizadas correctamente en el esquema 'cnpao'!");

    process.exit(0);
  } catch (error) {
    console.error("Error al sincronizar la base de datos:", error.message);
    if (error.original) {
      console.error("Detalle:", error.original.message);
    }
    process.exit(1);
  }
}

syncDatabase();
