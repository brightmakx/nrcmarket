import { betterAuth } from "better-auth/minimal";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { nextCookies } from "better-auth/next-js";
import { sendEmail } from "./email";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql"
    }),

    emailVerification: {
        sendOnSignUp: true,

        sendVerificationEmail: async ({ user, url, token }, request) => {
            //console.log("Verification URL:", url);

            await sendEmail({
                to: user.email,
                subject: "Verify your email address",
                text: `Click the link to verify your email: ${url}`,
            });
        },

        autoSignInAfterVerification: true,
    },

    user: {
        modelName: "user",

additionalFields: {
    phone: {
        type: "string",
        required: false
    },

    location: {
        type: "string",
        required: false
    },

    role: {
        type: "string",
        required: false,
        defaultValue: "BASIC"
    }
}
    },

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true
    },

    socialProviders: {
        google: {
            clientId: "",
            clientSecret: ""
        }
    },

    plugins: [
        nextCookies()
    ]
});