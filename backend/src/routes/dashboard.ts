import express, { Request, Response } from 'express';
import { authenticateUser } from '../middleware/auth';



const router = express.Router();




// User will pass in their jwt token as a parameter called token

// TODO: Make sure to validate schema 
router.post("/dashboard", authenticateUser, (req: Request, res: Response) =>{

const userID = req.body.userID;

const getProblemIDsForUser = `
SELECT * FROM USER_PROBLEM_TABLE
WHERE UserID = ?
`;


/*
const getAllProblems = query;

const userdoneproblems, allproblems = execute queries

const output = merge(userdoneproblems, allproblems);

res.send(output);
return;
*/

});

