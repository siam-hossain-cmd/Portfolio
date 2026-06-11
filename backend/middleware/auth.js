const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
    // Try to get token from header (x-auth-token or Authorization)
    let token = req.header('x-auth-token') || req.header('Authorization');
    
    if (token && token.startsWith('Bearer ')) {
        token = token.slice(7).trim();
    }

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded; // Contains id and role
        next();
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

const authorize = (allowedRoles = []) => {
    return (req, res, next) => {
        if (!req.admin) {
            return res.status(401).json({ message: 'Not authenticated' });
        }
        
        const { role } = req.admin;
        if (!allowedRoles.includes(role)) {
            return res.status(403).json({ message: `Access denied: role '${role}' does not have permission` });
        }
        
        next();
    };
};

module.exports = { auth, authorize };
