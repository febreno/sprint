const jwt = require('jsonwebtoken');
const config = require('../config');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: 'Token not provided' });
  }

  const parts = authHeader.split(' ');

  if (parts.length !== 2) {
    return res.status(401).json({ message: 'Token error' });
  }

  const [scheme, token] = parts;

  if (!/^Bearer$/i.test(scheme)) {
    return res.status(401).json({ message: 'Token malformatted' });
  }

  try {
    const decoded = jwt.verify(token, config.secret);
    req.userId = decoded.id;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token invalid' });
  }
}

module.exports = authMiddleware;
