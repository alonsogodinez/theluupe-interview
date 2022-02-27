const { sign, verify } = require("jsonwebtoken");
const { hash } = require("bcrypt");

function getFromCookies (req){
  return req.cookies && req.cookies.jwt
};

// function getFromHeaders (req){
//   return req.headers && req.headers['authorization'] || ''
// };

function getToken({ request }){
  const token = getFromCookies(request)
  if(token)  {
    try {
      return verify(token, process.env.JWT_SECRET)
    } catch (e) {
      throw new Error(
        'Authentication token is invalid, please log in',
      )
    }
  }
};

const generateToken = (userId, firstName) => {
  return sign(
    {
      userId,
      firstName
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
};


const generateHashPassword = (password) => {
  if (password.length < 8) {
    throw new Error("Password should be greater than 8 characters");
  }
  return hash(password, 10);
};

module.exports = {
  generateToken,
  generateHashPassword,
  getToken,
};