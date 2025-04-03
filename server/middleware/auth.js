// server/middleware/auth.js
const jwt = require('jsonwebtoken');

// Use an environment variable for the secret in production!
const secretKey = process.env.JWT_SECRET || 'your_secret_key';

// Function to generate a token with a payload and optional expiration time.
function generateToken(payload, expiresIn = '1h') {
  return jwt.sign(payload, secretKey, { expiresIn });
}

// Function to verify a token; returns the decoded payload if valid, or throws an error if not.
function verifyToken(token) {
  return jwt.verify(token, secretKey);
}

// Express middleware to authenticate incoming requests with a Bearer token.
function authenticateToken(req, res, next) {
  // The token is usually provided in the Authorization header in the format "Bearer <token>"
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    // No token provided
    return res.status(401).json({ error: 'No token provided' });
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      // Token is invalid or expired
      return res.status(403).json({ error: 'Invalid token' });
    }
    // Attach user info to request (e.g., role, email, etc.)
    req.user = user;
    next();
  });
}

module.exports = {
  generateToken,
  verifyToken,
  authenticateToken,
};
