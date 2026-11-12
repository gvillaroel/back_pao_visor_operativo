const successResponse = (
  res,
  data,
  message,
  code,
  total,
  total_rows_pages,
  num_page,
  num_pages,
) => {
  const json = { success: true };

  if (data) {
    json.data = data;
  }

  if (message) {
    json.message = message;
  } else {
    json.message = "Succesful operation";
  }

  if (code) {
    json.code = code;
  } else {
    json.code = 200;
  }

  if (total) {
    json.total_rows = total;
  }

  if (total_rows_pages) {
    json.total_rows_pages = total_rows_pages;
  }

  if (num_page) {
    json.num_page = num_page;
  }

  if (num_pages) {
    json.num_pages = num_pages;
  }
  res.status(json.code).json(json);
};

module.exports = successResponse;
