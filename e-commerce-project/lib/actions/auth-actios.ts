"use server"

import { headers } from "next/headers"
import { auth } from "../auth"
import { redirect } from "next/navigation"
import { getSession } from "../session"

export const signUp = async (
    email: string,
    password: string,
    name: string
) => {
    const result = await auth.api.signUpEmail({
        body: {
            email,
            password,
            name,
            phone: "",
            location: "",
            callbackURL: "/"
        }
    })
    return result;
}
export const signIn = async (email: string, password: string) => {
    try {
        const result = await auth.api.signInEmail({
            body: {
                email,
                password
            },
            headers: await headers()
        })

        return {
            success: true,
            result
        }

    } catch (error: any) {

        if (error?.body?.code === "EMAIL_NOT_VERIFIED") {

            await auth.api.sendVerificationEmail({
                body: {
                    email,
                    callbackURL: "/"
                }
            })

            return {
                success: false,
                emailVerificationRequired: true
            }
        }

        throw error
    }
}

export const signOut = async () => {

    const result = await auth.api.signOut({
        headers: await headers()
    })

    if (result) {
        redirect("/login")
    }

    return result;
}


export const Session = async () => {

    const result = await getSession();

    return result;
}