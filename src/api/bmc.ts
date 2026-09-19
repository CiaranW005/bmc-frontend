
export async function wakePC(): Promise<void> {
    const response = await fetch("api/wake", {
        method: "POST",
    })

    if (!response.ok) {
        throw new Error('Wake failed: ${response.status}')
    }
}