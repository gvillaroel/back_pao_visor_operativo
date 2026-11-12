const express = require("express");
const dotenv = require("dotenv");
const log4js = require("log4js");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const cors = require("cors");
const multer = require("multer");
const requestIp = require("request-ip");
const expressSanitizer = require("express-sanitizer");

const errorHandler = require("./middleware/error");

// @desc Importing the methods from the utils repository;
dotenv.config({ path: "./config/config.env" });

const configlog = require("./log4js.json");

log4js.configure(configlog);
const logger = log4js.getLogger("Appjs");

const db = require("./config/db");
const methodOverride = require("method-override");

db.authenticate()
  .then(() => logger.info("Database connected"))
  .catch((err) => logger.error("ERR", err));

const tokenMagic = require("./middleware/tokenMagic");
const urlMagic = require("./middleware/urlMagic");

const simpliroute = require("./routes/SimplirouteRoutes");
const healthcheckRoutes = require("./routes/HealthCheckRoutes");
const archivoLogRoutes = require("./routes/ArchivoLogRoutes");

const app = express();
app.use(methodOverride("_method"));
app.use(requestIp.mw());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(expressSanitizer());

// dev loggin middleware
if (process.env.DESC_ENV === "dev") {
  app.use(morgan("dev"));
}

// Cors security
const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors());

app.use("/api/ingesta-simpliroute/tokenMagic", tokenMagic);
app.use("/api/ingesta-simpliroute/urlMagic", urlMagic);
app.use("/api/ingesta-simpliroute/simpliroute", simpliroute);
app.use("/api/ingesta-simpliroute/health", healthcheckRoutes);
app.use("/api/ingesta-simpliroute/archivoLog", archivoLogRoutes);

// Inicio de Tareas Cron solo para reproceso manuales
//const tareaReprocesoGeneralOrdenes = require("./tareas_cron/Reprocesamiento_Ordenes");
//tareaReprocesoGeneralOrdenes.start();


// Manejo de método no permitido para todas las rutas
app.use((req, res) => {
  res.status(405).send({ message: "Método no permitido" });
});
app.use(errorHandler);

process.on("uncaughtException", (err) => {
  logger.error("Ocurrió un error inesperado:", err);
});

module.exports = app;
