const axios = require("axios");
const jwt = require("jsonwebtoken");
const { FetchOne } = require("../repositories/ApikeysRepository");

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
        return { code: 200, data: response.data };
      }
      return { code: 401, data: response };
    })
    .catch((error) => ({ code: 401, data: error }));

  return output;
}

// @desc  Genera el token de acceso
function generateAccessToken(user) {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
}

// @desc  Validamos si es para iniciar sesion o si se usa como middleware
// @desc  Para iniciar sesion se valida con AD y regresamos de perfil corto informacion
// sobre negocio
const authCherwell = async (req, res) => {
  const vreq = req;
  const { email } = vreq.body;

  try {
    const tokenCherwell = vreq.headers.apikey;

    const apikey = await FetchOne(tokenCherwell);

    if (apikey === null) {
      res.status(500).json({ message: "Error en el Token cherwell" });
    } else {
      const output = await checkPerfilCorto(email);
      if (output.code === 200) {
        const decodedToken = {
          user: email,
        };
        const accessToken = generateAccessToken(decodedToken);
        res.send({
          token: accessToken,
        });
      }
    }
  } catch (err) {
    res.status(500).json({ message: err.toString() });
  }
};

module.exports = authCherwell;
