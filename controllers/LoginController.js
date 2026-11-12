const axios = require("axios");
const jwt = require("jsonwebtoken");
const log4js = require("log4js");
const ActiveDirectory = require("activedirectory2");
const asyncHandler = require("../middleware/async");
const clientResponse = require("../middleware/clientResponse");

const logger = log4js.getLogger("LoginController");
const configlog = require("../log4js.json");

log4js.configure(configlog);
// @desc Importing the methods from the model repository;
const { Create } = require("../repositories/BitacoraAccesosRepository");

/**
  * Se valida la existencia y estado del usuario con su respectiva contraseña en el Active Directory
  *
  * @param user {string} correo corporativo
  * @param pass {string} contraseña
  * @param req {JSON} request para guardar informacion en bitacora
  */
function checkAD(user, pass, req) {
    let username = user;
    const password = pass;
    const config = {
        url: process.env.URL_LDAP,
        baseDN: process.env.BASEDN_LDAP,
        bindDN: process.env.BINDDN_LDAP,
        username: process.env.USERNAME_LDAP,
        password: process.env.PASSWORD_LDAP,
    };
    return new Promise((resolve) => {
        try {
            logger.info("En metodo Login: ", username);
            if (typeof username !== "string") {
                username = "";
            }
            username = username.split("@")[0] + process.env.DOMAIN_AD;
            const ad = new ActiveDirectory(config);
            ad.authenticate(username, password, async (err, auth) => {
                if (auth) {
                    logger.info(auth);
                    const res = { auth: true, error: err };
                    const bitacora = {
                        nombre_accion: "LOGIN",
                        nombre_modulo: "Validación AD",
                        usuario: username,
                        so: req["sec-ch-ua-platform"] ? req["sec-ch-ua-platform"] : "",
                        ip: req["x-forwarded-for"] ? req["x-forwarded-for"] : "",
                        navegador: req["sec-ch-ua"] ? req["sec-ch-ua"] : req["user-agent"],
                        origen: req.origin ? req.origin : "fuera de un navegador",
                    };
                    await Create(bitacora);
                    logger.info("Revision AD: ", username);
                    resolve(res);
                } else if (err) {
                    logger.info(err);
                    if (typeof err.lde_message === "string") {
                        switch (true) {
                            case err.lde_message.includes("525"):
                                resolve({ auth: false, error: "Usuario no encontrado." });
                                break;
                            case err.lde_message.includes("52e"):
                                resolve({ auth: false, error: "Credenciales inválidas." });
                                break;
                            case err.lde_message.includes("530"):
                                resolve({ auth: false, error: "No puedes acceder por el momento." });
                                break;
                            case err.lde_message.includes("532"):
                                resolve({ auth: false, error: "Tu contraseña expiró." });
                                break;
                            case err.lde_message.includes("533"):
                                resolve({ auth: false, error: "Tu cuenta esta deshabilitada." });
                                break;
                            case err.lde_message.includes("701"):
                                resolve({ auth: false, error: "Tu cuenta expiró." });
                                break;
                            case err.lde_message.includes("773"):
                                resolve({ auth: false, error: "Debes resetear tu contraseña." });
                                break;
                            case err.lde_message.includes("775"):
                                resolve({ auth: false, error: "Tu cuenta esta bloqueada." });
                                break;
                            default:
                                resolve({ auth: false, error: "error inesperado en inicio de sesión." });
                        }
                    } else {
                        resolve({ auth: false, error: "error inesperado en inicio de sesión." });
                    }
                }
            });
        } catch (err) {
            logger.info(err);
            resolve({ auth: false, error: "error inesperado en inicio de sesión." });
        }
    });
}
module.exports.AD = checkAD;

/**
  * Se genera el token de sesion
  *
  * @param user {string} correo corporativo
  * @return {String} token firmado, con informacion de usuario y fecha de expiracion 
  */
function generateAccessToken(user) {
    return jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE,
    });
}

/**
  * Se valida la informacion corporativa del usuario como Empresa a la que pertenece.
  *
  * @param email {string} correo corporativo
  * @param req {JSON} request para completar informacion de la bitacora
  */
