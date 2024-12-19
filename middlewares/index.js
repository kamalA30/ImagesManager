const express = require('express');
const tok = require('./tokenUser');

module.exports = {
    global: (app) => {
        // Middleware to process requests globally (e.g., logging, CORS)
        app.use((req, res, next) => {
            // Add global logic if needed (e.g., logging, CORS handling)
            next();
        });

        // Middleware to parse JSON bodies
        app.use(express.json());
    },

    // Token middleware (for routes requiring authentication)
    tokenUser: tok
};
