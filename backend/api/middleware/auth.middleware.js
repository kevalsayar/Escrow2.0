const { HelperFunction } = require("./../common/helpers");
/**
 * @description check bearer token exist or not
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
const auth = async function (req, res, next) {
  if (req.headers.authorization) {
    const jwtToken = req.headers.authorization;
    if (jwtToken.includes("Bearer")) {
      const persistentToken = await PersistentTokenModel.getPublicKey(
        jwtToken.split(" ")[1]
      );

      if (persistentToken) {
        const payLoad = HelperFunction.verifyToken(
          persistentToken.jwt,
          persistentToken.publicKey
        );
        next();
      } else {
        res.send("Error");
      }
    } else {
      res.send("Error");
    }
  } else {
    res.send("Error");
  }
};

module.exports = {
  auth,
};
