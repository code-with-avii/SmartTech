import express from 'express';
import { verifyEmail, resendVerificationEmail, requestPasswordReset, resetPassword } from '../controllers/emailController.js';

const router = express.Router();

router.get('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);
router.post('/request-password-reset', requestPasswordReset);
router.post('/reset-password', resetPassword);

export default router;
