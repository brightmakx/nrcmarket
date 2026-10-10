"use server"

import { getSession } from "../session";

export  async function authenticate(){
    const session=await getSession()
    return session;
}