const setRateLimit = require('express-rate-limit');

const rateLimiter = setRateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10,
    message: {
        status: 429,
        message: "Too many requests, please try again later."
    },
    headers: true
});

module.exports = rateLimiter;