import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE || "24h";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRE }
  );
};

export const verifyAccessToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      throw new Error("Token has expired");
    }
    throw new Error("Invalid token");
  }
};

export const extractTokenFromHeader = (authHeader) => {
  if (!authHeader) return null;
  const [bearer, token] = authHeader.split(" ");
  return bearer === "Bearer" ? token : null;
};

export default {
  generateAccessToken,
  verifyAccessToken,
  extractTokenFromHeader
};