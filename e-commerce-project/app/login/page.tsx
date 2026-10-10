"use client"

import { useEffect } from "react"
import "../components/styles/login.css"
import { useState } from "react"
import { SuccessSignUpRedirect } from "@/lib/actions/redirects"

export default function User() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [name, setName] = useState("")

    const [failed, setFailed] = useState(false)
    const [signup, setSignup] = useState(true)

    const [res, setRes] = useState<any>()


    async function submt(e: React.SubmitEvent<HTMLFormElement>) {

        e.preventDefault()

        setFailed(false)
        setRes(undefined)

        const response = await fetch("/api/users", {
            method: "POST",

            body: JSON.stringify({
                name,
                email,
                password,
                value: signup ? "Sign Up" : "Sign In"
            }),

            headers: {
                "Content-Type": "application/json"
            }
        })


        const body = await response.json()


        if (!response.ok) {

            setFailed(true)
            setRes(body)

            return
        }


        // =========================
        // SIGN UP SUCCESS
        // =========================

        if (signup) {

            setFailed(false)

            setRes({
                message:
                    "Account created successfully. Please check your email to verify your account."
            })

            return
        }


        // =========================
        // SIGN IN SUCCESS
        // =========================

        setFailed(false)

        SuccessSignUpRedirect()
    }


    function switchMode(
        e: React.MouseEvent<HTMLButtonElement>
    ) {

        e.preventDefault()

        setSignup(!signup)

        setFailed(false)
        setRes(undefined)
    }


    useEffect(() => {

        document.body.style.setProperty(
            "padding-top",
            "0px",
            "important"
        )

        document.body.style.setProperty(
            "margin-top",
            "0px",
            "important"
        )


        return () => {

            document.body.style.removeProperty(
                "padding-top"
            )

            document.body.style.removeProperty(
                "margin-top"
            )
        }

    }, [])


    return (

        <main className="auth-page">

            <div className="background-circle circle-one"></div>

            <div className="background-circle circle-two"></div>


            <form
                className="auth-card"
                onSubmit={submt}
            >


                {/* LOGO */}

                <div className="logo-container">

                    <img
                        src="/logo.png"
                        alt="LUANAR Logo"
                        className="university-logo"
                    />

                </div>


                {/* TITLE */}

                <div className="auth-header">

                    <h1>Welcome to</h1>

                    <h2>NRC Marketplace</h2>

                    <p>

                        {signup
                            ? "Create your account to get started"
                            : "Sign in to continue to your account"
                        }

                    </p>

                </div>


                {/* NAME */}

                {signup && (

                    <div className="input-group">

                        <label htmlFor="name">
                            Full Name
                        </label>


                        <div className="input-wrapper">

                            <span className="input-icon">
                                👤
                            </span>


                            <input
                                id="name"
                                type="text"
                                placeholder="Enter your name"
                                name="name"
                                value={name}
                                onChange={e =>
                                    setName(e.target.value)
                                }
                                required
                            />

                        </div>

                    </div>

                )}


                {/* EMAIL */}

                <div className="input-group">

                    <label htmlFor="email">
                        Email Address
                    </label>


                    <div className="input-wrapper">

                        <span className="input-icon">
                            ✉
                        </span>


                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            name="email"
                            value={email}
                            onChange={e =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                    </div>

                </div>


                {/* PASSWORD */}

                <div className="input-group">

                    <label htmlFor="password">
                        Password
                    </label>

                    <div className="input-wrapper">

                        <span className="input-icon">
                            🔒
                        </span>

                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your password"
                            name="password"
                            value={password}
                            onChange={e =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                        <button
                            type="button"
                            className="password-toggle"
                            onClick={() => setShowPassword(!showPassword)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                            {showPassword ? "🙈" : "👁️"}
                        </button>

                    </div>

                </div>


                {/* ERROR */}

                {failed && (

                    <div className="error-message">

                        <span>⚠</span>

                        {res?.error ||
                            "Something went wrong. Please try again."
                        }

                    </div>

                )}


                {/* SUCCESS */}

                {!failed && res?.message && signup && (

                    <div className="success-message">

                        <span>✓</span>

                        {res.message}

                    </div>

                )}


                {/* SUBMIT */}

                <button
                    type="submit"
                    className="submit"
                >

                    {signup
                        ? "Create Account"
                        : "Sign In"
                    }

                </button>


                {/* SWITCH LOGIN / SIGNUP */}

                <div className="switch-container">

                    <span>

                        {signup
                            ? "Already have an account?"
                            : "Don't have an account?"
                        }

                    </span>


                    <button
                        type="button"
                        id="login_option"
                        onClick={switchMode}
                    >

                        {signup
                            ? "Sign In"
                            : "Create a new account"
                        }

                    </button>

                </div>


                <div className="divider">

                    <span>LUANAR</span>

                </div>


                <p className="footer-text">

                    © {new Date().getFullYear()} NRC Marketplace

                </p>


            </form>

        </main>
    )
}