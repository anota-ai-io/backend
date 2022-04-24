const AuthBusiness = require("../business/auth.business");

async function protectedRoute(req, res, next) {
  const token = extractToken(req.headers);

  const decoded = await AuthBusiness.verifyToken(token);

  if (decoded["status"] === "error") {
    return res.status(400).json(decoded);
  }

  req.token = decoded;

  next();
}

async function refreshTokenRoute(req, res, next) {
  const token = extractToken(req.headers);

  const decoded = await AuthBusiness.verifyToken(token, true);

  const code = decoded["code"] ? decoded["code"] : null;

  // Permitir códigos de JWT Expired, mas recusar outros códigos de erro
  if (decoded["status"] === "error" && code !== "JWTExpired") {
    return res.status(400).json(decoded);
  }

  req.token = decoded;

  next();
}

function extractToken(headers) {
  const authorization = headers["authorization"];
  const token = authorization ? authorization.split(" ")[1] : "";
  return token;
}

module.exports = { protectedRoute, refreshTokenRoute };
