import { UserModel } from "@/models/user"
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {
    try {

        

        const data = await req.json()

        if (!data.username || !data.email || !data.password) {
            return NextResponse.json({
                success: false,
                message: "Username, email, and password are required",
                data: null
            }, { status: 400 })
        }

        const existingUser = await UserModel.findOne({ email: data.email })
        if (existingUser) {
            return NextResponse.json({
                success: false,
                message: "User already exists",
                data: null
            }, { status: 200 })
        }

        const user = new UserModel({
            username: data.username,
            email: data.email,
            password: data.password
        })

        const savedUser = await user.save()

        return NextResponse.json({
            success: true,
            message: "Account created successfully",
            data: savedUser
        }, { status: 201 })

    } catch (error) {
        console.error("Error creating user:", error)
        return NextResponse.json({
            success: false,
            message: "Internal server error",
            data: null
        }, { status: 500 })
    }
}
