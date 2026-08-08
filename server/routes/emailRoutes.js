import express from 'express';
import { verifyEmail, resendVerificationEmail, requestPasswordReset, resetPassword } from '../controllers/emailController.js';
import { authLimiter, passwordResetLimiter } from '../middleware/rateLimiters.js';

const router = express.Router();

router.get('/verify-email', authLimiter, verifyEmail);
router.post('/resend-verification', authLimiter, resendVerificationEmail);
router.post('/request-password-reset', passwordResetLimiter, requestPasswordReset);
router.post('/reset-password', passwordResetLimiter, resetPassword);

export default router;
