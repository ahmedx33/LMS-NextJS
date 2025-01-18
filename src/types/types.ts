import { UserRoles } from "@/models/user/user.types"


export type User = {
    username: string,
    email: string,
    password: string
    points: number,
    role: UserRoles
}