import { Request, Response, NextFunction } from 'express';
import { User } from '../models/user.ts';
import { verifyToken } from '../utils/jwt.ts';

export interface AuthenticatedRequest extends Request {
  user?: {
    _id: string;
    username: string;
    createdAt: Date;
  };
}

export const authenticateUser = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    // const authHeader = req.headers.authorization;

    // if (!authHeader || !authHeader.startsWith('Bearer ')) {
    //   res.status(401).json({ success: false, message: 'Not authenticated' });
    //   return;
    // }

    // const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    // // Verify JWT token
    // const decoded = verifyToken(token);

    // // Get user data from database
    // const user = await User.findById(decoded.userId).select('-passwordHash');

    // if (!user) {
    //   res.status(401).json({ success: false, message: 'User not found' });
    //   return;
    // }

    // req.user = {
    //   _id: user._id?.toString() as string,
    //   username: user.username,
    //   createdAt: user.createdAt
    // };

    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' });
  }
};
