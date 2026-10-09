import { logout } from '../api/auth'
import CommandButton from '../components/CommandButton'
import { wakePC, resetPC, powerOffPC } from '../api/bmc'

function Dashboard({ onLogout }: { onLogout: () => void}) {
  async function handleLogout() {
    await logout()
    onLogout()
  }

  return (
    <main>
      <h1>BMC</h1>

      <div>
        <CommandButton
          label='Wake PC'
          loadingLabel='Waking...'
          command={wakePC}
        />

        <CommandButton
          label='Restart PC'
          loadingLabel='Restarting...'
          command={resetPC}
          confirm='Are you sure you want to restart the PC?'
        />

        <CommandButton
          label='Shut down PC'
          loadingLabel='Shutting down...'
          command={powerOffPC}
          confirm='Are you sure you want to shut down the PC?'
        />
      </div>

      <button onClick={handleLogout}>
          Logout
      </button>
    </main>
  )
}

export default Dashboard