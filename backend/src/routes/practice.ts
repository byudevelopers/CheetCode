import express, { Request, Response } from 'express';
import { AuthenticatedRequest, authenticateUser } from '../middleware/auth';
import { conn } from "@/utils/db.ts";
import { type Card, type RecordLogItem, fsrs, Rating } from 'ts-fsrs';
import { QueryResult, RowDataPacket } from "mysql2/index";
import { ProblemTableType } from '@/models/table';

const dashRoutes = express.Router();


export interface Example {
    input: string;
    output: string;
}

export interface Problem {
    id: number;
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


    const { userID, problemID, confidence } = req.body;
    const getProblem =
        `
        SELECT Card, ProblemID
        FROM SR_CARD 
        WHERE UserID = ?
        AND ProblemID = ?;
        `


    const updateProblemWithCard =
        `
    UPDATE SR_CARD
    SET Card = ?, NextReview = ?
    Where UserID = ? AND ProblemID = ?; 
        `;

    if (!problemID || !confidence) {
        res.status(400).json({ success: false });
        return;
    }
    try {

        const [card] = (await conn.execute<SR_Card[]>(getProblem, [userID, problemID]))[0];

        if (!card) {
            // handle error
            res.status(400).json({success:false, message:"Problem ID does not match any problems"});
            return;
        }
        /*
const reviewTime = new Date('2025-11-10T10:05:00Z'); // 5 minutes later

// 3. Simulate the user rating the card as 'Good' (Rating.Good)
// The repeat() function returns a schedule for all four possible grades.
const schedulingCards = f.repeat(currentCard, reviewTime);

// 4. Get the scheduled card state for the actual grade (Good)
const goodCardState: RecordLogItem = schedulingCards[Rating.Good];
        */


        const f = fsrs();

        const schedulingCards = f.repeat(card.Card, new Date());

        const validReviewRatings: number[] = [Rating.Again, Rating.Hard, Rating.Good, Rating.Easy]; // [1, 2, 3, 4]

        if (!validReviewRatings.includes(confidence)) {
            throw new Error(`Invalid rating provided: ${confidence}`);
        }

        const selectedRating = confidence as Rating;

        // Oops fix at some point
        // @ts-ignore
        const newCard: Card = (schedulingCards[confidence] as RecordLogItem).card;

        const nextReviewDate = new Date(newCard.due);
        const parsedNextReviewDate = nextReviewDate.toISOString().replace("T", " ").replace("Z", '');

        await conn.execute(updateProblemWithCard, [JSON.stringify(newCard), parsedNextReviewDate, userID, problemID]);
        res.json({ sucess: true });
        return;
    }
    catch (err) {

        res.status(500).json({ success: false });
        console.error(err);
        return;

    }

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
    ORDER BY NextReview ASC
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
    SELECT  id, type, title, url, difficulty FROM PROBLEM_TABLE
    WHERE id = ?;
    `;

    try {
        const result = (await conn.execute<SR_Card[]>(getMostRecentProblem, [userID]))[0];

        if (result.length == 1) {
            const card = result[0] as SR_Card;
            const [problemData] = (await conn.execute<ProblemTableResult[]>(getProblemByID, [card.ProblemID]))[0];


            const parsedProblem: Problem = {
                id: problemData.id,
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