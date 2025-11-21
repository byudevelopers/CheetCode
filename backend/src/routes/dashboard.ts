import express, { Request, Response } from 'express';
import { AuthenticatedRequest, authenticateUser } from '../middleware/auth';
import { conn } from "@/utils/db.ts";
import { RowDataPacket } from "mysql2/index";
import { createEmptyCard } from 'ts-fsrs';

const dashRoutes = express.Router();

const getAllProblems = `SELECT * FROM PROBLEM_TABLE`;

interface Problem extends RowDataPacket {
    id: number;
    type: string;
    title: string;
    url: string;
    difficulty: string;
}


const getProblemIDsForUser = `
SELECT ProblemsCompletedID FROM USER_PROBLEM_TABLE
WHERE UserID = ?
`;

// User will pass in their jwt token as a parameter called token

// TODO: Make sure to validate schema 
dashRoutes.post("/dashboard", authenticateUser, async (req: AuthenticatedRequest, res: Response) => {

    const userID = req.body.userID as number;
    const problemID = req.body.problemID as number;


    if (problemID === undefined) {
        res.json({ success: false, message: "Problem ID is required" });
        return;
    }

    try {
        const [rows] = await conn.execute<RowDataPacket[]>(getProblemIDsForUser, [userID]);

        let problemDict = new Map<number, boolean>();
        if (rows.length == 0) {

            const [allProblems] = await conn.execute<Problem[]>(getAllProblems);

            const allIDS = allProblems.map((curProblem) => curProblem.id);
            allIDS.forEach((id) => { problemDict.set(id, false) });
        }
        else {
            problemDict = new Map<number, boolean>(Object.entries(rows[0].ProblemsCompletedID).map(([key, value]) => [parseInt(key), value as boolean]));
        }

        const curValue = problemDict.get(problemID);
        problemDict.set(problemID, !curValue);


        const updateProblemDoneForUser =
            `
    INSERT INTO USER_PROBLEM_TABLE
    (UserID, ProblemsCompletedID)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE
    ProblemsCompletedID = ?;
    `;

        const createCard =
            `
    INSERT INTO SR_CARD
    (ProblemID, UserID, Card, NextReview)
    VALUES(?, ?, ?, ?)
    `;

        const deleteCard =
            `
        DELETE FROM SR_CARD
        WHERE ProblemID = ? AND UserID = ?
            `;

        const serializedMap = JSON.stringify(Object.fromEntries(problemDict));
        await conn.execute<RowDataPacket[]>(updateProblemDoneForUser, [userID, serializedMap, serializedMap]);
        if (problemDict.get(problemID)) {
            const curDateTime = new Date();

            const card = createEmptyCard(curDateTime);

            // Mysql expects the time to be in standard utc
            const serializedTime = curDateTime.toISOString().replace("T", " ").replace("Z", '');
            await conn.execute(createCard, [problemID, userID, JSON.stringify(card), serializedTime])

        }
        else {
            await conn.execute(deleteCard, [problemID, userID]);
        }

        res.json({ success: true });
    }
    catch (err) {
        res.status(500).json({ success: false });
        console.error(err);
    }

    return;

});


dashRoutes.get('/dashboard', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {

    const userID = req.body.userID;

    const [userCompletedProblems] = await conn.execute<RowDataPacket[]>(getProblemIDsForUser, [userID]);

    const completedIDsSet = new Set<number>();

    if (userCompletedProblems[0]) {
        const problemMap = new Map<number, boolean>(Object.entries(userCompletedProblems[0].ProblemsCompletedID).map((entry) => [parseInt(entry[0]), entry[1] as boolean]));

        for (const [key, value] of problemMap) {
            if (value) {
                completedIDsSet.add(key);
            }
        }
    }


    const [allProblems] = await conn.execute<Problem[]>(getAllProblems);

    const problemsWithStatus = allProblems.map(problem => ({
        ...problem,
        completed: completedIDsSet.has(problem.id)
    }));

    res.json(problemsWithStatus);
    return

});

export default dashRoutes;