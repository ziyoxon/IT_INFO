const { to } = require("../helpers/to_promise");
const myJwt = require("../services/jwt_service");

module.exports = function (roles) {
  return async function (req, res, next) {
    try {
      // authorization
      const authorization = req.headers.authorization;
      if (!authorization) {
        return res.status(403).send({
          statusCode: 403,
          message: "Token berilmagan",
        });
      }
      // console.log(authorization);
      const bearer = authorization.split(" ")[0];
      const token = authorization.split(" ")[1];

      if (bearer != "Bearer" || !token) {
        return res.status(403).send({
          statusCode: 403,
          message: "Token noto'g'ri",
        });
      }
      const [error, decodedToken] = await to(myJwt.verifyAccessToken(token));
      console.log(decodedToken);
      if (error) {
        return res.status(403).send({
          statusCode: 403,
          message: error.message,
        });
      }
      req.user = decodedToken; // keyingi darsda tushintitiriladi
      
      next();
    } catch (error) {
      console.log(error);
      res.status(401).send({ error: "User ro'yhatdan o'tmagan." });
    }
  };
};
