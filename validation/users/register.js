const Validator = require("validator");
const isEmpty = require("is-empty");
module.exports = function validateRegisterInput(data) {
  let errors = {};
  // Convert empty fields to an empty string so we can use validator functions
  data.email = !isEmpty(data.email) ? data.email : "";
  data.fname = !isEmpty(data.fname) ? data.fname : "";
  data.lname = !isEmpty(data.lname) ? data.lname : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  } else if (!Validator.isEmail(data.email)) {
    errors.email = "Email is invalid";
  }
  if (Validator.isEmpty(data.fname)) {
    errors.fname = "First Name field is required";
  }
  if (Validator.isEmpty(data.lname)) {
    errors.lname = "Last Name field is required";
  }
  if (
    Validator.isEmpty(data.password) ||
    !Validator.isLength(data.password, { min: 6 })
  ) {
    errors.password = "Password should be 6 characters or more";
  }

  return {
    errors,
    isValid: isEmpty(errors)
  };
};
