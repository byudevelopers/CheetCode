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
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const datasetPath = path.join(__dirname, "../../dataset.csv");

// --- HELPER: CSV PARSER ---
// We need a custom parser because simple .split(',') fails on fields containing
// commas, newlines, and escaped quotes (like the JSON field).
function parseCSV(text: string) {
    const rows: string[][] = [];
    let currentRow: string[] = [];
    let currentField = '';
    let inQuote = false;

    for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];

        if (char === '"') {
            if (inQuote && nextChar === '"') {
                // Handle escaped double quotes ("") -> becomes (")
                currentField += '"';
                i++; // Skip the next quote
            } else {
                // Toggle quote mode
                inQuote = !inQuote;
            }
        } else if (char === ',' && !inQuote) {
            // Field separator
            currentRow.push(currentField);
            currentField = '';
        } else if ((char === '\r' || char === '\n') && !inQuote) {
            // Row separator
            if (char === '\r' && nextChar === '\n') i++; // Handle \r\n
            
            currentRow.push(currentField);
            // Only push if we actually have data
            if (currentRow.length > 0) rows.push(currentRow);
            
            currentRow = [];
            currentField = '';
        } else {
            currentField += char;
        }
    }
    
    // Handle end of file
    if (currentField || currentRow.length > 0) {
        currentRow.push(currentField);
        if (currentRow.length > 0) rows.push(currentRow);
    }

    return rows;
}

// --- INITIALIZE DB ---
const initDb = async () => {
    try {
        await conn.execute(USER_TABLE);
        await conn.execute(USER_SESSION_TABLE);
        await conn.execute(PROBLEM_TABLE);
        await conn.execute(USER_PROBLEM_TABLE);

        // 1. Read the file
        const csvContent = fs.readFileSync(datasetPath, 'utf-8');

        // 2. Parse CSV manually to handle complex quoted strings
        const rows = parseCSV(csvContent);

        // 3. Remove Header Row (id, type, title...)
        rows.shift(); 

        // 4. Process and Insert
        for (const row of rows) {
            // Ensure row has enough columns (csv might have trailing empty lines)
            if (row.length < 6) continue;

            const [id, type, title, url, difficulty, questionsRaw] = row;

            let questionsJsonString;

            try {
                // The CSV contains JS Object syntax: { title: 'Val' } 
                // MySQL needs JSON syntax: { "title": "Val" }
                // We use new Function to evaluate the JS object string into a real Object
                // then stringify it back to valid JSON.
                const fixedObj = (new Function("return " + questionsRaw))();
                questionsJsonString = JSON.stringify(fixedObj);
            } catch (err) {
                console.error(`Failed to parse questions for problem ID ${id}. Skipping.`);
                continue; 
            }

            // Insert into DB
            // We use INSERT IGNORE so we don't crash if the ID already exists
            const query = `
                INSERT IGNORE INTO PROBLEM_TABLE 
                (id, type, title, url, difficulty, questions) 
                VALUES (?, ?, ?, ?, ?, ?)
            `;

            await conn.execute(query, [id, type, title, url, difficulty, questionsJsonString]);
        }

        console.log("Database initialized and dataset loaded.");

    } catch (err) {
        console.error("Database initialization failed:", err);
    }
}

// Run initialization
await initDb();

export { conn };