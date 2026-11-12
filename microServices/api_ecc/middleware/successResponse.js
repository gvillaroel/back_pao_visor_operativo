const successResponse = (
  res,
  data,
  message,
  code,
  total,
  totalRowsPages,
  numPage,
  numPages,
) => {
  const json = { success: true };

  if (data) {
    json.data = data;
  }

  if (message) {
    json.message = message;
  } else {
    json.message = 'Succesful operation';
  }

  if (code) {
    json.code = code;
  } else {
    json.code = 200;
  }

  if (total) {
    json.total_rows = total;
  }

  if (totalRowsPages) {
    json.totalRowsPages = totalRowsPages;
  }

  if (numPage) {
    json.numPage = numPage;
  }

  if (numPages) {
    json.numPages = numPages;
  }
  res.status(json.code).json(json);
};

module.exports = successResponse;
