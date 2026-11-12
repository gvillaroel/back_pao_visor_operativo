const axios = require("axios");
const jwt = require("jsonwebtoken");
const ResponseData = require("../utils/ResponseData");
// @desc Importing the methods from the model repository;

const {
  FetchOnebyToken, Create,
} = require("../repositories/TokenUrlMagicRepository");

// @desc  Enviando el correo del colaborador obtenemos su nombre y negocio al que pertenece
async function checkPerfilCorto(email) {
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
    .then((response) => {
      const colab = response.data.employeeNumber;
      if (colab) {
        return ResponseData("Perfil corto Respuesta", 200, JSON.stringify({ ...response.data }));
      }
      return { code: 401, data: response };
    })
    .catch((error) => ({ code: 401, data: error }));

  return output;
}

function generateAccessToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
}

// @desc  Validamos si es para iniciar sesion o si se usa como middleware
// @desc  Para iniciar sesion se valida con AD y regresamos de perfil corto
// informacion sobre negocio
const authCherwell = async (req, res, next) => {
  const vreq = req;
  const email = req.sanitize(vreq.body.email);
  const orden = vreq.body;

  try {
    const tokenCherwell = req.sanitize(vreq.header("Authorization").replace("Bearer", "").trim());

    jwt.verify(tokenCherwell, process.env.JWT_SECRET, async (err) => {
      if (err) {
        res.send({
          url: `${process.env.URL_BASE_FRONT}/apppao/notFound`,
        });
      } else {
        const check_token = await FetchOnebyToken(tokenCherwell);
        if (check_token !== null) {
          res.send({
            url: `${process.env.URL_BASE_FRONT}/apppao/notFound`,
          });
          return;
        } if (vreq.params.cherwell === "1") {
          await Create({
            correo: req.sanitize(vreq.params.correo),
            token: tokenCherwell,
            activo: 1,
          });
          next();
          return;
        }
        const output = await checkPerfilCorto(email);
        if (output.code === 200) {
          const decodedToken = {
            user: email,
          };
          const accessToken = generateAccessToken(decodedToken);
          const ruta = "/apppao/ordenVentas";
          // ver que pagina visitara de inicio.
          res.send({
            url: `${process.env.URL_BASE_FRONT + ruta}?token=${accessToken}&correo=${email}&posicion=${output.data.id_function}&orden=${orden}`,
          });
        } else {
          res.status(401).json({ message: "No tienes autorizacion" });
        }
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
};

module.exports = authCherwell;
