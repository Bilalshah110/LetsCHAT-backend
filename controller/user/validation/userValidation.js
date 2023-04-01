const yup = require("yup");

const userSchema = yup.object().shape({
  name: yup.string().min(2).max(20).required(),
  email: yup.string().email().required(),
  
  // password: yup.string().min(6).max(20).required(),
});

module.exports = { userSchema };
