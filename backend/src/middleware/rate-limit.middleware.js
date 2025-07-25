"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strictRateLimiter = exports.generalRateLimiter = exports.authRateLimiter = exports.createRateLimiter = void 0;
// In-memory store for rate limiting (use Redis in production)
const rateLimitStore = {};
const createRateLimiter = (config) => {
    return (req, res, next) => {
        const key = req.ip || 'unknown';
        const now = Date.now();
        const windowStart = now - config.windowMs;
        // Clean up old entries
        if (rateLimitStore[key] && rateLimitStore[key].resetTime < now) {
            delete rateLimitStore[key];
        }
        // Initialize or get current rate limit data
        if (!rateLimitStore[key]) {
            rateLimitStore[key] = {
                count: 0,
                resetTime: now + config.windowMs
            };
        }
        // Check if rate limit exceeded
        if (rateLimitStore[key].count >= config.maxRequests) {
            res.status(429).json({
                success: false,
                message: config.message || 'Too many requests, please try again later',
                retryAfter: Math.ceil((rateLimitStore[key].resetTime - now) / 1000)
            });
            return;
        }
        // Increment counter
        rateLimitStore[key].count++;
        // Add rate limit headers
        res.setHeader('X-RateLimit-Limit', config.maxRequests);
        res.setHeader('X-RateLimit-Remaining', config.maxRequests - rateLimitStore[key].count);
        res.setHeader('X-RateLimit-Reset', rateLimitStore[key].resetTime);
        next();
    };
};
exports.createRateLimiter = createRateLimiter;
// Specific rate limiters for different endpoints
exports.authRateLimiter = (0, exports.createRateLimiter)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    maxRequests: 5, // 5 requests per 15 minutes
    message: 'Too many authentication attempts, please try again later'
});
exports.generalRateLimiter = (0, exports.createRateLimiter)({
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 100, // 100 requests per minute
    message: 'Too many requests, please try again later'
});
exports.strictRateLimiter = (0, exports.createRateLimiter)({
    windowMs: 60 * 60 * 1000, // 1 hour
    maxRequests: 10, // 10 requests per hour
    message: 'Rate limit exceeded, please try again later'
});
