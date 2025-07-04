import { Link, useLocation } from 'react-router-dom';
import { 
  UserIcon, 
  CalendarDaysIcon, 
  ClockIcon, 
  BanknotesIcon, 
  BriefcaseIcon, 
  Bars3Icon, 
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  Cog6ToothIcon,
  ChevronDownIcon,
  UserGroupIcon,
  ShieldCheckIcon,
  SwatchIcon
} from '@heroicons/react/24/outline';
import { useState, useEffect, useRef } from 'react';
import SystemStatus from './SystemStatus';

function Sidebar({ open, setOpen, isCollapsed, setIsCollapsed }) {
  const location = useLocation();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const settingsRef = useRef(null);

  // Close settings dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (settingsRef.current && !settingsRef.current.contains(event.target)) {
        setSettingsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const navItems = [
    { to: '/', label: 'Dashboard', icon: <span className="text-lg font-bold">🏠</span> },
    { to: '/employees', label: 'Employees', icon: <UserIcon className="w-5 h-5" /> },
    { to: '/leaves', label: 'Leaves', icon: <CalendarDaysIcon className="w-5 h-5" /> },
    { to: '/attendance', label: 'Attendance', icon: <ClockIcon className="w-5 h-5" /> },
    { to: '/payroll', label: 'Payroll', icon: <BanknotesIcon className="w-5 h-5" /> },
    { to: '/recruitment', label: 'Recruitment', icon: <BriefcaseIcon className="w-5 h-5" /> },
  ];

  const settingsItems = [
    { to: '/settings', label: 'General Settings', icon: <Cog6ToothIcon className="w-4 h-4" /> },
    { to: '/settings?section=roles', label: 'Roles Management', icon: <UserGroupIcon className="w-4 h-4" /> },
    { to: '/settings?section=access', label: 'Access Control', icon: <ShieldCheckIcon className="w-4 h-4" /> },
    { to: '/settings?section=theme', label: 'Theme Settings', icon: <SwatchIcon className="w-4 h-4" /> },
  ];

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`hidden md:flex md:flex-col bg-base-100/95 backdrop-blur-xl border-r border-base-300 p-6 min-h-screen sticky top-0 shadow-xl transition-all duration-300 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}>
        {/* Header */}
        <div className={`mb-10 flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-focus rounded-xl flex items-center justify-center shadow-glow flex-shrink-0">
            <span className="text-2xl font-extrabold text-white">H</span>
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <span className="text-2xl font-extrabold text-gradient">HRMS</span>
              <p className="text-xs text-base-content/60">Human Resources</p>
            </div>
          )}
        </div>

        {/* Collapse Toggle Button */}
        <button
          onClick={toggleCollapse}
          className="btn btn-ghost btn-sm btn-circle absolute top-6 right-2 hover:bg-base-200/80 transition-all duration-200"
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          {isCollapsed ? (
            <ChevronRightIcon className="w-4 h-4" />
          ) : (
            <ChevronLeftIcon className="w-4 h-4" />
          )}
        </button>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`btn btn-ghost transition-all duration-300 group relative ${
                isCollapsed ? 'justify-center px-2' : 'justify-start'
              } ${
                location.pathname === item.to 
                  ? 'bg-primary/20 text-primary border border-primary/30 shadow-glow' 
                  : 'hover:bg-base-200/80 hover:shadow-md'
              }`}
              title={isCollapsed ? item.label : ''}
            >
              <span className={`transition-transform duration-300 group-hover:scale-110 ${
                isCollapsed ? '' : 'mr-3'
              } ${
                location.pathname === item.to ? 'text-primary' : 'text-base-content/70'
              }`}>
                {item.icon}
              </span>
              {!isCollapsed && (
                <span className={`font-medium ${
                  location.pathname === item.to ? 'text-primary font-semibold' : 'text-base-content'
                }`}>
                  {item.label}
                </span>
              )}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-base-200 text-base-content text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  {item.label}
                </div>
              )}
            </Link>
          ))}

          {/* Settings Dropdown */}
          <div className="relative" ref={settingsRef}>
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`btn btn-ghost transition-all duration-300 group relative w-full ${
                isCollapsed ? 'justify-center px-2' : 'justify-between'
              } ${
                location.pathname.startsWith('/settings')
                  ? 'bg-primary/20 text-primary border border-primary/30 shadow-glow' 
                  : 'hover:bg-base-200/80 hover:shadow-md'
              }`}
              title={isCollapsed ? 'Settings' : ''}
            >
              <div className="flex items-center">
                <span className={`transition-transform duration-300 group-hover:scale-110 ${
                  isCollapsed ? '' : 'mr-3'
                } ${
                  location.pathname.startsWith('/settings') ? 'text-primary' : 'text-base-content/70'
                }`}>
                  <Cog6ToothIcon className="w-5 h-5" />
                </span>
                {!isCollapsed && (
                  <span className={`font-medium ${
                    location.pathname.startsWith('/settings') ? 'text-primary font-semibold' : 'text-base-content'
                  }`}>
                    Settings
                  </span>
                )}
              </div>
              
              {!isCollapsed && (
                <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${
                  settingsOpen ? 'rotate-180' : ''
                } ${
                  location.pathname.startsWith('/settings') ? 'text-primary' : 'text-base-content/70'
                }`} />
              )}
              
              {/* Tooltip for collapsed state */}
              {isCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-base-200 text-base-content text-sm rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                  Settings
                </div>
              )}
            </button>

            {/* Settings Dropdown Menu */}
            {settingsOpen && !isCollapsed && (
              <div className="absolute left-0 right-0 top-full mt-1 bg-base-100 rounded-lg border border-base-300 shadow-lg z-50">
                <div className="p-2 space-y-1">
                  {settingsItems.map((item, index) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-sm ${
                        location.pathname === item.to 
                          ? 'bg-primary/20 text-primary' 
                          : 'hover:bg-base-200/80 text-base-content/70 hover:text-base-content'
                      }`}
                      onClick={() => setSettingsOpen(false)}
                    >
                      <span className={`${
                        location.pathname === item.to ? 'text-primary' : 'text-base-content/60'
                      }`}>
                        {item.icon}
                      </span>
                      <span className={`font-medium ${
                        location.pathname === item.to ? 'text-primary' : 'text-base-content'
                      }`}>
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>
        
        {/* Sidebar Footer with System Status */}
        <div className={`mt-auto pt-6 border-t border-base-300 ${isCollapsed ? 'text-center' : ''}`}>
          <SystemStatus isCollapsed={isCollapsed} />
          {!isCollapsed && (
            <div className="text-xs text-base-content/50 text-center mt-3">
              <p>HRMS v1.0</p>
              <p className="mt-1">Developed by adhuhaam & Dr J</p>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Drawer */}
      <div 
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
          open ? 'block md:hidden' : 'hidden'
        }`}
        onClick={() => setOpen(false)} 
      />
      <aside 
        className={`fixed top-0 left-0 z-50 w-64 h-full bg-base-100/95 backdrop-blur-xl border-r border-base-300 p-6 transition-transform duration-300 shadow-2xl ${
          open ? 'translate-x-0' : '-translate-x-full'
        } md:hidden`}
        aria-label="Sidebar"
      >
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-focus rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-2xl font-extrabold text-white">H</span>
            </div>
            <div>
              <span className="text-2xl font-extrabold text-gradient">HRMS</span>
              <p className="text-xs text-base-content/60">Human Resources</p>
            </div>
          </div>
          <button 
            className="btn btn-ghost btn-sm rounded-full hover:bg-base-200/80" 
            onClick={() => setOpen(false)}
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>
        <nav className="flex flex-col gap-2">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              className={`btn btn-ghost justify-start transition-all duration-300 group ${
                location.pathname === item.to 
                  ? 'bg-primary/20 text-primary border border-primary/30 shadow-glow' 
                  : 'hover:bg-base-200/80 hover:shadow-md'
              }`}
              onClick={() => setOpen(false)}
            >
              <span className={`mr-3 transition-transform duration-300 group-hover:scale-110 ${
                location.pathname === item.to ? 'text-primary' : 'text-base-content/70'
              }`}>
                {item.icon}
              </span>
              <span className={`font-medium ${
                location.pathname === item.to ? 'text-primary font-semibold' : 'text-base-content'
              }`}>
                {item.label}
              </span>
            </Link>
          ))}

          {/* Mobile Settings Dropdown */}
          <div className="relative">
            <button
              onClick={() => setSettingsOpen(!settingsOpen)}
              className={`btn btn-ghost justify-between w-full transition-all duration-300 group ${
                location.pathname.startsWith('/settings')
                  ? 'bg-primary/20 text-primary border border-primary/30 shadow-glow' 
                  : 'hover:bg-base-200/80 hover:shadow-md'
              }`}
            >
              <div className="flex items-center">
                <span className={`mr-3 transition-transform duration-300 group-hover:scale-110 ${
                  location.pathname.startsWith('/settings') ? 'text-primary' : 'text-base-content/70'
                }`}>
                  <Cog6ToothIcon className="w-5 h-5" />
                </span>
                <span className={`font-medium ${
                  location.pathname.startsWith('/settings') ? 'text-primary font-semibold' : 'text-base-content'
                }`}>
                  Settings
                </span>
              </div>
              <ChevronDownIcon className={`w-4 h-4 transition-transform duration-200 ${
                settingsOpen ? 'rotate-180' : ''
              } ${
                location.pathname.startsWith('/settings') ? 'text-primary' : 'text-base-content/70'
              }`} />
            </button>

            {/* Mobile Settings Dropdown Menu */}
            {settingsOpen && (
              <div className="mt-2 ml-4 bg-base-200/50 rounded-lg border border-base-300">
                <div className="p-2 space-y-1">
                  {settingsItems.map((item) => (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-sm ${
                        location.pathname === item.to 
                          ? 'bg-primary/20 text-primary' 
                          : 'hover:bg-base-200/80 text-base-content/70 hover:text-base-content'
                      }`}
                      onClick={() => {
                        setSettingsOpen(false);
                        setOpen(false);
                      }}
                    >
                      <span className={`${
                        location.pathname === item.to ? 'text-primary' : 'text-base-content/60'
                      }`}>
                        {item.icon}
                      </span>
                      <span className={`font-medium ${
                        location.pathname === item.to ? 'text-primary' : 'text-base-content'
                      }`}>
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </nav>
        
        {/* Mobile Sidebar Footer with System Status */}
        <div className="mt-auto pt-6 border-t border-base-300">
          <SystemStatus isCollapsed={false} />
          <div className="text-xs text-base-content/50 text-center mt-3">
            <p>HRMS v1.0</p>
            <p className="mt-1">Powered by React & Node.js</p>
          </div>
        </div>
      </aside>
    </>
  );
}

export default Sidebar; 