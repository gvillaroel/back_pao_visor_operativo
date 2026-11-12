const errorHandler = (err, req, res, next) => {
  const error = { ...err };

  error.message = err.message;
  error.internalCode = err.internalCode;
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
    code: error.internalCode || 9999,
  });
};

module.exports = errorHandler;
