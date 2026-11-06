# BMC Frontend

The frontend is the browser interface for [BMC](../README.md), built with React, TypeScript, and Vite. It provides password and Google login, PC power controls, and live BMC/PC availability with wake progress.

## Implementation

`src/App.tsx` checks the existing server session on startup. Authentication state starts as `null` so the app can show a loading state before selecting the login page or dashboard.

`src/api/auth.ts` wraps password login, logout, and session checks. Authentication uses a server-managed HTTP-only cookie; application code does not store a session token.

`src/components/GoogleLogin.tsx` waits for the Google Identity script loaded by `index.html`, renders the sign-in button, and forwards the returned credential to the Oracle server. The server validates the credential and allowlist before creating the same BMC session used by password login. Local TypeScript declarations describe the portion of Google's API used by the component.

`src/components/CommandButton.tsx` handles optional confirmation, loading state, and errors. Each button disables itself while its request is pending; it does not lock the other buttons. Restart and shutdown require confirmation.

`src/api/bmc.ts` sends power commands and extracts server error messages when available. A successful HTTP response finishes the button's request; live status is delivered separately.

`src/pages/Dashboard.tsx` opens an `EventSource` connection to `/api/status/events`. Incoming snapshots update availability and wake progress. A stream error makes status unknown while the browser attempts reconnection. The connection is closed when the dashboard unmounts.

PC status is unknown when the BMC cannot report it. During a wake attempt, the dashboard shows sending, booting, or failure feedback until the PC is confirmed online. A direct command error takes priority over the wake error in the feedback area.

## Local development

The parent workflow uses Node.js 22. From this directory:

```bash
npm ci
```

Create an ignored `.env.local` file with the Google client ID:

```dotenv
VITE_GOOGLE_CLIENT_ID=your-google-client-id
```

This value is embedded during the build and must match `GOOGLE_CLIENT_ID` on the Oracle server. Configure the Google application's allowed browser origins for the address used to access the frontend.

Start the Oracle server on port 8080 in development mode, then run:

```bash
npm run dev
```

Vite proxies `/api` to `http://127.0.0.1:8080`, keeping browser requests on the frontend origin. The Oracle server still requires its password, device, and Google environment configuration; see its README.

## Build and checks

```bash
npm run build
npm run lint
```

The build runs TypeScript checking and generates static assets in `dist/`. `npm run preview` serves the built frontend locally, but the development `/api` proxy is not configured for preview; API requests need separate routing there.

## Production

The parent Oracle deployment workflow supplies `VITE_GOOGLE_CLIENT_ID`, builds this app, and copies `dist/` to `/var/www/bmc`. A web server must serve those files and route `/api` to the Oracle backend. Vite's development proxy is not included in the production bundle.

The app expects these backend routes:

- Session/password login: `/api/session`, `/api/login`, `/api/logout`.
- Google login: `/api/auth/google`.
- Commands: `/api/wake`, `/api/reset`, `/api/power_off`.
- Live status: `/api/status/events`.

