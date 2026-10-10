import { useState } from "react";
import { login } from "../api/auth";

import GoogleLogin from "../components/GoogleLogin";

type Props = {
    onLogin: () => void
}

function Login({ onLogin }: Props) {
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")

    async function handleSubmit(e: React.SubmitEvent) {
        e.preventDefault()
        
        try {
            await login(password)
            setError("")
            onLogin()
        } catch (err) {
            console.error(err)
            setError("Login Failed")
        }
    }

    return (
        <main>
            <h1>BMC Login</h1>

            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Password"
                />

                <button type="submit">Login</button>
            </form>

            {error && <p>{error}</p>}

            <GoogleLogin onSuccess={onLogin} />
        </main>
    )
}

export default Login