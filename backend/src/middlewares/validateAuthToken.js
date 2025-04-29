import jwt from "jsonwebtoken";
import { config } from "../config.js";

export const validateAuthToken = (allowedUserTypes = []) => {
  return (req, res, next) => {
    try {
      // Validar si existen cookies
      if (!req.cookies) {
        return res.status(401).json({ message: "No cookies found, authorization required" });
      }

      // Extraer el token de las cookies
      const { authToken } = req.cookies;
      if (!authToken) {
        return res.status(401).json({ message: "Token not provided, unauthorized" });
      }

      // Verificar el token
      const decoded = jwt.verify(authToken, config.jwt.secret);
      req.user = decoded; // Almacenar los datos del usuario en el request

      // Verificar si el tipo de usuario tiene acceso (si se especifican roles permitidos)
      if (allowedUserTypes.length > 0 && !allowedUserTypes.includes(decoded.userType)) {
        return res.status(403).json({ message: "Access denied: insufficient permissions" });
      }

      next(); // Continuar al siguiente middleware o controlador
    } catch (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(403).json({ message: "Token expired, please log in again" });
      }
      if (err.name === "JsonWebTokenError") {
        return res.status(403).json({ message: "Invalid token" });
      }

      return res.status(500).json({ message: "Internal server error", error: err.message });
    }
  };
};
