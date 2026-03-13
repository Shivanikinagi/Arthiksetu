import { useState } from 'react'
import './index.css'
import Dashboard from './pages/Dashboard'
import Proposer from './pages/Proposer'
import Permissions from './pages/Permissions'
import AgentManager from './pages/AgentManager'
import Simulator from './pages/Simulator'
import { useContracts } from './hooks/useContracts'

const NAV_ITEMS = [
  { id: 'agents', label: '1. Agent Licenses' },
  { id: 'permissions', label: '2. ENS Policy' },
  { id: 'simulate', label: '3. Simulate' },
  { id: 'propose', label: '4. Execute' },
  { id: 'dashboard', label: '5. Audit' },
]

export default function App() {
  const [activePage, setActivePage] = useState('agents')
  const { connected, connectMetaMask, account, isLive } = useContracts()

  const renderPage = () => {
    switch (activePage) {
      case 'agents': return <AgentManager />
      case 'permissions': return <Permissions />
      case 'simulate': return <Simulator />
      case 'propose': return <Proposer />
      case 'dashboard': return <Dashboard />
      default: return <AgentManager />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div 
                className="flex-shrink-0 flex items-center cursor-pointer" 
                onClick={() => setActivePage('agents')}
              >
                <span className="text-xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  DarkAgent
                </span>
              </div>
              <div className="hidden sm:ml-8 sm:flex sm:space-x-6">
                {NAV_ITEMS.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActivePage(item.id)}
                    className={`${
                      activePage === item.id
                        ? 'border-indigo-500 text-indigo-700 font-bold'
                        : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 font-medium'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm transition-colors`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center">
              {connected ? (
                <div className="flex items-center space-x-3 bg-gray-100 px-3 py-1.5 rounded-md border border-gray-200">
                  <span className={`h-2.5 w-2.5 rounded-full ${isLive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.8)]' : 'bg-yellow-400'}`}></span>
                  <span className="text-sm text-gray-700 font-mono tracking-tight">
                    {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connected'}
                  </span>
                </div>
              ) : (
                <button 
                  onClick={connectMetaMask}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-md text-sm font-semibold transition-all shadow-sm"
                >
                  Connect Wallet
                </button>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto">
        {renderPage()}
      </main>
    </div>
  )
}
