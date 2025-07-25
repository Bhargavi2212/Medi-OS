import { Request, Response, NextFunction } from 'express';

interface FailedAttempt {
  count: number;
  lastAttempt: number;
  lockedUntil?: number;
}

interface AccountLockoutStore {
  [key: string]: FailedAttempt;
}

// In-memory store for failed login attempts (use Redis in production)
const failedAttempts: AccountLockoutStore = {};

interface LockoutConfig {
  maxAttempts: number;
  lockoutDuration: number; // in milliseconds
  windowMs: number; // time window for counting attempts
}

const defaultConfig: LockoutConfig = {
  maxAttempts: 5,
  lockoutDuration: 15 * 60 * 1000, // 15 minutes
  windowMs: 15 * 60 * 1000 // 15 minutes
};

export const createAccountLockout = (config: LockoutConfig = defaultConfig) => {
  return (req: Request, res: Response, next: NextFunction): void => {
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
      const remainingTime = Math.ceil((failedAttempts[key].lockedUntil! - now) / 1000);
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

export const recordFailedAttempt = (username: string, config: LockoutConfig = defaultConfig) => {
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

export const recordSuccessfulAttempt = (username: string) => {
  const key = `login:${username}`;
  delete failedAttempts[key];
};

export const isAccountLocked = (username: string): boolean => {
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

export const getRemainingLockoutTime = (username: string): number => {
  const key = `login:${username}`;
  const now = Date.now();

  if (!failedAttempts[key] || !failedAttempts[key].lockedUntil) {
    return 0;
  }

  const remaining = failedAttempts[key].lockedUntil! - now;
  return remaining > 0 ? Math.ceil(remaining / 1000) : 0;
}; 