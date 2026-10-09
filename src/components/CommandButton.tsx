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

    async function handleClick() {
        if (confirm && !window.confirm(confirm)) {
            return;
        }

        setLoading(true);

        try {
            await command();
        } catch (error) {
            console.error(error);
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