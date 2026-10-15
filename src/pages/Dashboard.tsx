import { logout } from '../api/auth'
import CommandButton from '../components/CommandButton'
import { wakePC, resetPC, powerOffPC } from '../api/bmc'

import "../styles/Dashboard.css"

import { useEffect, useState } from 'react'

type SystemStatus = {
    bmc: boolean;
    pc: boolean;
    lastSeen: string;
};

function Dashboard({ onLogout }: { onLogout: () => void }) {
    async function handleLogout() {
        await logout()
        onLogout()
    }

    const [status, setStatus] = useState<SystemStatus | null>(null)
    const [statusConnected, setStatusConnected] = useState(false)

    useEffect(() => {
        const events = new EventSource("/api/status/events")

        events.onmessage = (event) => {
            const next: SystemStatus = JSON.parse(event.data)
            setStatus(next)
            setStatusConnected(true)
        }

        events.onerror = () => {
            setStatusConnected(false)
        }

        return () => events.close()
    }, [])

    const bmcOnline = statusConnected && status !== null
        ? status.bmc : null
    
    const pcOnline = statusConnected && status?.bmc === true
        ? status.pc : null

    return (
        <main className="dashboard-page">
            <div className="dashboard-container">

                <header className="dashboard-header">
                    <button
                        className="logout-button"
                        onClick={handleLogout}
                        title="Logout"
                        aria-label="Logout"
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            aria-hidden="true"
                        >
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                    </button>
                </header>

                <section className="dashboard-controls-section">
                    <h2>System Controls</h2>

                    <div className="dashboard-controls">
                        <div className="command-wrapper">
                            <CommandButton
                                label="Wake PC"
                                loadingLabel="Waking..."
                                command={wakePC}
                            />
                        </div>

                        <div className="command-wrapper">
                            <CommandButton
                                label="Restart PC"
                                loadingLabel="Restarting..."
                                command={resetPC}
                                confirm="Are you sure you want to restart the PC?"
                            />
                        </div>

                        <div className="command-wrapper">
                            <CommandButton
                                label="Shut down PC"
                                loadingLabel="Shutting down..."
                                command={powerOffPC}
                                confirm="Are you sure you want to shut down the PC?"
                            />
                        </div>
                    </div>
                </section>

                <section className="dashboard-status">
                  <h2>System Status</h2>

                  <div className="status-grid">
                      <div className="status-item">
                          <span className="status-label">PC</span>
                          <span className={`status-indicator ${
                            pcOnline === true ? "online" : "offline"
                          }`}
                          >
                            <span className="status-dot" />
                              {pcOnline === null
                                ? "Unknown"
                                : pcOnline
                                    ? "Online" : "Offline"
                                }
                          </span>
                      </div>

                      <div className="status-item">
                          <span className="status-label">BMC</span>
                          <span className={`status-indicator ${
                                bmcOnline === true ? "online" : "offline"
                          }`}>
                            <span className="status-dot" />
                            {bmcOnline === null
                                ? "Connecting..."
                                : bmcOnline
                                    ? "Online" : "Offline"
                            }  
                          </span>
                      </div>
                  </div>
              </section>

            </div>
        </main>
    )
}

export default Dashboard