import { useEffect, useState } from "react"
import { checkSession } from "./api/auth.ts"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"


function App() {
  // null means the session check is still running.
  // Wait for the result before showing the login page or dashboard.
  const [authenticated, setAuthenticated] = useState<boolean | null>(null)

  useEffect(() => {
    checkSession()
    .then(() => setAuthenticated(true))
    .catch(() => setAuthenticated(false))
  }, [])

  if (authenticated === null) {
    return <p>Loading...</p>
  }

  if (!authenticated) {
    return <Login onLogin={() => setAuthenticated(true)} />
  }

  return <Dashboard onLogout={() => setAuthenticated(false)} />
}

export default App