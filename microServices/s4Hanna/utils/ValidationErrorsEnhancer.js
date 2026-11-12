const { validationResult } = require("express-validator");

exports.validationErrorsEnhancer = (req) => {
  // Finds the validation errors in this request and wraps them in an object with handy functions
  const errors = validationResult(req);
  let messages = "";
  if (!errors.isEmpty()) {
    let increment = 0;
    errors.array().forEach((error) => {
      increment = +1;
      if (errors.array().length === 1 || errors.array().length === increment) {
        messages += `${error.msg}.`;
      } else {
        messages += `${error.msg}, `;
      }
    });
    return messages;
  }
  return undefined;
};
