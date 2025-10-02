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

const UserTableSchema = z.object({
    UserID: z.int(),
    Name: z.string(),
    Email: z.string(),
    Password: z.string()
})

type UserTableType = z.infer<typeof UserTableSchema>;



export { USER_TABLE, USER_SESSION_TABLE, UserTableType };