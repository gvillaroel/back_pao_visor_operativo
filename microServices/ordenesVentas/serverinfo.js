const express = require('express');
const dotenv = require('dotenv');
const log4js = require('log4js');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
// const multer = require('multer');
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

db.sequelize.authenticate()
  .then(() => logger.info('Database connected'))
  .catch((err) => logger.error('ERR', err));

const tokenMagic = require('./middleware/tokenMagic');
const urlMagic = require('./middleware/urlMagic');

const s4hanna = require('./routes/S4HannaRoutes');
const ordenesVenta = require('./routes/OrdenesVentaRoutes');
const infoOrden = require('./routes/InfoOrden');

// const tokenurl = require('./routes/TokenUrlMagicRoutes');
const healthcheckRoutes = require('./routes/HealthCheckRoutes');

const app = express();
app.use(methodOverride('_method'));
// const upload = multer({ dest: './uploads/' });
app.use(requestIp.mw());
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(expressSanitizer());
// app.use(expressValidator());

// dev loggin middleware
if (process.env.DESC_ENV === 'dev') {
  app.use(morgan('dev'));
}

// Cors security
// const corsOptions = {
//   origin: true,
//   credentials: true,
// };
app.use(cors());

app.use('/apivisor/tokenMagic', tokenMagic);
app.use('/apivisor/urlMagic', urlMagic);
app.use('/apivisor/s4Hanna', s4hanna);
app.use('/apivisor/ordenesVenta', ordenesVenta);
app.use('/apivisor/health', healthcheckRoutes);
app.use('/apivisor/ordenes/pao', infoOrden);

// Manejo de método no permitido para todas las rutas
app.use((req, res, next) => {
  res.status(405).send({ message: 'Método no permitido' });
});

app.use(errorHandler);

process.on('uncaughtException', (err) => {
  logger.error('Ocurrió un error inesperado:', err);
});

module.exports = app;
