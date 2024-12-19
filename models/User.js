const dbConnect = require('../configurations/db');
const { hashSync, compareSync } = require('bcryptjs');
const createError = require('http-errors');
const { schema } = require('../validators/ValidaUser');

class User {

    constructor(userData) {
        this.userData = userData;
    }

    async save(cb) {
        dbConnect('User', async (db) => {
            try {
                const passCrypt = hashSync(this.userData.password, 12);
                this.userData.password = passCrypt;

                const result = await db.insertOne(this.userData);
                cb({
                    status: true,
                    _user_id: result.insertedId
                });
            } catch (err) {
                cb({
                    status: false,
                    message: err.message
                });
            }
        });
    }

    async isExist(cb) {
        dbConnect('User', async (db) => {
            try {
                const user = await db.findOne({
                    '$or': [
                        { username: this.userData.username },
                        { email: this.userData.email }
                    ]
                });

                if (!user) {
                    cb({
                        check: false
                    });
                } else {
                    if (user.email === this.userData.email) {
                        cb({
                            check: true,
                            message: 'The email is already used'
                        });
                    } else if (user.username === this.userData.username) {
                        cb({
                            check: true,
                            message: 'The username is already used'
                        });
                    }
                }
            } catch (err) {
                cb({
                    status: false,
                    message: err.message
                });
            }
        });
    }

    static validate(userData) {
        try {
            const validationResult = schema.ValidUsers1.validate(userData);
            return validationResult;
        } catch (err) {
            return false;
        }
    }

    static async login(userData, cb) {
        try {
            dbConnect('User', async (db) => {
                const user = await db.findOne({ username: userData.username });

                if (user) {
                    if (!compareSync(userData.password, user.password)) {
                        cb({
                            status: false,
                            message: 'Invalid password'
                        });
                    } else {
                        cb({
                            status: true,
                            user: user
                        });
                    }
                } else {
                    cb({
                        status: false,
                        message: 'User not found'
                    });
                }
            });
        } catch (err) {
            console.error("Error:", err);
            cb({
                status: false,
                message: 'An error occurred'
            });
        }
    }
}

module.exports = User;
