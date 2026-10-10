import { redirect } from "next/navigation";

export function SuccessSignUpRedirect(){
    redirect("/");
}

export function loginRedirect(){
    redirect("/login")
}