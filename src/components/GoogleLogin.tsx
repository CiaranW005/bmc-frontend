import { useEffect, useRef, useState } from "react";

interface GoogleCredentialResponse {
    credential: string;
}

interface GoogleLoginProps {
    onSuccess: () => void
}

export default function GoogleLogin({ onSuccess }: GoogleLoginProps) {
    const buttonRef = useRef<HTMLDivElement>(null);
    const [error, setError] = useState("")

    useEffect(() => {
        const intialise = () => {
            if (!window.google || !buttonRef.current) return;

            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
                callback: async (response: GoogleCredentialResponse) => {
                    setError("")

                    try {
                        const result = await fetch("/api/auth/google", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                            },
                            credentials: "include",
                            body: JSON.stringify({
                                credential: response.credential
                            })
                        });

                        if (!result.ok) {
                            if (result.status === 401) {
                                setError("Your Google account is not authorised to access this BMC.")
                            } else {
                                setError("Authentication failed. Please try again")
                            }
                            return;
                        }

                        onSuccess();
                    } catch (err) {
                        console.error(err)
                        setError("Unable to connect to the authentication sevrer.")
                    }
                }
            });

            window.google.accounts.id.renderButton(buttonRef.current!, {
                theme: "outline",
                size: "large",
                text: "signin_with"
            });
        };

        if (window.google) {
            intialise();
            return;
        }

        const script = document.getElementById("google-identity-script")

        script?.addEventListener("load", intialise);

        return () => {
            script?.removeEventListener("load", intialise);
        };
    }, [onSuccess]);

    return (
        <div>
            <div ref={buttonRef}/>
            {error && <p role="alert">{error}</p>}
        </div>
    )
} 