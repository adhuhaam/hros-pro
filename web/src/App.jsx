import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { Bars3Icon } from '@heroicons/react/24/outline';
import Login from './pages/Login';
import AgentLogin from './pages/AgentLogin';
import Employees from './pages/Employees';
import Leaves from './pages/Leaves';
import Attendance from './pages/Attendance';
import Payroll from './pages/Payroll';
import Recruitment from './pages/Recruitment';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import { HeaderProvider } from './context/HeaderContext';
import { ThemeProvider } from './context/ThemeContext';

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    // Check localStorage for saved preference, default to expanded
    const saved = localStorage.getItem('sidebarCollapsed');
    return saved ? JSON.parse(saved) : false;
  });

  // Save sidebar collapsed state to localStorage
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  return (
    <div className="min-h-screen flex bg-base-100">
      <Sidebar 
        open={sidebarOpen} 
        setOpen={setSidebarOpen}
        isCollapsed={sidebarCollapsed}
        setIsCollapsed={setSidebarCollapsed}
      />
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Universal Header */}
        <div className="flex items-center bg-base-100/95 backdrop-blur-xl shadow-lg sticky top-0 z-20 border-b border-base-300">
          {/* Mobile hamburger menu */}
          <div className="md:hidden p-4">
            <button className="btn btn-ghost btn-square" onClick={() => setSidebarOpen(true)}>
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
          
          {/* Header content */}
          <div className="flex-1">
            <Header />
          </div>
        </div>
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/leaves" element={<Leaves />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/recruitment" element={<Recruitment />} />
        </Routes>
      </div>
      </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <HeaderProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/agent-login" element={<AgentLogin />} />
            <Route path="/*" element={<Layout />} />
          </Routes>
        </Router>
      </HeaderProvider>
    </ThemeProvider>
  );
}

export default App;
