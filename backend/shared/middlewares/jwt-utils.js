const jwt = require("jsonwebtoken");

function encodeToken(userData) {
  return jwt.sign(
    {
      _id: userData._id,
      email: userData.email,
      name: userData.name,
      role: userData.role || "customer",
      freelancerId: userData.freelancerId
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );
}

function decodeToken(token) {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    throw new Error("Invalid or expired token");
  }
}

module.exports = { encodeToken, decodeToken };