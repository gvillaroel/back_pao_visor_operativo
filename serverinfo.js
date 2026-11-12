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

const archivoLogRoutes = require("./routes/ArchivoLogRoutes");
const loginRoutes = require("./routes/LoginRoutes");
const apikeyRoutes = require("./routes/ApikeyRoutes");
const INT201Routes = require("./routes/INT201Routes");
const INT300Routes = require("./routes/INT300Routes");
const INTGestorRoutes = require("./routes/INTGestorRoutes");
const RecordatoriosRoutes = require("./routes/RecordatoriosRoutes");
const CargaArchivosRoutes = require("./routes/CargaArchivosRoutes");
const locacionesRoutes = require("./routes/LocacionesRoutes");
const proveedoresRoutes = require("./routes/ProveedoresRoutes");
const ordenesRoutes = require("./routes/OrdenesRoutes");
const healthcheckRoutes = require("./routes/HealthCheckRoutes");
const reprocesosRoutes = require("./routes/ReprocesosRoutes");

const app = express();
app.use(methodOverride("_method"));
const upload = multer({ dest: "./uploads/" });
app.use(requestIp.mw());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(expressSanitizer());

// dev loggin middleware
if (process.env.DESC_ENV === "dev") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use("/oms/api/archivoLog", archivoLogRoutes);
app.use("/oms/api/login", loginRoutes);
app.use("/oms/api/apikey", apikeyRoutes);
app.use("/oms/api/INT201", INT201Routes);
app.use("/oms/api/INT300", INT300Routes);
app.use("/oms/api/INTGestor", INTGestorRoutes);
app.use("/oms/api/recordatorios", RecordatoriosRoutes);
app.use("/oms/api/cargaCatalogos", upload.single("file"), CargaArchivosRoutes);
app.use("/oms/api/locaciones", locacionesRoutes);
app.use("/oms/api/proveedores", proveedoresRoutes);
app.use("/oms/api/ordenes", ordenesRoutes);
app.use("/oms/api/health", healthcheckRoutes);
app.use("/oms/api/reprocesos", reprocesosRoutes);

// Inicio de Tareas Cron
 const tareaReprocesoGeneralOrdenes = require("./tareas_cron/Reprocesamiento_Ordenes");

 tareaReprocesoGeneralOrdenes.start();

// Manejo de método no permitido para todas las rutas
app.use((req, res, next) => {
  res.status(405).send({ message: "Método no permitido" });
});

process.on("uncaughtException", (err) => {
  logger.error("Ocurrió un error inesperado:", err);
});

module.exports = app;
