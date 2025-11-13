import express, { Request, Response } from 'express';
import { AuthenticatedRequest, authenticateUser } from '../middleware/auth';
import { conn } from "@/utils/db.ts";
import { type Card } from 'ts-fsrs';
import { QueryResult, RowDataPacket } from "mysql2/index";
import { ProblemTableType } from '@/models/table';

const dashRoutes = express.Router();


export interface Example {
    input: string;
    output: string;
}

export interface Problem {
    title: string;          // Problem title
    desc: string;           // Problem description
    examples: Example[];    // Array of examples
}

interface ProblemTableResult extends ProblemTableType, RowDataPacket { };

interface SR_Card extends RowDataPacket {
    Card: Card;
    ProblemID: number
}


// User will pass in their jwt token as a parameter called token

// TODO: Make sure to validate schema
dashRoutes.post("/practice", authenticateUser, async (req: AuthenticatedRequest, res: Response) => {

    //TODO: Receive the user selection of the problem (id and confidence level)

});


dashRoutes.get('/practice', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {
    // let questions: { [key: string]: string } = {};
    //
    // res.json({ success: true , message: "hello", desc: "This is a really hard dynamic programming question that you cannot solve",
    //     title : "Very difficult leetcode question", question1: "What type of question is this?", question2: "Time complexity", question3: "Space complexity"});

    const userID = req.body.userID;
    const getMostRecentProblem =
        `
    SELECT ProblemID, Card
    FROM SR_CARD 
    WHERE UserID = ?
    ORDER BY NextReview DESC
    LIMIT 1;
    `
    /*
    CREATE TABLE IF NOT EXISTS PROBLEM_TABLE (
    id INT NOT NULL PRIMARY KEY,
    type VARCHAR(100) NOT NULL,
    title VARCHAR(200) NOT NULL,
    url VARCHAR(300) NOT NULL,
    difficulty VARCHAR(10) NOT NULL
    */


    const getProblemByID =
        `
    SELECT  type, title, url, difficulty FROM PROBLEM_TABLE
    WHERE id = ?;
    `;

    try {
        const result = (await conn.execute<SR_Card[]>(getMostRecentProblem, [userID]))[0];

        if (result.length == 1) {
            const card = result[0] as SR_Card;
            const [problemData] = (await conn.execute<ProblemTableResult[]>(getProblemByID, [card.ProblemID]))[0];


            const parsedProblem: Problem = {
                title: problemData.title,
                desc: "Problem Description",
                examples: [
                    { input: "1, 2, 3", output: "1, 2" }
                ]
            }

            res.json(parsedProblem);
            return;

        }
        else {
            res.json({ success: false, msg: "You have no problems to review" });
            return;
        }
    }
    catch (err) {

        res.status(500).json({ success: false });
        console.error(err);
    }

    return
});

export default dashRoutes;