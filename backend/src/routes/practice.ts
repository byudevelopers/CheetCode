import express, { Request, Response } from 'express';
import { AuthenticatedRequest, authenticateUser } from '../middleware/auth';
import { conn } from "@/utils/db.ts";
import { RowDataPacket } from "mysql2/index";


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

    const problem: Problem = {
        title: "Two Sum Problem",
        desc: "Find indices of two numbers that add up to a target sum.",
        examples: [
            { input: "[2,7,11,15], target=9", output: "[0,1]" },
            { input: "[3,2,4], target=6", output: "[1,2]" },
            { input: "[3,3], target=6", output: "[0,1]" },
        ],
    };

    res.json(problem);
    return
   //TODO: RETURN THE NEXT QUESTION


});

export default dashRoutes;