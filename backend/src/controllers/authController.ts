import { Request, Response } from 'express';
import bcrypt from 'bcryptjs'; // Corrected import
import jwt from 'jsonwebtoken';
import User from '../models/User'; // Assuming User model path
// import { validationResult } from 'express-validator'; // For later

// Define JWT_SECRET in .env, e.g., JWT_SECRET=yoursupersecretkey
const JWT_SECRET = process.env.JWT_SECRET || 'defaultsecret'; // Fallback for now, ensure it's in .env
const JWT_EXPIRATION = '30d';

export const registerUser = async (req: Request, res: Response) => {
  // const errors = validationResult(req); // For later
  // if (!errors.isEmpty()) {
  //   return res.status(400).json({ errors: errors.array() });
  // }

  const { username, email, password } = req.body;

  try {
    // Basic validation
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Please provide username, email, and password.' });
    }
    
    // Check if user exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'User already exists with this email or username.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    user = new User({
      username,
      email,
      password: hashedPassword, // Save hashed password
    });

    await user.save();

    // Generate JWT
    const payload = {
      user: {
        id: user.id, // or user._id
      },
    };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: JWT_EXPIRATION },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({
          token,
          user: { // Return some user info, excluding password
            id: user.id,
            username: user.username,
            email: user.email,
          }
        });
      }
    );
  } catch (error) {
    console.error('Error in registerUser:', error);
    if (error instanceof Error && error.message.includes('jwt')) { // Catch JWT specific errors explicitly if needed
        return res.status(500).json({ message: 'Error generating token.' });
    }
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password.' });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials.' }); // Generic message
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials.' }); // Generic message
    }

    // Generate JWT
    const payload = {
      user: {
        id: user.id, // or user._id
      },
    };

    jwt.sign(
      payload,
      JWT_SECRET, // Use the constant defined at the top
      { expiresIn: JWT_EXPIRATION }, // Use the constant defined at the top
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          token,
          user: { // Return some user info, excluding password
            id: user.id,
            username: user.username,
            email: user.email,
          }
        });
      }
    );
  } catch (error) {
    console.error('Error in loginUser:', error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};
