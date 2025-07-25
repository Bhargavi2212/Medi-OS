"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRemainingLockoutTime = exports.isAccountLocked = exports.recordSuccessfulAttempt = exports.recordFailedAttempt = exports.createAccountLockout = void 0;
// In-memory store for failed login attempts (use Redis in production)
const failedAttempts = {};
const defaultConfig = {
    maxAttempts: 5,
    lockoutDuration: 15 * 60 * 1000, // 15 minutes
    windowMs: 15 * 60 * 1000 // 15 minutes
};
const createAccountLockout = (config = defaultConfig) => {
    return (req, res, next) => {
        const { username } = req.body;
        if (!username) {
            next();
            return;
        }
        const key = `login:${username}`;
        const now = Date.now();
        // Clean up old attempts outside the window
        if (failedAttempts[key] && (now - failedAttempts[key].lastAttempt) > config.windowMs) {
            delete failedAttempts[key];
        }
        // Check if account is locked
        if (failedAttempts[key] && failedAttempts[key].lockedUntil && now < failedAttempts[key].lockedUntil) {
            const remainingTime = Math.ceil((failedAttempts[key].lockedUntil - now) / 1000);
            res.status(423).json({
                success: false,
                message: `Account is temporarily locked due to too many failed attempts. Please try again in ${remainingTime} seconds.`
            });
            return;
        }
        // Reset lockout if window has passed
        if (failedAttempts[key] && failedAttempts[key].lockedUntil && now >= failedAttempts[key].lockedUntil) {
            delete failedAttempts[key];
        }
        next();
    };
};
exports.createAccountLockout = createAccountLockout;
const recordFailedAttempt = (username, config = defaultConfig) => {
    const key = `login:${username}`;
    const now = Date.now();
    if (!failedAttempts[key]) {
        failedAttempts[key] = {
            count: 0,
            lastAttempt: now
        };
    }
    failedAttempts[key].count++;
    failedAttempts[key].lastAttempt = now;
    // Lock account if max attempts reached
    if (failedAttempts[key].count >= config.maxAttempts) {
        failedAttempts[key].lockedUntil = now + config.lockoutDuration;
    }
};
exports.recordFailedAttempt = recordFailedAttempt;
const recordSuccessfulAttempt = (username) => {
    const key = `login:${username}`;
    delete failedAttempts[key];
};
exports.recordSuccessfulAttempt = recordSuccessfulAttempt;
const isAccountLocked = (username) => {
    const key = `login:${username}`;
    const now = Date.now();
    if (!failedAttempts[key]) {
        return false;
    }
    // Check if lockout period has passed
    if (failedAttempts[key].lockedUntil && now < failedAttempts[key].lockedUntil) {
        return true;
    }
    // Clean up if lockout period has passed
    if (failedAttempts[key].lockedUntil && now >= failedAttempts[key].lockedUntil) {
        delete failedAttempts[key];
    }
    return false;
};
exports.isAccountLocked = isAccountLocked;
const getRemainingLockoutTime = (username) => {
    const key = `login:${username}`;
    const now = Date.now();
    if (!failedAttempts[key] || !failedAttempts[key].lockedUntil) {
        return 0;
    }
    const remaining = failedAttempts[key].lockedUntil - now;
    return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
};
exports.getRemainingLockoutTime = getRemainingLockoutTime;
