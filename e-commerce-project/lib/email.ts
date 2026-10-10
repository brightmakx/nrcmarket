
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendEmailArgs {
    to: string;
    subject: string;
    text: string;
}

export async function sendEmail({
    to,
    subject,
    text,
}: SendEmailArgs) {

    try {

        const { data, error } = await resend.emails.send({
            from: "NRC Marketplace <onboarding@resend.dev>",
            to: [to],
            subject,
            text,
        });

        if (error) {
            console.error("Resend email error:", error);
            throw new Error(error.message);
        }

        //console.log("Email sent successfully:", data?.id);

        return data;

    } catch (error) {

        console.error("Failed to send email:", error);

        throw error;
    }
}
