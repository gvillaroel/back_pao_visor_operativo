const successResponse = (res, data, message = "Operación exitosa", code = 200) => {
  const json = {
    success: true,
    code,
    message,
    data: data !== undefined ? data : []
  };
  return res.status(code).json(json);
};

module.exports = successResponse;
