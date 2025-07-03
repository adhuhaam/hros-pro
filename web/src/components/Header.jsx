import { Link } from 'react-router-dom';
import { useHeader } from '../context/HeaderContext';
import { useTheme } from '../context/ThemeContext';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';

export default function Header() {
  const { headerState } = useHeader();
  const { isDarkMode, toggleTheme } = useTheme();
  
  return (
    <div className="navbar bg-base-100/95 backdrop-blur-xl shadow-lg sticky top-0 z-10 border-b border-base-300">
      <div className="flex-1">
        <span className="text-xl font-bold text-gradient">{headerState.title}</span>
      </div>
      <div className="flex-none flex items-center gap-4">
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="btn btn-ghost btn-circle btn-sm transition-all duration-200 hover:scale-110"
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDarkMode ? (
            <SunIcon className="w-5 h-5 text-yellow-400" />
          ) : (
            <MoonIcon className="w-5 h-5 text-blue-600" />
          )}
        </button>
        
        {headerState.showLogout && (
          <Link to="/login" className="btn btn-ghost btn-modern">
            Logout
          </Link>
        )}
      </div>
    </div>
  );
} 