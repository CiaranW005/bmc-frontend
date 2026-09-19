import { useState } from "react";
import { wakePC } from "../api/bmc";

function WakeButton() {
    const [loading, setLoading] = useState(false)

    async function handleWake() {
        setLoading(true)

        try {
            await wakePC()
        } finally {
            setLoading(false)
        }
    }

    return (
        <button onClick={handleWake} disabled={loading}>
            {loading ? "Waking..." : "Wake PC"}
        </button>
    )
}

export default WakeButton