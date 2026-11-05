type Command = "wake" | "reset" | "power_off";

async function sendCommand(command: Command): Promise<void> {
    const response = await fetch(`/api/${command}`, {
        method: "POST",
    });

    // Successful requests need no further processing here.
    // The dashboard receives PC status and wake progress through the status stream.
    if (response.ok) return;

    let message = `Command ${command} failed (HTTP ${response.status})`

    if (response.status === 401) {
        message = "Your session has expired. Please sign in again."
    } else if (
        response.headers.get("content-type")?.includes("application/json")
    ) {
        try {
            // Check the response shape before using its error message.
            // Keep the fallback message if the body is missing, invalid, or unexpected.
            const body: unknown = await response.json()

            if (
                typeof body === "object" &&
                body !== null &&
                "error" in body &&
                typeof body.error === "string" &&
                body.error.trim()
            ) {
                message = body.error
            }
        } catch {
            console.log("Could not parse error response", response)
        }
    }

    throw new Error(message)
}

export async function wakePC(): Promise<void> {
    return sendCommand("wake");
}

export async function resetPC(): Promise<void> {
    return sendCommand("reset");
}

export async function powerOffPC(): Promise<void> {
    return sendCommand("power_off");
}