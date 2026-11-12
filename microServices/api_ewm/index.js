const app = require("./serverinfo");

const PORT = process.env.PORT || 4001;
app.listen(
  PORT,
  console.log(
    `Liverpool-Visor App Running in ${process.env.DESC_ENV} mode on ${PORT}!`,
  ),
);
