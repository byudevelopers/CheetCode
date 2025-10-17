import { RegisterUserSchema } from "./user.ts";
import { z } from "zod";

const USER_TABLE = `
CREATE TABLE IF NOT EXISTS Users (
UserID INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
Name VARCHAR(20) NOT NULL,
Email VARCHAR(125) NOT NULL UNIQUE,
Password VARCHAR(100) NOT NULL
)
`;

const USER_SESSION_TABLE = `
CREATE TABLE IF NOT EXISTS USER_SESSION (
UserID INT NOT NULL PRIMARY KEY,
SessionID VARCHAR(256) NOT NULL UNIQUE,
Created_At BIGINT NOT NULL,
Expires_At BIGINT NOT NULL
)
`

const USER_PROBLEM_TABLE = `
CREATE TABLE IF NOT EXISTS USER_PROBLEM_TABLE(
UserID INT NOT NULL PRIMARY KEY,
ProblemsCompletedID JSON 
)
`;

const PROBLEM_TABLE = `
CREATE TABLE IF NOT EXISTS PROBLEM_TABLE (
id INT NOT NULL PRIMARY KEY,
type VARCHAR(100) NOT NULL,
title VARCHAR(200) NOT NULL,
url VARCHAR(300) NOT NULL,
difficulty VARCHAR(10) NOT NULL
)
`

const UserTableSchema = z.object({
    UserID: z.int(),
    Name: z.string(),
    Email: z.string(),
    Password: z.string()
})
const UserSessionTableSchema = z.object({
    UserID: z.int(),
    SessionID: z.string(),
    Created_At: z.bigint(),
    Expires_At: z.bigint()
})

type UserTableType = z.infer<typeof UserTableSchema>;
type UserSessionTableType = z.infer<typeof UserSessionTableSchema>; 


export { USER_TABLE, USER_SESSION_TABLE, PROBLEM_TABLE, UserTableType, UserSessionTableType };