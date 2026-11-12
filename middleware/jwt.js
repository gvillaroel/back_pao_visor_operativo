const jwt = require("jsonwebtoken");
const log4js = require("log4js");
const configlog = require("../log4js.json");
const asyncHandler = require("./async");
const clientResponse = require("./clientResponse");

const { checkPerfilCorto } = require("../controllers/LoginController");

const sociedadesLiver = ["140", "110"];
const { sanitize } = require("./sanitize");

log4js.configure(configlog);
const logger = log4js.getLogger("jwt");

// @desc Importing the methods from the model repository;
const {
    Create,
} = require("../repositories/BitacoraAccesosRepository");

/**
  * Se valida token, se registran los diferentes accesos en la bitacora y se complementa el request con
  * informacion del usuario sacada de perfil corto
  *
  * @param req {JSON} contiene la informacion del request, en el body viene la info sobre la nueva llave
  * @param res {JSON} la repuesta del servicio
  * @param next {funcion} ejecuta servicio siguiente
  */
module.exports.authJWT = asyncHandler(async (req, res, next) => {
    const vreq = sanitize(req);
    const { user } = vreq.body;
    try {
        logger.info("En metodo authJWT: ", user);
        logger.info(req.headers ? vreq.headers.host : "no host", vreq.clientIp);

        const token = req.sanitize(vreq.header("Authorization").replace("Bearer", "").trim());

        jwt.verify(token, process.env.JWT_SECRET, async (err, usuario) => {
            if (err) {
                clientResponse(res, 403, "error en Token de acceso.", {});
            } else {
                if (typeof usuario.user !== "string") {
                    usuario.user = "";
                }
                const userSplit = usuario.user.split("@")[0].toLowerCase();
                if (userSplit.includes("test")) {
                    vreq.decodedToken = {};
                    vreq.decodedToken.society = "114";
                    vreq.decodedToken.email = usuario.user;
                    const bitacora = {
                        nombre_accion: "LOGIN",
                        nombre_modulo: "Acceso permitido Auth",
                        usuario: usuario.user,
                        so: req.sanitize(vreq.headers["sec-ch-ua-platform"]),
                        ip: req.sanitize(vreq.headers["x-forwarded-for"]),
                        navegador: req.sanitize(vreq.headers["sec-ch-ua"]) ? req.sanitize(vreq.headers["sec-ch-ua"]) : req.sanitize(vreq.headers["user-agent"]),
                        origen: req.sanitize(vreq.headers.origin),
                    };
                    await Create(bitacora);
                    next();
                } else {
                    // const output = await checkPerfilCorto(usuario.user, vreq);
                    const output = { code: 200, data: {} };
                    if (output.code === 200) {
                        vreq.decodedToken = {};
                        vreq.decodedToken.society = (sociedadesLiver.find((element) => element === output.data.idSociety) !== undefined ? "LIVERPOOL" : "SUBURBIA");
                        vreq.decodedToken.email = output.data.email;
                        vreq.decodedToken.position = output.data.id_function;
                        const bitacora = {
                            nombre_accion: "LOGIN",
                            nombre_modulo: "Validación Token OK",
                            usuario: usuario.user,
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

                        next();
                    } else {
                        clientResponse(res, 403, "error en Token de acceso.", {});
                    }
                }
            }
        });
    } catch (error) {
        logger.error(error);
        clientResponse(res, 403, "error en Token de acceso.", {});
    }
});
