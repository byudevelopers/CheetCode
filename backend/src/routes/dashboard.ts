import express, { Request, Response } from 'express';
import { AuthenticatedRequest, authenticateUser } from '../middleware/auth';
import {conn} from "@/utils/db.ts";
import {RowDataPacket} from "mysql2/index";


const dashRoutes = express.Router();


interface Problem extends RowDataPacket {
    id: number;
    type: string;
    title: string;
    url: string;
    difficulty: string;
}


// User will pass in their jwt token as a parameter called token

// TODO: Make sure to validate schema 
dashRoutes.post("/dashboard", authenticateUser, async (req: AuthenticatedRequest, res: Response) =>{
// dashRoutes.post("/dashboard", async (req: AuthenticatedRequest, res: Response) =>{


    const userID = req.body.userID;
    const getProblemIDsForUser = `
    SELECT * FROM USER_PROBLEM_TABLE
    WHERE UserID = ?
    `;

    const getAllProblems = `SELECT * FROM PROBLEM_TABLE`;


    const [userCompletedProblems] = await conn.execute<RowDataPacket[]>(getProblemIDsForUser, [userID]);
    const completedIDsSet = new Set<number>(
        userCompletedProblems.length > 0
            ? JSON.parse(userCompletedProblems[0].ProblemsCompletedID)
            : []
    );
    const [allProblems] = await conn.execute<Problem[]>(getAllProblems);

    const problemsWithStatus = allProblems.map(problem => ({
        ...problem,
        completed: completedIDsSet.has(problem.id)
    }));

    res.json(problemsWithStatus);
    // res.json("hi")


/*
const getAllProblems = query;

const userdoneproblems, allproblems = execute queries

const output = merge(userdoneproblems, allproblems);

res.send(output);
return;
*/

});

export default dashRoutes;