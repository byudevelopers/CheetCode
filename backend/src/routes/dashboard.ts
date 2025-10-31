import express, { Request, Response } from 'express';
import { AuthenticatedRequest, authenticateUser } from '../middleware/auth';
import { conn } from "@/utils/db.ts";
import { RowDataPacket } from "mysql2/index";


const dashRoutes = express.Router();


interface Problem extends RowDataPacket {
    id: number;
    type: string;
    title: string;
    url: string;
    difficulty: string;
}


const getProblemIDsForUser = `
SELECT * FROM USER_PROBLEM_TABLE
WHERE UserID = ?
`;

// User will pass in their jwt token as a parameter called token

// TODO: Make sure to validate schema 
dashRoutes.post("/dashboard", authenticateUser, async (req: AuthenticatedRequest, res: Response) => {

    const userID = req.body.userID;
    const problemID = req.body.problemID;


    if (problemID === undefined) {
        res.json({ success: false, message: "Problem ID is required" });
        return;
    }

    const [rows] = await conn.execute<RowDataPacket[]>(getProblemIDsForUser, [userID]);
    const problemDict = JSON.parse(rows[0].ProblemsCompletedID);

    problemDict[problemID] = !problemDict[problemID]


    const updateProblemDoneForUser =
        `
    UPDATE USER_PROBLEM_TABLE
    SET ProblemsCompletedID = ?
    WHERE UserID = ?    
    `;

    await conn.execute<RowDataPacket[]>(updateProblemDoneForUser, [JSON.stringify(problemDict), userID]);


    res.json({ success: true });
    return;

});


dashRoutes.get('/dashboard', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {

    const userID = req.body.userID;

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
    return

});

export default dashRoutes;