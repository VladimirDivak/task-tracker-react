import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController';
// Optional: import validation middleware if you were to add it
// import { validateRegistration, validateLogin } from '../middleware/validators'; // Example

const router = Router();

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', /* validateRegistration, */ registerUser);

// @route   POST api/auth/login
// @desc    Login user / Authenticate user & get token
// @access  Public
router.post('/login', /* validateLogin, */ loginUser);

export default router;
