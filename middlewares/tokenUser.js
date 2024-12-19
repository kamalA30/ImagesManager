const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const { readFileSync } = require('fs');
const path = require('path');


// Read the secret key once and store it in memory

module.exports = (req, res, next) => {

    const authHeader = req.get('Authorization');

    if (!authHeader) {
        return next(crratError(401, 'No token provided'))
    }
    const secret = readFileSync(path.join(__dirname, '../configurations/tok.key'), 'utf8');

    const token = authHeader.split(' ')[1];


    try {
        const jd = jwt.verify(token, secret)
        req._id_user = jd._id_user
        console.log(req._id_user)
        next()

    } catch (err) {
        return next(createError(403, 'Invalid Token'))

    }

};
