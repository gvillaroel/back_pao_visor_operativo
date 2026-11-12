const express = require('express');
const dotenv = require('dotenv');
const log4js = require('log4js');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const multer = require('multer');
const requestIp = require('request-ip');
const expressSanitizer = require('express-sanitizer');

const errorHandler = require('./middleware/error');

// @desc Importing the methods from the utils repository;
dotenv.config({ path: './config/config.env' });

const configlog = require('./log4js.json');

log4js.configure(configlog);
const logger = log4js.getLogger('Appjs');

const db = require('./config/db');
const methodOverride = require('method-override');

db.authenticate()
  .then(() => logger.info('Database connected'))
  .catch((err) => logger.error('ERR', err));

const tokenMagic = require('./middleware/tokenMagic');
const urlMagic = require('./middleware/urlMagic');

const folio = require('./routes/FolioRoutes');

const healthcheckRoutes = require('./routes/HealthCheckRoutes');
const archivoLogRoutes = require("./routes/ArchivoLogRoutes");

const app = express();
// Configuración del límite de payload
app.use(bodyParser.json({ limit: '900kb' }));
app.use(bodyParser.urlencoded({ limit: '900kb', extended: true }));
app.use(methodOverride('_method'));
const upload = multer({ dest: './uploads/' });
app.use(requestIp.mw());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(expressSanitizer());

if (process.env.DESC_ENV === 'dev') {
  app.use(morgan('dev'));
}

app.use(cors());

app.use('/api/mesaayuda/tokenMagic', tokenMagic);
app.use('/api/mesaayuda/urlMagic', urlMagic);
app.use('/api/mesaayuda/ingestafolio', folio);
app.use('/api/mesaayuda/envioint201', folio);
app.use("/api/mesaayuda/health", healthcheckRoutes);
app.use("/api/mesaayuda/archivoLog", archivoLogRoutes);

// Manejo de método no permitido para todas las rutas
app.use((req, res, next) => {
  res.status(405).send({ message: 'Método no permitido' });
});
app.use(errorHandler);

process.on('uncaughtException', (err) => {
  logger.error('Ocurrió un error inesperado:', err);
});

module.exports = app;
