const createError = require('http-errors');
const { User } = require('../models/index');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path')

const signup = async (req, res, next) => {
    try {
        const schema = {
            name: req.body.name,
            email: req.body.email,
            username: req.body.username,
            password: req.body.password
        };

        const vali = User.validate(schema);
        if (vali.error) {
            return next(createError(400, vali.error.message));
        }

        const user = new User(schema);

        // Check if user already exists
        user.isExist((check) => {
            if (check.check) {
                return res.status(400).json({ status: false, message: check.message });
            }

            // Save new user
            user.save((status) => {
                if (status.status) {
                    res.status(201).json({
                        status: true,
                        message: "User has been created successfully"
                    });
                } else {
                    return next(createError(400, status.message));
                }
            });
        });
    } catch (err) {
        return next(createError(500, err.message));
    }
};


const login = async (req, res, next) => {
    try {
        const userData = req.body;
        User.login(userData, async (check) => {
            if (!check.status) {
                return res.status(401).json({ status: false, message: result.message });
            }

            const filePath = path.join(__dirname, '../configurations/tok.key');
            const secretKey = fs.readFileSync(filePath)
            const token = jwt.sign(
                { _id_user: check.user._id },
                secretKey,
                { expiresIn: '1h' }
            );
            res.status(200).json({
                status: true,
                result: check.user._id,
                token: token
            });
        })

    } catch (err) {
        return next(createError(500, err.message));
    }
};



module.exports = { signup, login };





