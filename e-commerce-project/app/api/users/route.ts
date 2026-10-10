import { NextRequest } from "next/server"

import { signIn, signUp } from "@/lib/actions/auth-actios"
import { getSession } from "@/lib/session"
import { unAuthorizedResponse } from "../products/route"
import { prisma } from "@/lib/prisma"

import { getUser } from "@/app/bussinessLogic/user"
import { validateUserEntity } from "@/app/validation/userValidation"
import { file } from "zod"
import { saveImage } from "@/app/bussinessLogic/files"
import { usersDb } from "@/app/database/data"


export async function POST(request: NextRequest) {

    try {
        const body = await request.json()

        const {
            name,
            email,
            password,
            value
        } = body


        // =========================
        // SIGN IN
        // =========================

        if (value === "Sign In") {

            if (!email || !password) {
                return new Response(
                    JSON.stringify({
                        success: false,
                        errors: {
                            email: !email
                                ? "Email is required"
                                : "",
                            password: !password
                                ? "Password is required"
                                : ""
                        }
                    }),
                    {
                        status: 400,
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                )
            }

            try {

                const signedIn = await signIn(
                    email,
                    password
                )

                if (signedIn?.emailVerificationRequired) {

                    return new Response(
                        JSON.stringify({
                            success: false,
                            error:
                                "Please verify your email. A new verification link has been sent.",
                            emailVerificationRequired: true
                        }),
                        {
                            status: 403,
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }
                    )
                }

                return new Response(
                    JSON.stringify({
                        success: true,
                        message: "Signed in successfully"
                    }),
                    {
                        status: 200,
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                )

            } catch (error: any) {

                return new Response(
                    JSON.stringify({
                        success: false,
                        error:
                            error?.body?.message ||
                            error?.message ||
                            "Failed to sign in"
                    }),
                    {
                        status: 400,
                        headers: {
                            "Content-Type": "application/json"
                        }
                    }
                )
            }
        }


        // =========================
        // SIGN UP
        // =========================

        if (value !== "Sign Up") {

            return new Response(
                JSON.stringify({
                    success: false,
                    error: "Invalid operation"
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
        }


        // =========================
        // VALIDATE USER
        // =========================

        const validation = validateUserEntity({
            name,
            email,
            password
        })

        if (!validation.success) {

            return new Response(
                JSON.stringify(validation),
                {
                    status: 400,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
        }


        // =========================
        // CREATE USER
        // =========================

        const saved = await signUp(
            validation.data.email,
            validation.data.password,
            validation.data.name
        )

        if (saved.user?.id) {
            return new Response(
                JSON.stringify({
                    success: true,
                    message:
                        "Account created. Please check your email to verify your account."
                }),
                {
                    status: 201,
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            )
        }


        return new Response(
            JSON.stringify({
                success: false,
                error: "User was not created"
            }),
            {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )

    } catch (error: any) {

        console.error(
            "User API error:",
            error
        )

        return new Response(
            JSON.stringify({
                success: false,
                error:
                    error?.body?.message ||
                    error?.message ||
                    "An unexpected error occurred"
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
    }
}


export async function DELETE(
    request: NextRequest
) {

    const session = await getSession()

    if (!session) {
        return unAuthorizedResponse
    }

    const userId = session.user.id

    if (!userId) {

        return new Response(
            JSON.stringify({
                success: false,
                error: "User not found"
            }),
            {
                status: 400,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
    }

    try {

        await prisma.user.delete({
            where: {
                id: userId
            }
        })

        return new Response(
            JSON.stringify({
                success: true,
                message: "Deleted successfully"
            }),
            {
                status: 200,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )

    } catch (error) {

        console.error(
            "Failed to delete user:",
            error
        )

        return new Response(
            JSON.stringify({
                success: false,
                error: "Operation failed"
            }),
            {
                status: 500,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
    }
}


export async function GET(
    request: NextRequest
) {

    const {
        searchParams
    } = request.nextUrl

    const includeOrders =
        searchParams.get("includeOrders") === "true"

    const session = await getSession()

    if (!session) {
        return unAuthorizedResponse
    }

    const data = await getUser(
        session.user.id,
        includeOrders
    )

    if (!data) {
        return new Response(
            JSON.stringify({
                success: false,
                error: "User not found"
            }),
            {
                status: 404,
                headers: {
                    "Content-Type": "application/json"
                }
            }
        )
    }

    return new Response(
        JSON.stringify({
            success: true,
            data
        }),
        {
            status: 200,
            headers: {
                "Content-Type": "application/json"
            }
        }
    )
}


export async function PUT(request: NextRequest) {

    console.log("\n========================================");
    console.log("PUT /api/users START");
    console.log("========================================");


    // =========================
    // SESSION
    // =========================

    console.log("[1] Getting session...");

    const session = await getSession();

    console.log(
        "[1] Session:",
        session
            ? {
                userId: session.user?.id,
                email: session.user?.email
            }
            : null
    );


    if (!session?.user) {

        console.log(
            "[1] FAILED: No authenticated user"
        );

        return unAuthorizedResponse;
    }

    console.log(
        "[1] SUCCESS: User authenticated:",
        session.user.id
    );


    try {

        // =========================
        // FORM DATA
        // =========================

        console.log(
            "[2] Parsing formData..."
        );

        const formdata =
            await request.formData();

        console.log(
            "[2] SUCCESS: formData parsed"
        );

        console.log(
            "[2] FormData keys:",
            Array.from(formdata.keys())
        );


        // =========================
        // DATA
        // =========================

        console.log(
            "[3] Extracting form data..."
        );

        const name =
            formdata.get("name");

        const phone =
            formdata.get("phone");

        const location =
            formdata.get("location");

        const image =
            formdata.get("image");


        console.log(
            "[3] name:",
            name
        );

        console.log(
            "[3] phone:",
            phone
        );

        console.log(
            "[3] location:",
            location
        );

        console.log(
            "[3] image:",
            image instanceof File
                ? {
                    name: image.name,
                    size: image.size,
                    type: image.type
                }
                : image
        );


        // =========================
        // GET CURRENT USER
        // =========================

        console.log(
            "[4] Looking up current user..."
        );

        let currentUser;

        try {

            currentUser =
                await prisma.user.findUnique({

                    where: {
                        id: session.user.id
                    }

                });

            console.log(
                "[4] User lookup result:",
                currentUser
                    ? {
                        id: currentUser.id,
                        name: currentUser.name,
                        email: currentUser.email,
                        phone: currentUser.phone,
                        location: currentUser.location,
                        hasImage:
                            !!currentUser.image
                    }
                    : null
            );

        } catch (error) {

            console.error(
                "[4] DATABASE ERROR while finding user:",
                error
            );

            throw error;
        }


        if (!currentUser) {

            console.log(
                "[4] FAILED: User not found"
            );

            return new Response(
                JSON.stringify({
                    success: false,
                    error: "User not found"
                }),
                {
                    status: 404,
                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );
        }


        console.log(
            "[4] SUCCESS: Current user found"
        );


        // =========================
        // TRACK UPDATES
        // =========================

        let updated = false;

        console.log(
            "[5] Starting independent field updates..."
        );


        // =========================
        // NAME
        // =========================

        console.log(
            "[6] Checking NAME..."
        );

        if (
            typeof name === "string" &&
            name.trim().length > 0
        ) {

            console.log(
                "[6] Name was provided:",
                name
            );

            const value =
                name.trim();

            console.log(
                "[6] Validating name..."
            );

            const validation =
                validateUserEntity({

                    name: value,

                    email:
                        currentUser.email,

                    password:
                        "profile-update",

                    phone:
                        currentUser.phone ?? "",

                    location:
                        currentUser.location ?? ""

                });


            console.log(
                "[6] Name validation result:",
                validation
            );


            if (
                !validation.success &&
                validation.errors?.name
            ) {

                console.log(
                    "[6] FAILED: Name validation"
                );

                return new Response(
                    JSON.stringify({
                        success: false,
                        errors: {
                            name:
                                validation.errors.name
                        }
                    }),
                    {
                        status: 400,
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );
            }


            console.log(
                "[6] Updating name..."
            );

            try {

                await usersDb.updateUser(
                    session.user.id,
                    {
                        name: value
                    }
                );

                console.log(
                    "[6] SUCCESS: Name updated"
                );

                updated = true;

            } catch (error) {

                console.error(
                    "[6] FAILED: Name database update:",
                    error
                );

                throw error;
            }

        } else {

            console.log(
                "[6] Name not provided - skipping"
            );
        }


        // =========================
        // PHONE
        // =========================

        console.log(
            "[7] Checking PHONE..."
        );

        if (
            typeof phone === "string" &&
            phone.trim().length > 0
        ) {

            console.log(
                "[7] Phone was provided:",
                phone
            );

            const value =
                phone.trim();

            console.log(
                "[7] Validating phone..."
            );

            const validation =
                validateUserEntity({

                    name:
                        currentUser.name,

                    email:
                        currentUser.email,

                    password:
                        "profile-update",

                    phone: value,

                    location:
                        currentUser.location ?? ""

                });


            console.log(
                "[7] Phone validation result:",
                validation
            );


            if (
                !validation.success &&
                validation.errors?.phone
            ) {

                console.log(
                    "[7] FAILED: Phone validation"
                );

                return new Response(
                    JSON.stringify({
                        success: false,
                        errors: {
                            phone:
                                validation.errors.phone
                        }
                    }),
                    {
                        status: 400,
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );
            }


            console.log(
                "[7] Updating phone..."
            );

            try {

                await usersDb.updateUser(
                    session.user.id,
                    {
                        phone: value
                    }
                );

                console.log(
                    "[7] SUCCESS: Phone updated"
                );

                updated = true;

            } catch (error) {

                console.error(
                    "[7] FAILED: Phone database update:",
                    error
                );

                throw error;
            }

        } else {

            console.log(
                "[7] Phone not provided - skipping"
            );
        }


        // =========================
        // LOCATION
        // =========================

        console.log(
            "[8] Checking LOCATION..."
        );

        if (
            typeof location === "string" &&
            location.trim().length > 0
        ) {

            console.log(
                "[8] Location was provided:",
                location
            );

            const value =
                location.trim();

            console.log(
                "[8] Validating location..."
            );

            const validation =
                validateUserEntity({

                    name:
                        currentUser.name,

                    email:
                        currentUser.email,

                    password:
                        "profile-update",

                    phone:
                        currentUser.phone ?? "",

                    location: value

                });


            console.log(
                "[8] Location validation result:",
                validation
            );


            if (
                !validation.success &&
                validation.errors?.location
            ) {

                console.log(
                    "[8] FAILED: Location validation"
                );

                return new Response(
                    JSON.stringify({
                        success: false,
                        errors: {
                            location:
                                validation.errors.location
                        }
                    }),
                    {
                        status: 400,
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );
            }


            console.log(
                "[8] Updating location..."
            );

            try {

                await usersDb.updateUser(
                    session.user.id,
                    {
                        location: value
                    }
                );

                console.log(
                    "[8] SUCCESS: Location updated"
                );

                updated = true;

            } catch (error) {

                console.error(
                    "[8] FAILED: Location database update:",
                    error
                );

                throw error;
            }

        } else {

            console.log(
                "[8] Location not provided - skipping"
            );
        }


        // =========================
        // IMAGE
        // =========================

        console.log(
            "[9] Checking IMAGE..."
        );

        if (
            image instanceof File &&
            image.size > 0
        ) {

            console.log(
                "[9] Image received:",
                {
                    name: image.name,
                    size: image.size,
                    type: image.type
                }
            );


            const date =
                new Date();

            const imageName =
                crypto.randomUUID() +
                date.toISOString() +
                image.name;


            console.log(
                "[9] Generated image name:",
                imageName
            );


            console.log(
                "[9] Saving image..."
            );

            let saved;

            try {

                saved =
                    await saveImage(
                        image,
                        imageName
                    );

            } catch (error) {

                console.error(
                    "[9] FAILED: saveImage threw an error:",
                    error
                );

                throw error;
            }


            console.log(
                "[9] saveImage result:",
                saved
            );


            if (!saved) {

                console.log(
                    "[9] FAILED: Image was not saved"
                );

                return new Response(
                    JSON.stringify({
                        success: false,
                        error:
                            "failed to save the image"
                    }),
                    {
                        status: 400,
                        headers: {
                            "Content-Type":
                                "application/json"
                        }
                    }
                );
            }


            console.log(
                "[9] Image saved successfully"
            );


            console.log(
                "[9] Updating user's image in database..."
            );

            try {

                await usersDb.updateUser(
                    session.user.id,
                    {
                        image: imageName
                    }
                );

                console.log(
                    "[9] SUCCESS: User image updated"
                );

                updated = true;

            } catch (error) {

                console.error(
                    "[9] FAILED: Image database update:",
                    error
                );

                throw error;
            }

        } else {

            console.log(
                "[9] Image not provided - skipping"
            );
        }


        // =========================
        // NOTHING TO UPDATE
        // =========================

        console.log(
            "[10] Checking whether anything was updated..."
        );

        console.log(
            "[10] updated =",
            updated
        );


        if (!updated) {

            console.log(
                "[10] FAILED: Nothing to update"
            );

            return new Response(
                JSON.stringify({
                    success: false,
                    error:
                        "nothing to update"
                }),
                {
                    status: 400,
                    headers: {
                        "Content-Type":
                            "application/json"
                    }
                }
            );
        }


        // =========================
        // SUCCESS
        // =========================

        console.log(
            "[11] SUCCESS: User update completed"
        );

        console.log(
            "========================================"
        );

        console.log(
            "PUT /api/users END"
        );

        console.log(
            "========================================\n"
        );


        return new Response(
            JSON.stringify({
                success: true,
                message:
                    "updated successfully"
            }),
            {
                status: 200,
                headers: {
                    "Content-Type":
                        "application/json"
                }
            }
        );


    } catch (error) {

        console.error(
            "\n========================================"
        );

        console.error(
            "PUT /api/users FAILED"
        );

        console.error(
            "ERROR:",
            error
        );

        if (error instanceof Error) {

            console.error(
                "ERROR MESSAGE:",
                error.message
            );

            console.error(
                "ERROR STACK:",
                error.stack
            );
        }

        console.error(
            "========================================\n"
        );


        return new Response(
            JSON.stringify({
                success: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to update user"
            }),
            {
                status: 400,
                headers: {
                    "Content-Type":
                        "application/json"
                }
            }
        );
    }
}