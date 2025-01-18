import connectDB from "./lib/connect-db";

export async function register() {
    await connectDB()
}