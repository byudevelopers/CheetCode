import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { USER_TABLE, USER_SESSION_TABLE, PROBLEM_TABLE, USER_PROBLEM_TABLE } from "../models/table.ts";
import path from 'path';
import { fileURLToPath } from 'url';
import fs from "fs";

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
    password: PASSWORD,
    database: DATABASE,
    infileStreamFactory: path => fs.createReadStream(path)
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetPath = path.join(__dirname, "../../dataset.csv");

// const LOAD_DATASET_QUERY = `
// LOAD DATA LOCAL INFILE '${datasetPath}'
// INTO TABLE PROBLEM_TABLE
// FIELDS TERMINATED BY ','
// ENCLOSED BY '"'
// LINES TERMINATED BY '\n'
// IGNORE 1 ROWS;
// `;

const LOAD_DATASET_QUERY = `
  LOAD DATA LOCAL INFILE 'dataset.csv'
  INTO TABLE PROBLEM_TABLE
  FIELDS TERMINATED BY ','
  ENCLOSED BY '"'
  LINES TERMINATED BY '\\n'
  IGNORE 1 ROWS;
`;


// Ensure the db is configured correctly
await conn.execute(USER_TABLE);
await conn.execute(USER_SESSION_TABLE);
await conn.execute(PROBLEM_TABLE);
await conn.execute(USER_PROBLEM_TABLE);

await conn.query(LOAD_DATASET_QUERY);

export { conn };