async function checkPerfilCorto(email, req) {
    logger.info("En metodo checkPerfilCorto: ", email);

    const data = JSON.stringify({
        mail: email,
    });

    const config = {
        method: "post",
        url: process.env.URLPCORTO,
        headers: {
            Authorization: process.env.PCORTO,
            "Content-Type": "application/json",
        },
        data,
        timeout: 30000,
    };

    const output = await axios(config)
        .then(async (response) => {
            const colab = response.data.employeeNumber;
            const bitacora = {
                nombre_accion: "LOGIN",
                nombre_modulo: "Validación Perfil Corto",
                usuario: email,
                employeenumber: response.data.employeeNumber,
                id_function: response.data.id_function,
                desc_function: response.data.desc_function,
                area_trabajo: response.data.area_trabajo,
                idsociety: response.data.idSociety,
                society: response.data.society,
                idphisicalocation: response.data.idphisicalocation,
                phisicallocation: response.data.phisicalLocation,
                so: req["sec-ch-ua-platform"],
                ip: req["x-forwarded-for"],
                navegador: req["sec-ch-ua"] ? req["sec-ch-ua"] : req["user-agent"],
                origen: req.origin,
            };
            await Create(bitacora);
            logger.log("Revision Perfil Corto: ", email, ", ", response.data.society);
            if (colab) {
                return { code: 200, data: response.data };
            }
            return { code: 401, error: "Usuario no encontrado Perfil Corto" };
        })
        .catch((error) => {
            logger.error(error);
            if (error.response.status === 400) {
                return { code: 401, error: "Usuario no encontrado Perfil Corto" };
            }
            return { code: 401, error: "error conexión Perfil Corto" };
        });

    return output;
}
module.exports.checkPerfilCorto = checkPerfilCorto;

/**
  * Se realiza el login, primero se verifica AD, enseguida perfil corto para complementar con informacion del usuario
  * y finalmente se regresa un token de inicio de sesion.
  *
  * @param req {JSON} request que contiene usuario y contraseña
  * @param res {JSON} respuesta de la peticion
  */
module.exports.LoginPAO = asyncHandler(async (req, res, next) => {
    const vreq = req;

    const user = req.sanitize(vreq.body.user);
    const pass = req.sanitize(vreq.body.pass);
    try {
        logger.info("En metodo loginPAO: ", user);
        logger.info(req.headers ? vreq.headers.host : "no host", vreq.clientIp);
        const userSplit = user.split("@")[0].toLowerCase();

        let ad = { auth: true };
        logger.info("DSC_ENV: ", process.env.DESC_ENV);
        logger.info("headers: ", vreq.headers);
        if (process.env.DESC_ENV === "PROD" || process.env.DESC_ENV === "QA") {
            ad = await checkAD(user, pass, vreq.headers);
        }
        if (ad.auth) {
            if (typeof user !== "string") {
                user = "";
            }
            if (userSplit.includes("test")) {
                const decodedToken = {
                    user,
                };
                const accessToken = generateAccessToken(decodedToken);

                const bitacora = {
                    nombre_accion: "LOGIN",
                    nombre_modulo: "Acceso permitido Auth",
                    usuario: user,
                    so: req.sanitize(vreq.headers["sec-ch-ua-platform"]),
                    ip: req.sanitize(vreq.headers["x-forwarded-for"]),
                    navegador: req.sanitize(vreq.headers["sec-ch-ua"]) ? req.sanitize(vreq.headers["sec-ch-ua"]) : req.sanitize(vreq.headers["user-agent"]),
                    origen: req.sanitize(vreq.headers.origin),
                };
                await Create(bitacora);
                let respuesta = {
                    code: 200,
                    idSociedad: "114",
                    name: user,
                    token: accessToken,
                }
                clientResponse(res, 200, "Fetched", respuesta);
            } else {
                //const output = await checkPerfilCorto(user, vreq.headers);
                const output = { code: 200, data: {} }
                if (output.code === 200) {
                    const decodedToken = {
                        user,
                    };
                    const accessToken = generateAccessToken(decodedToken);
                    const bitacora = {
                        nombre_accion: "LOGIN",
                        nombre_modulo: "Acceso permitido",
                        usuario: user,
                        employeenumber: output.data.employeeNumber,
                        id_function: output.data.id_function,
                        desc_function: output.data.desc_function,
                        area_trabajo: output.data.area_trabajo,
                        idsociety: output.data.idSociety,
                        society: output.data.society,
                        idphisicalocation: output.data.idphisicalocation,
                        phisicallocation: output.data.phisicalLocation,
                        so: req.sanitize(vreq.headers["sec-ch-ua-platform"]),
                        ip: req.sanitize(vreq.headers["x-forwarded-for"]),
                        navegador: req.sanitize(vreq.headers["sec-ch-ua"]) ? req.sanitize(vreq.headers["sec-ch-ua"]) : req.sanitize(vreq.headers["user-agent"]),
                        origen: req.sanitize(vreq.headers.origin),
                    };
                    await Create(bitacora);
                    let respuesta = {
                        code: 200,
                        idSociedad: output.data.idSociety,
                        name: output.data.fullname,
                        token: accessToken,
                    }
                    clientResponse(res, 200, "Fetched", respuesta);
                } else {
                    clientResponse(res, 401, "Usuario no encontrado en Perfil Corto.", { error: output.error });
                }
            }
        } else {
            clientResponse(res, 401, "error en AD.", { error: ad.error });
        }
    } catch (error) {
        logger.error(error);
        clientResponse(res, 500, "error en Login.", { error: "error en Login." });
    }
});
