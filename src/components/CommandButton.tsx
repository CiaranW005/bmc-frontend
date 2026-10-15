import { useState } from "react";

interface CommandButtonProps {
    label: string;
    loadingLabel: string;
    command: () => Promise<void>;
    confirm?: string;
}

function CommandButton({
    label,
    loadingLabel,
    command,
    confirm,
}: CommandButtonProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null)

    async function handleClick() {
        if (confirm && !window.confirm(confirm)) {
            return;
        }

        setError(null);
        setLoading(true);

        try {
            await command();
        } catch (error) {
            setError(
                error instanceof Error
                    ? error.message
                    : "Command failed"
            )
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <button onClick={handleClick} disabled={loading}>
                {loading ? loadingLabel : label}
            </button>

            {error && (
                <p className="command-error" role="alert">
                    {error}
                </p>
            )}
        </>
    );
}

export default CommandButton;