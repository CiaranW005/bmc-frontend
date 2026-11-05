
// Authentication uses a server-managed cookie sent automatically with
// same-origin requests. The frontend does not store a session token.
export async function checkSession(): Promise<void> {
    const response = await fetch("api/session")

    if (!response.ok) {
        throw new Error("Not authenticated")
    }
}

export async function login(password: string): Promise<void> {
    const response = await fetch("api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ password })
    })

    if (!response.ok) {
        throw new Error("Invalid Password")
    }
    
}

export async function logout(): Promise<void> {
    const response = await fetch("api/logout", {
        method: "POST"
    })

    if (!response.ok) {
        throw new Error("Logout Failed")
    }
}