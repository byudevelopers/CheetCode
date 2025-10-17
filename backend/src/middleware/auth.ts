import { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt.ts';
import { conn } from "../utils/db.ts";
import { RowDataPacket } from 'mysql2';
import { UserSessionTableType } from '@/models/table.ts';

export interface AuthenticatedRequest extends Request {
  userID?: string;
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

    const token = authHeader.substring(7); 

    const decoded = verifyToken(token);

    // // Get user data from database
    const findUserIDBySessionToken = `
    SELECT * from USER_SESSION_TABLE
    WHERE SessionID = ? 
    `
    const [userSessionEntry] = (await conn.execute<RowDataPacket[]>(findUserIDBySessionToken, [decoded.sessionToken]))[0];

    if (userSessionEntry.length == 0) {
      res.status(401).json({ success: false, message: 'User not found' });
      return;
    }
    const { UserID, Expires_At } = (userSessionEntry as UserSessionTableType);


    if (Date.now() > Expires_At) {
      const deleteSessionToken = `
      DELETE * from USER_SESSION_TABLE
      WHERE SessionID = ?
      `
      await conn.execute(deleteSessionToken, [decoded.sessionToken]);
      res.status(401).json({
        sucess: false, message: 'Session token expired'
      });
      return;
    }

    req.body.userID = UserID;

    next();
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
