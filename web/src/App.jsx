import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { UserIcon, CalendarDaysIcon, ClockIcon, BanknotesIcon, BriefcaseIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Login from './pages/Login';
import Employees from './pages/Employees';
import Leaves from './pages/Leaves';
import Attendance from './pages/Attendance';
import Payroll from './pages/Payroll';
import Recruitment from './pages/Recruitment';

function Sidebar({ open, setOpen }) {
  const location = useLocation();
  const navItems = [
    { to: '/', label: 'Dashboard', icon: <span className="text-lg font-bold">🏠</span> },
    { to: '/employees', label: 'Employees', icon: <UserIcon className="w-5 h-5" /> },
    { to: '/leaves', label: 'Leaves', icon: <CalendarDaysIcon className="w-5 h-5" /> },
    { to: '/attendance', label: 'Attendance', icon: <ClockIcon className="w-5 h-5" /> },
    { to: '/payroll', label: 'Payroll', icon: <BanknotesIcon className="w-5 h-5" /> },
    { to: '/recruitment', label: 'Recruitment', icon: <BriefcaseIcon className="w-5 h-5" /> },
  ];
  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-base-100 border-r border-base-300 p-6 min-h-screen sticky top-0">
        <div className="mb-10 flex items-center gap-2">
          <span className="text-2xl font-extrabold text-primary">HRMS</span>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`btn btn-ghost justify-start ${location.pathname === item.to ? 'bg-primary/10 text-primary font-bold' : ''}`}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
      {/* Mobile Drawer */}
      <div className={`fixed inset-0 z-40 bg-black/30 transition-opacity ${open ? 'block md:hidden' : 'hidden'}`}
        onClick={() => setOpen(false)} />
      <aside className={`fixed top-0 left-0 z-50 w-64 h-full bg-base-100 border-r border-base-300 p-6 transition-transform duration-200 ${open ? 'translate-x-0' : '-translate-x-full'} md:hidden`}
        aria-label="Sidebar">
        <div className="flex items-center justify-between mb-10">
          <span className="text-2xl font-extrabold text-primary">HRMS</span>
          <button className="btn btn-ghost btn-sm" onClick={() => setOpen(false)}><XMarkIcon className="w-6 h-6" /></button>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`btn btn-ghost justify-start ${location.pathname === item.to ? 'bg-primary/10 text-primary font-bold' : ''}`}
              onClick={() => setOpen(false)}
            >
              <span className="mr-2">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}

function Dashboard() {
  return (
    <div className="flex-1 flex flex-col min-h-screen">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow sticky top-0 z-10">
        <div className="flex-1">
          <span className="text-xl font-bold text-primary">Dashboard</span>
        </div>
        <div className="flex-none">
          <Link to="/login" className="btn btn-ghost">Logout</Link>
        </div>
      </div>
      {/* Cards Grid */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-7xl px-2 sm:px-4 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow">
              <div className="card-body flex flex-row items-center gap-4">
                <UserIcon className="w-10 h-10 text-primary" />
                <div>
                  <h2 className="card-title">Employees</h2>
                  <p className="text-base-content/70">Manage employee records and details.</p>
                </div>
              </div>
              <div className="card-actions justify-end px-6 pb-4">
                <Link to="/employees" className="btn btn-primary btn-sm">View</Link>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow">
              <div className="card-body flex flex-row items-center gap-4">
                <CalendarDaysIcon className="w-10 h-10 text-primary" />
                <div>
                  <h2 className="card-title">Leaves</h2>
                  <p className="text-base-content/70">Review and approve leave requests.</p>
                </div>
              </div>
              <div className="card-actions justify-end px-6 pb-4">
                <Link to="/leaves" className="btn btn-primary btn-sm">View</Link>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow">
              <div className="card-body flex flex-row items-center gap-4">
                <ClockIcon className="w-10 h-10 text-primary" />
                <div>
                  <h2 className="card-title">Attendance</h2>
                  <p className="text-base-content/70">Track employee attendance and logs.</p>
                </div>
              </div>
              <div className="card-actions justify-end px-6 pb-4">
                <Link to="/attendance" className="btn btn-primary btn-sm">View</Link>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow">
              <div className="card-body flex flex-row items-center gap-4">
                <BanknotesIcon className="w-10 h-10 text-primary" />
                <div>
                  <h2 className="card-title">Payroll</h2>
                  <p className="text-base-content/70">Manage payroll and payslips.</p>
                </div>
              </div>
              <div className="card-actions justify-end px-6 pb-4">
                <Link to="/payroll" className="btn btn-primary btn-sm">View</Link>
              </div>
            </div>
            <div className="card bg-base-100 shadow-xl border border-base-300 hover:shadow-2xl transition-shadow">
              <div className="card-body flex flex-row items-center gap-4">
                <BriefcaseIcon className="w-10 h-10 text-primary" />
                <div>
                  <h2 className="card-title">Recruitment</h2>
                  <p className="text-base-content/70">Handle job postings and applications.</p>
                </div>
              </div>
              <div className="card-actions justify-end px-6 pb-4">
                <Link to="/recruitment" className="btn btn-primary btn-sm">View</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen flex bg-base-200">
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Top Navbar for mobile */}
        <div className="md:hidden navbar bg-base-100 shadow sticky top-0 z-20">
          <div className="flex-none">
            <button className="btn btn-ghost btn-square" onClick={() => setSidebarOpen(true)}>
              <Bars3Icon className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1">
            <span className="text-xl font-bold text-primary">HRMS</span>
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
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/*" element={<Layout />} />
      </Routes>
    </Router>
  );
}

export default App;
