const express = require("express");
const dotenv = require("dotenv");
const log4js = require("log4js");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const requestIp = require("request-ip");
const expressSanitizer = require("express-sanitizer");
const path = require("path");
const errorHandler = require("./middleware/error");

// Carga de variables de entorno
dotenv.config({ path: path.resolve(__dirname, "./config/config.env") });

const configlog = require("./log4js.json");
log4js.configure(configlog);
const logger = log4js.getLogger("NodeAvailabilityApp");

const db = require("./config/db");

// Verificación de conexión a la Base de Datos
db.sequelize
  .authenticate()
  .then(() => logger.info("Base de datos conectada exitosamente"))
  .catch((err) => logger.error("Error al conectar a la base de datos:", err.message));

const nodeAvailabilityRoutes = require("./routes/NodeAvailabilityRoutes");
const healthcheckRoutes = require("./routes/HealthCheckRoutes");

const app = express();

app.use(requestIp.mw());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(expressSanitizer());

// Logging en desarrollo
if (process.env.DESC_ENV === "dev" || process.env.DESC_ENV === "DEV") {
  app.use(morgan("dev"));
}

app.use(cors());

// Rutas base
app.use("/oms/api/nodeAvailability", nodeAvailabilityRoutes);
app.use("/oms/api/health", healthcheckRoutes);

// Manejo de método no permitido para rutas no coincidentes
app.use((req, res) => {
  res.status(405).send({ message: "Método no permitido" });
});

app.use(errorHandler);

process.on("uncaughtException", (err) => {
  logger.error("Ocurrió un error inesperado en nodeAvailability:", err);
});

module.exports = app;
