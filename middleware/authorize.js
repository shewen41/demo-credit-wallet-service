const jwt = require('jsonwebtoken');
const config = require('../config');


function authorize(req, res, next) {
    try {
        const bearerHeader = req.headers['authorization'];
        if (typeof bearerHeader !== undefined) {
            const bearer = bearerHeader.split(" ");
            const bearerToken = bearer[1];
            req.token = bearerToken;
            jwt.verify(req.token, config.key, (err, data) => {
                if (err) {
                    return res.status(403).send({
                        message: 'Unathorized'
                    });
                } else {
                    req.email = data.email;
                }
            });
        } else {
            return res.status(403).send({
                message: 'Unathourized'
            });
        }
    } catch (error) {
        return res.status(403).send({
            message: 'missing header'
        });
    }
    next();
}

module.exports = {
    authorize
}