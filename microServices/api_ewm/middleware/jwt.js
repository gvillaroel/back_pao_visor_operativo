/*
const jwt = require('jsonwebtoken');
const log4js = require('log4js');
const configlog = require('../log4js.json');

//const { checkPerfilCorto } = require('../controllers/LoginController');

const sociedadesLiver = ['140', '110'];
const { sanitize } = require('./sanitize');

log4js.configure(configlog);
const logger = log4js.getLogger('jwt');

// @desc Importing the methods from the model repository;
// const {
//   Create,
// } = require('../repositories/BitacoraAccesosRepository');

// @desc  Validamos si es para iniciar sesion o si se usa como middleware
// @desc  Para iniciar sesion se valida con AD y regresamos de perfil corto
// informacion sobre negocio
module.exports.authJWT = async (req, res, next) => {
  const vreq = req;
  const user = req.sanitize(vreq.body.user);
  try {
    logger.info('En metodo authJWT: ', user);
    logger.info(vreq.headers.host, vreq.clientIp);

    const token = req.sanitize(
      vreq.header('Authorization').replace('Bearer', '').trim(),
    );

    jwt.verify(token, process.env.JWT_SECRET, async (err, usuario) => {
      const vuser = usuario;
      if (err) {
        res.status(401).json({ message: 'Error en token.' });
      } else {
        if (typeof vuser.user !== 'string') {
          vuser.user = '';
        }
        const userSplit = vuser.user.split('@')[0].toLowerCase();
        if (
          userSplit.includes('test') ||
          userSplit.includes('ajfajardog') ||
          userSplit.includes('rramireza20')
        ) {
          vreq.decodedToken = {};
          vreq.decodedToken.society = '114';
          vreq.decodedToken.email = vuser.user;
          const bitacora = {
            nombre_accion: 'LOGIN',
            nombre_modulo: 'Acceso permitido Auth',
            usuario: vuser.user,
            so: req.sanitize(vreq.headers['sec-ch-ua-platform']),
            ip: req.sanitize(vreq.headers['x-forwarded-for']),
            navegador: req.sanitize(vreq.headers['sec-ch-ua'])
              ? req.sanitize(vreq.headers['sec-ch-ua'])
              : req.sanitize(vreq.headers['user-agent']),
            origen: req.sanitize(vreq.headers.origin),
          };
          await Create(bitacora);
          next();
        } else {
          const output = await checkPerfilCorto(vuser.user, vreq);
          if (output.code === 200) {
            vreq.decodedToken = {};
            vreq.decodedToken.society =
              sociedadesLiver.find(
                (element) => element === output.data.idSociety,
              ) !== undefined
                ? 'LIVERPOOL'
                : 'SUBURBIA';
            vreq.decodedToken.email = output.data.email;
            vreq.decodedToken.position = output.data.id_function;
            const bitacora = {
              nombre_accion: 'LOGIN',
              nombre_modulo: 'Validación Token OK',
              usuario: vuser.user,
              employeenumber: output.data.employeeNumber,
              id_function: output.data.id_function,
              desc_function: output.data.desc_function,
              area_trabajo: output.data.area_trabajo,
              idsociety: output.data.idSociety,
              society: output.data.society,
              idphisicalocation: output.data.idphisicalocation,
              phisicallocation: output.data.phisicalLocation,
              so: req.sanitize(vreq.headers['sec-ch-ua-platform']),
              ip: req.sanitize(vreq.headers['x-forwarded-for']),
              navegador: req.sanitize(vreq.headers['sec-ch-ua'])
                ? req.sanitize(vreq.headers['sec-ch-ua'])
                : req.sanitize(vreq.headers['user-agent']),
              origen: req.sanitize(vreq.headers.origin),
            };
            await Create(bitacora);

            // Sanitize every parameter
            req = { ...sanitize(req) };
            next();
          } else {
            res.status(401).json({ message: 'No tienes autorización' });
          }
        }
      }
    });
  } catch (error) {
    logger.error(error);
    res.status(401).json({ message: 'Error en token.' });
  }
};
*/
