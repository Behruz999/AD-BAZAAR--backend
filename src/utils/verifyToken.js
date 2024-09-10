const { verify } = require("jsonwebtoken");

function isUserAuthenticated(req, res, next) {
  try {
    const token = req.headers["authorization"];
    if (!token) {
      return res.status(403).json({
        msg: `You do not have the necessary token to access this system !`,
      });
    }

    const decodedToken = verify(token.split(" ")[1], process.env?.JWT_SECRET);
    if (!decodedToken) {
      const msg = `Failed to authenticate token !`;
      return res.status(403).json({ msg });
    }

    req.user = decodedToken;
    next();
  } catch (err) {
    next(err);
  }
}

module.exports = isUserAuthenticated;
