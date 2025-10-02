import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { USER_TABLE, USER_SESSION_TABLE } from "../models/table.ts";

dotenv.config()

const HOST = process.env?.SQL_HOST
const USER = process.env?.SQL_USER
const PASSWORD = process.env?.SQL_PASSWORD
const DATABASE = process.env?.SQL_DATABASE

// Quit program if one of these is not set
if (!(HOST || USER || DATABASE || PASSWORD)) {
    process.exit(-1);
}

// Create the connection to database
const conn = mysql.createPool({
    host: HOST,
    user: USER,
    database: DATABASE,

});

// Ensure the db is configured correctly
await conn.execute(USER_TABLE);
await conn.execute(USER_SESSION_TABLE);


export { conn };