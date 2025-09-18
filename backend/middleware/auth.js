import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  // Permitir preflight CORS
  if (req.method === "OPTIONS") return next();

  const auth = req.headers.authorization || req.headers.Authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;

  if (!token) return res.status(401).json({ message: "Token faltante" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // decoded: { id, role, iat, exp }
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch {
    return res.status(401).json({ message: "Token inválido" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Solo admin" });
  }
  next();
};
