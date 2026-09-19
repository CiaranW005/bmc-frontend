import { useEffect, useState } from "react"
import { checkSession } from "./api/auth.ts"

import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"


function App() {
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