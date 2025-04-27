import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

/**
 * Middleware to protect routes by verifying JWT token.
 * Expects Authorization header: "Bearer <token>".
 */
export default function authMiddleware(req, res, next) {
  const authHeader = req.headers['authorization'];
  // Extract token portion after "Bearer "
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }
    // Attach user ID for downstream handlers
    req.userId = decoded.id;
    next();
  });
}
