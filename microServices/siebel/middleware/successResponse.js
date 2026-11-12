const successResponse = (
  res,
  result,
  description,
  code,
  total,
  totalRowsPages,
  numPage,
  numPages
) => {
  const json = {};
  if (code) {
    json.code = code;
  } else {
    json.code = 200;
  }

  if (description) {
    json.description = description;
  } else {
    json.description = 'Succesful operation';
  }

  if (result) {
    json.result = result;
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
