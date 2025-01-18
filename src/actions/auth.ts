/* eslint-disable @typescript-eslint/no-explicit-any */
'use server'

import { axiosInstance } from "@/lib"
import { SignUpFormType } from "@/zod"

export const createAccount = async (body: SignUpFormType): Promise<any> => {
    try {
        const { data } = await axiosInstance.post('/auth/create-account', body)

        return data
    } catch (err: any) {
        return {
            success: false,
            message: err.message,
            data: err
        }
    }
}


export const login = async (body: { email: string, password: string }): Promise<any> => {
    try {
        const { data } = await axiosInstance.post('/auth/login', body)

        return data
    } catch (err: any) {
        return {
            success: false,
            message: err.message,
            data: err
        }
    }
}