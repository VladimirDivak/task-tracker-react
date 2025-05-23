import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// This interface extension might be needed.
// Create a file e.g., backend/src/types/express/index.d.ts
// and add:
// declare global {
//   namespace Express {
//     interface Request {
//       user?: { id: string }; // Adjust based on your JWT payload
//     }
//   }
// }
// Make sure your tsconfig.json includes this types directory or file.
// For example, "typeRoots": ["./node_modules/@types", "./src/types"],
// or ensure "include": ["src"] covers it.

interface JwtPayload {
  user: {
    id: string;
  };
  // Add other properties from your JWT payload if any
}

export const protect = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header('Authorization');
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret') as JwtPayload;
    
    // Check if decoded payload has the expected structure
    if (decoded && decoded.user && decoded.user.id) {
      req.user = decoded.user; // Attach user with id to request object
      next();
    } else {
      // This case might happen if the JWT structure is not as expected
      return res.status(401).json({ message: 'Token is not valid (payload structure error).' });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    // Differentiate between expired token and other verification errors if needed
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: 'Token expired.' });
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: 'Token is not valid (verification failed).' });
    }
    return res.status(401).json({ message: 'Token is not valid.' });
  }
};
