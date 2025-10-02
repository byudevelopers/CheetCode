import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import crypto from "crypto";

import { AuthenticatedRequest, authenticateUser } from '../middleware/auth.ts';
import { validateSchema } from "../middleware/validate.ts";
import { RegisterUserSchema, BaseUserSchema, RegisterUserType } from '../models/user.ts';
import { UserTableType } from '../models/table.ts';

import { conn } from "../utils/db.ts";

import { generateToken } from '../utils/jwt';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

const router = express.Router();

// One month in milliseconds
const SESSION_EXPIRATION = 1000 * 60 * 60 * 24 * 30;

function generateSessionToken(length = 32) {
  return crypto.randomBytes(length).toString('base64url');
}

const QUERY_NEW_SESSION_ID = `
INSERT INTO User_Session 
(UserID, SessionID, Created_At, Expires_At) 
VALUES(?, ?, ?, ?) 
ON DUPLICATE KEY UPDATE 
SessionID = VALUES(SessionID), 
Created_At = VALUES(Created_At), 
Expires_At = VALUES(Expires_At);`

// Register route
router.post('/register', validateSchema(RegisterUserSchema), async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    const QUERY_USER_EXISTS = `SELECT EXISTS (SELECT 1 FROM Users WHERE Email = ?) as userExists`;


    const [queryRes, any] = await conn.execute<boolean & RowDataPacket[]>(QUERY_USER_EXISTS, [email]);

    const userExists = queryRes[0]?.userExists

    if (userExists) {
      res.status(400).json({
        success: false,
        message: "User already exist"
      })
      return;
    }

    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const QUERY_INSERT_USER = `INSERT INTO Users (Name, Email, Password)
    VALUES(?, ?, ?);
    `
    const [newUserResults] = await conn.execute<ResultSetHeader>(QUERY_INSERT_USER, [name, email, passwordHash])

    const userID = newUserResults.insertId;
    const sessionToken = generateSessionToken();

    await conn.execute<ResultSetHeader>(QUERY_NEW_SESSION_ID, [userID, sessionToken, Date.now(), Date.now() + SESSION_EXPIRATION]);

    const jwtToken = generateToken({ name: name, sessionToken: sessionToken });

    res.json({
      success: true,
      token: jwtToken
    })

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Login route
router.post('/login', validateSchema(BaseUserSchema), async (req: Request, res: Response) => {

  try {

    const { email, password } = req.body;


    // Find user
    const QUERY_FIND_USER = `
    SELECT UserID, Name, Email, Password FROM Users WHERE Email = ?;
    `

    const [findUserResult] = await conn.execute<RowDataPacket[]>(QUERY_FIND_USER, [email]);

    if (findUserResult.length == 0) {
      res.status(400).json({
        success: false,
        message: "Invalid credentials"
      })
    }


    // Force schema
    const user: UserTableType = findUserResult[0] as UserTableType;

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.Password);
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
      return;
    }


    const sessionToken = generateSessionToken();

    await conn.execute(QUERY_NEW_SESSION_ID, [user.UserID, sessionToken, Date.now(), Date.now() + SESSION_EXPIRATION]);


    // Generate JWT token
    const jwtToken = generateToken({
      name: user.Name,
      sessionToken: sessionToken,
    });

    res.json({
      success: true,
      token: jwtToken
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});


export default router;
