const jwt = require('jsonwebtoken');
require('dotenv').config();
const jwtSecret = process.env.JWT_SECRET;

const verifyToken = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Token no proporcionado' });
    }

    jwt.verify(token, jwtSecret, (err, decoded) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ error: 'Token expirado, inicie sesión nuevamente' });
            } else if (err.name === 'JsonWebTokenError') {
                return res.status(401).json({ error: 'Token inválido' });
            } else {
                return res.status(500).json({ error: 'Error al verificar el token' });
            }
        }

        req.userId = decoded.userId;
        next();
    });
};

const generateToken = (userId) => {
    const tokenExpiration = '2h'; // 1 día, puedes ajustar este valor según tus necesidades
    return jwt.sign({ userId }, jwtSecret, { expiresIn: tokenExpiration });
};

module.exports = {
    verifyToken,
    generateToken
};