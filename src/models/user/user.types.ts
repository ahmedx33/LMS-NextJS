import { Document } from "mongoose";


export type UserRoles = "Student" | "Teacher" | "Admin";

export interface IUser extends Document {
    username: string;
    email: string;
    password: string;
    points: number;
    role: UserRoles;
}