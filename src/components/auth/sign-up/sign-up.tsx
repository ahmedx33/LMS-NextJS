'use client'

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useFormErrorHandler from "@/hooks/useFormErrorHandler";
import { notify } from "@/lib";
import { SignUpFormType, signUpSchema } from "@/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createAccount } from "@/actions";
import { LoaderCircle } from 'lucide-react';
import { redirect } from "next/navigation";

export function SignUp() {
    const { mutateAsync, isPending } = useMutation({
        mutationFn: createAccount,
        onSuccess: (data: { success: boolean; message: string; data: null }) => {
            if (data.success) {
                notify({ text: data.message, type: "success" })
                redirect("/")
            }

            notify({ text: data.message, type: "error" })

        },
    })
    const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormType>({
        resolver: zodResolver(signUpSchema),
    })
    const { errorMessages } = useFormErrorHandler(errors);

    const onSubmit = useCallback(async (data: SignUpFormType) => {
        console.log(data)
        await mutateAsync(data)
    }, [mutateAsync])

    useEffect(() => {
        notify({ text: errorMessages[0]?.message, type: "error" })
    }, [errorMessages])

    return (
        <div className="w-full min-h-screen flex items-center justify-center">
            <div className="w-full max-w-[500px] flex flex-col justify-center items-center py-5 px-7 shadow-md rounded-lg">
                <h1 className="text-[#525252] text-[30px] font-semibold">
                    Create Account
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="w-full">
                    <div className="w-full mt-7 space-y-7">
                        <div className="flex flex-col justify-center gap-2">
                            <Label htmlFor="username">Username</Label>
                            <Input id="username" placeholder="Username" className=" w-full transition-all" {...register("username")} />
                        </div>

                        <div className="flex flex-col justify-center gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" placeholder="Email" className=" w-full transition-all"  {...register("email")} />
                        </div>

                        <div className="flex flex-col justify-center gap-2">
                            <Label htmlFor="password">Password</Label>
                            <Input id="password" placeholder="Password" className=" w-full transition-all"  {...register("password")} />
                        </div>

                        <div className="flex flex-col justify-center gap-2">
                            <Label htmlFor="confirm-password">Confirm Password</Label>
                            <Input id="confirm-password" placeholder="Confirm Password" className=" w-full transition-all"  {...register("confirmPassword")} />
                        </div>

                        {
                            !isPending ? (<Button type="submit" className="w-full ">Create Account</Button>) : (<Button type="submit" className="w-full " disabled>
                                <LoaderCircle size={25} className=" animate-spin" />
                            </Button>)
                        }
                    </div>
                </form>
            </div>
        </div>
    )
}
