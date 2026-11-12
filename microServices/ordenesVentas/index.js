const app = require('./serverinfo');

const PORT = process.env.PORT_2 || 4002;
app.listen(
  PORT,
  console.log(
    `Liverpool-Visor App Running in ${process.env.DESC_ENV} mode on ${PORT}!`
  )
);
