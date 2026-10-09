type Command = "wake" | "reset" | "power-off";

async function sendCommand(command: Command): Promise<void> {
    const response = await fetch(`/api/${command}`, {
        method: "POST",
    });

    if (!response.ok) {
        throw new Error(`Command ${command} failed: ${response.status}`);
    }
}

export async function wakePC(): Promise<void> {
    return sendCommand("wake");
}

export async function resetPC(): Promise<void> {
    return sendCommand("reset");
}

export async function powerOffPC(): Promise<void> {
    return sendCommand("power-off");
}