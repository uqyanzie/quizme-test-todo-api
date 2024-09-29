const jwt = require('jsonwebtoken');
const config = require('../config/auth.config.js');
const db = require('../models/index.js');
const User = db.user;

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
        return res.status(403).send({ message: 'No token provided!' });
    }

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
            console.log(err);
            return res.status(401).send({ message: 'Unauthorized!' });
        }
        req.user = decoded;
        
        next();
    });
};

const authJwt = {
    verifyToken
};

module.exports = authJwt;

