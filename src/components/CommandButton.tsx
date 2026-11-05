import { useState } from "react";

interface CommandButtonProps {
    label: string;
    loadingLabel: string;
    command: () => Promise<void>;
    confirm?: string;
    onError: (message: string | null) => void;
}

function CommandButton({
    label,
    loadingLabel,
    command,
    confirm,
    onError
}: CommandButtonProps) {
    const [loading, setLoading] = useState(false);

    async function handleClick() {
        if (confirm && !window.confirm(confirm)) {
            return;
        }

        // Clear the previous error and disable this button while its request runs.
        // Other command buttons keep their own loading state.
        onError(null);
        setLoading(true);

        try {
            await command();
        } catch (error) {
            onError(
                error instanceof Error
                    ? error.message
                    : "Command failed"
            )
        } finally {
            setLoading(false);
        }
    }

    return (
        <button onClick={handleClick} disabled={loading}>
            {loading ? loadingLabel : label}
        </button>
    );
}

export default CommandButton;