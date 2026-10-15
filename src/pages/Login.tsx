import { useState } from "react";
import { login } from "../api/auth";
import GoogleLogin from "../components/GoogleLogin";

import "../styles/Login.css";

type Props = {
    onLogin: () => void
}

function Login({ onLogin }: Props) {
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault()
        setLoading(true);
        setError("")
        
        try {
            await login(password)
            onLogin()
        } catch (err) {
            console.error(err)
            setError("Login Failed.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <h1>Welcome back</h1>
                    <p>Sign in to your management console</p>
                </div>

                <div className="google-login">
                    <GoogleLogin onSuccess={onLogin} />
                </div>

                <div className="login-divider">
                    <span>OR</span>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <label htmlFor="password">Password</label>

                    <input
                        id="password"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="Enter your password"
                        autoComplete="current-password"
                        required
                    />

                    {error && <p className="login-error">{error}</p>}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <div className="login-footer">
                    BMC - Remote Management Console
                </div>
            </div>
        </main>
    )
}

export default Login