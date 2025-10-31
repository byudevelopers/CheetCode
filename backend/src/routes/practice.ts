import express, { Request, Response } from 'express';
import { AuthenticatedRequest, authenticateUser } from '../middleware/auth';
import { conn } from "@/utils/db.ts";
import { RowDataPacket } from "mysql2/index";


const dashRoutes = express.Router();

// User will pass in their jwt token as a parameter called token

// TODO: Make sure to validate schema
dashRoutes.post("/practice", authenticateUser, async (req: AuthenticatedRequest, res: Response) => {

    //TODO: Receive the user selection of the problem (id and confidence level)

});


dashRoutes.get('/practice', authenticateUser, async (req: AuthenticatedRequest, res: Response) => {

   //TODO: RETURN THE NEXT QUESTION


});

export default dashRoutes;