import { auth } from "./auth";
import { headers } from "next/headers";

export async function getSessionIfEmailVerified() {
    return auth.api.getSession({
        headers: await headers(),
    });
}

export async function getSession() {
    const session=await getSessionIfEmailVerified()
    if(session?.user.emailVerified){
        return session
    }
    //wanna do something here like sending the link again and asking the user to verify
    return null;
}
    
