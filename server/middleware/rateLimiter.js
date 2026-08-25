import rateLimit from 'express-rate-limit';

export const attemptLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Generous limit for game attempts
  message: { error: 'Too many attempt starts from this IP, please try again shortly.' }
});

export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // High throughput for game assets & polling
  message: { error: 'Too many requests from this IP, please try again in a few minutes.' }
});
