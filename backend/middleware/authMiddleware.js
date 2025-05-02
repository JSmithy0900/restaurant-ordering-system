const jwt = require('jsonwebtoken');

module.exports.verifyToken = (req, res, next) => {
  
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access denied, token missing' });
  }

  // Verify token using the secret
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: 'Token is invalid or expired' });
    }
    // Attach the decoded user information to req.user
    req.user = decoded;
    next();
  });
};

module.exports.verifyAdmin = (req, res, next) => {
  // Use verifyToken first to ensure req.user exists
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ error: 'Access denied, admin only' });
  }
};

module.exports.verifyStaffOrAdmin = (req, res, next) => {
  const user = req.user;
  if (user && (user.role === 'staff' || user.role === 'admin')) {
    next();
  } else {
    res.status(403).json({ error: 'Access denied. Staff or admin only.' });
  }
};
