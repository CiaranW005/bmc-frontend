import { logout } from '../api/auth'
import WakeButton from '../components/WakeButton'

function Dashboard({ onLogout }: { onLogout: () => void}) {
  async function handleLogout() {
    await logout()
    onLogout()
  }

  return (
    <main>
      <h1>BMC</h1>

      <WakeButton />

      <button onClick={handleLogout}>
          Logout
      </button>
    </main>
  )
}

export default Dashboard