import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRE = process.env.JWT_EXPIRE || "15m";    
const JWT_REFRESH_EXPIRE = process.env.JWT_REFRESH_EXPIRE || "7d";

const jwtHelper = {
  generateAccessToken: (user) => {
    return jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        employeeId: user.employeeId
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );
  },

  generateRefreshToken: (user) => {
    return jwt.sign(
      { 
        userId: user._id,
        tokenVersion: user.tokenVersion || 0 // For token revocation
      },
      JWT_REFRESH_SECRET,
      { expiresIn: JWT_REFRESH_EXPIRE }
    );
  },

  verifyAccessToken: (token) => {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new Error("Access token has expired");
      }
      throw new Error("Invalid access token");
    }
  },

  verifyRefreshToken: (token) => {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new Error("Refresh token has expired");
      }
      throw new Error("Invalid refresh token");
    }
  },

  extractTokenFromHeader: (authHeader) => {
    if (!authHeader) return null;
    const [bearer, token] = authHeader.split(" ");
    return bearer === "Bearer" ? token : null;
  }
};

export default jwtHelper;