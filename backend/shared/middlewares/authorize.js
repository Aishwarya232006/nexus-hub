const { decodeToken } = require("./jwt-utils");

function authorize(requiredRoles = ["customer"]) {
  return (req, res, next) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({
          success: false,
          error: "Authentication required. Please login first."
        });
      }

      const token = authHeader.split(" ")[1];
      const decoded = decodeToken(token);
      
      if (!requiredRoles.includes(decoded.role)) {
        return res.status(403).json({
          success: false,
          error: "Insufficient permissions for this action."
        });
      }

      req.account = decoded;
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired token. Please login again."
      });
    }
  };
}

module.exports = authorize;