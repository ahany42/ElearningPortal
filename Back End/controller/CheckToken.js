const jwt = require('jsonwebtoken');
const { Secret_Key } = require('../../env');

const checkToken = (req, res) => {
    if (!req.cookies)
        return res.status(200).json({ valid: false, error: 'Token is required'});

    const token = req.cookies.token;

    if (!token) {
        return res.status(200).json({ valid: false, error: 'Token is required'});
    }

    try {
        jwt.verify(token, Secret_Key);
        return res.status(201).json({ valid: true });
    } catch (err) {
        return res.status(200).json({ valid: false, error: err.name });
    }
};

module.exports = checkToken;
// app.get('/api/check-token', checkToken);
