import express, { Request, Response } from 'express';
import { AuthenticatedRequest, authenticateUser } from '../middleware/auth';



const dashRoutes = express.Router();




// User will pass in their jwt token as a parameter called token

// TODO: Make sure to validate schema 
dashRoutes.post("/dashboard", authenticateUser, (req: AuthenticatedRequest, res: Response) =>{

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

export default dashRoutes;