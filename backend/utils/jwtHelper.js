import jwt from "jsonwebtoken";
import crypto from "crypto";

class JWTHelper {
  constructor() {
    // Ensure JWT_SECRET exists 

    this.secret = process.env.JWT_SECRET;
    this.accessTokenExpiry = process.env.JWT_ACCESS_EXPIRE || "15m";
    this.refreshTokenExpiry = process.env.JWT_REFRESH_EXPIRE || "7d";
  }

  //Generate access token
  generateAccessToken(payload) {
    const tokenPayload = {
      userId: payload.userId || payload._id,
      email: payload.email,
      role: payload.role,
      employeeId: payload.employeeId,
      fullName: payload.fullName,
      type: "access",
    };

    return jwt.sign(tokenPayload, this.secret, {
      expiresIn: this.accessTokenExpiry,
      issuer: "emr-system",
      audience: "emr-users",
    });
  }

  //Generate refresh token
  generateRefreshToken(payload) {
    const tokenPayload = {
      userId: payload.userId || payload._id,
      email: payload.email,
      type: "refresh",
      // Add random string for additional security
      jti: crypto.randomBytes(16).toString("hex"),
    };

    return jwt.sign(tokenPayload, this.secret, {
      expiresIn: this.refreshTokenExpiry,
      issuer: "emr-system",
      audience: "emr-users",
    });
  }

  //Generate both access and refresh tokens
  generateTokenPair(user) {
    const payload = {
      userId: user._id,
      email: user.email,
      role: user.role,
      employeeId: user.employeeId,
      fullName: user.fullName,
    };

    return {
      accessToken: this.generateAccessToken(payload),
      refreshToken: this.generateRefreshToken(payload),
      expiresIn: this.accessTokenExpiry,
    };
  }

  //Verify and decode JWT token
  verifyToken(token) {
    try {
      return jwt.verify(token, this.secret, {
        issuer: "emr-system",
        audience: "emr-users",
      });
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new Error("Token has expired");
      } else if (error.name === "JsonWebTokenError") {
        throw new Error("Invalid token");
      } else if (error.name === "NotBeforeError") {
        throw new Error("Token not active yet");
      } else {
        throw new Error("Token verification failed");
      }
    }
  }

  //Verify access token specifically
  verifyAccessToken(token) {
    const decoded = this.verifyToken(token);

    if (decoded.type !== "access") {
      throw new Error("Invalid token type");
    }

    return decoded;
  }

  //Verify refresh token specifically
  verifyRefreshToken(token) {
    const decoded = this.verifyToken(token);

    if (decoded.type !== "refresh") {
      throw new Error("Invalid token type");
    }

    return decoded;
  }

  //Extract token from Authorization header

  extractTokenFromHeader(authHeader) {
    if (!authHeader) return null;

    const parts = authHeader.split(" ");

    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return null;
    }

    return parts[1];
  }

  //Get token expiration date
  getTokenExpiration(token) {
    try {
      const decoded = jwt.decode(token);
      return new Date(decoded.exp * 1000);
    } catch (error) {
      throw new Error("Invalid token format");
    }
  }

  //Check if token is expired
  isTokenExpired(token) {
    try {
      const expirationDate = this.getTokenExpiration(token);
      return expirationDate < new Date();
    } catch (error) {
      return true; // Consider invalid tokens as expired
    }
  }

  //Decode token without verification (for debugging)
  decodeToken(token) {
    return jwt.decode(token);
  }

  //Generate password reset token
  generatePasswordResetToken(user) {
    const payload = {
      userId: user._id,
      email: user.email,
      type: "password_reset",
      timestamp: Date.now(),
    };

    return jwt.sign(payload, this.secret, {
      expiresIn: "1h", // Password reset tokens expire in 1 hour
      issuer: "emr-system",
      audience: "emr-users",
    });
  }

  //Generate email verification token
  generateEmailVerificationToken(user) {
    const payload = {
      userId: user._id,
      email: user.email,
      type: "email_verification",
      timestamp: Date.now(),
    };

    return jwt.sign(payload, this.secret, {
      expiresIn: "24h", // Email verification tokens expire in 24 hours
      issuer: "emr-system",
      audience: "emr-users",
    });
  }

  //Verify special purpose tokens (reset, verification)
  verifySpecialToken(token, expectedType) {
    const decoded = this.verifyToken(token);

    if (decoded.type !== expectedType) {
      throw new Error("Invalid token type");
    }

    return decoded;
  }
}

const jwtHelper = new JWTHelper();

export default jwtHelper;
