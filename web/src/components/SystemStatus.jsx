import { useState, useEffect } from 'react';
import { SignalIcon, SignalSlashIcon } from '@heroicons/react/24/outline';

function SystemStatus({ isCollapsed = false }) {
  const [status, setStatus] = useState({
    backend: 'checking',
    database: 'checking',
    frontend: 'online'
  });

  useEffect(() => {
    const checkBackendStatus = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/health', {
          method: 'GET',
          signal: AbortSignal.timeout(3000) // 3 second timeout
        });
        if (response.ok) {
          setStatus(prev => ({ ...prev, backend: 'online' }));
        } else {
          setStatus(prev => ({ ...prev, backend: 'error' }));
        }
      } catch (error) {
        setStatus(prev => ({ ...prev, backend: 'offline' }));
      }
    };

    const checkDatabaseStatus = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/dashboard/employee-status', {
          method: 'GET',
          signal: AbortSignal.timeout(3000)
        });
        if (response.ok) {
          setStatus(prev => ({ ...prev, database: 'online' }));
        } else {
          setStatus(prev => ({ ...prev, database: 'error' }));
        }
      } catch (error) {
        setStatus(prev => ({ ...prev, database: 'offline' }));
      }
    };

    // Initial check
    checkBackendStatus();
    checkDatabaseStatus();

    // Set up periodic checks every 30 seconds
    const interval = setInterval(() => {
      checkBackendStatus();
      checkDatabaseStatus();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'online': return 'status-online';
      case 'offline': return 'status-offline';
      case 'error': return 'status-warning';
      case 'checking': return 'status-checking';
      default: return 'text-base-content';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'online': return <SignalIcon className="w-4 h-4 animate-pulse-slow" />;
      case 'offline': 
      case 'error': 
      case 'checking': return <SignalSlashIcon className="w-4 h-4" />;
      default: return <SignalIcon className="w-4 h-4" />;
    }
  };

  const getStatusGlow = (status) => {
    switch (status) {
      case 'online': return 'glow-success';
      case 'offline': return 'glow-error';
      case 'error': return 'glow-warning';
      case 'checking': return 'glow-primary';
      default: return '';
    }
  };

  // Check if any service is offline or has error
  const hasIssues = status.backend === 'offline' || status.backend === 'error' || 
                   status.database === 'offline' || status.database === 'error';

  if (isCollapsed) {
    // Compact version for collapsed sidebar
    return (
      <div className={`flex flex-col items-center gap-2 ${hasIssues ? 'text-error' : 'text-success'}`}>
        <div className={`w-3 h-3 rounded-full ${hasIssues ? 'bg-error animate-pulse' : 'bg-success animate-pulse-slow'}`}></div>
        <span className="text-xs font-bold">STATUS</span>
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 text-xs bg-base-200/50 px-3 py-2 rounded-lg backdrop-blur-sm border border-base-300 ${hasIssues ? 'border-error/50 bg-error/10' : ''}`}>
      <div className="flex items-center justify-between">
        <span className={`font-semibold ${hasIssues ? 'text-error' : 'text-success'}`}>
          System Status
        </span>
        <div className={`w-2 h-2 rounded-full ${hasIssues ? 'bg-error animate-pulse' : 'bg-success animate-pulse-slow'}`}></div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-1 ${getStatusGlow(status.frontend)}`}>
          {getStatusIcon(status.frontend)}
          <span className={`${getStatusColor(status.frontend)} font-medium`}>FE</span>
        </div>
        <div className="w-px h-3 bg-base-300"></div>
        <div className={`flex items-center gap-1 ${getStatusGlow(status.backend)}`}>
          {getStatusIcon(status.backend)}
          <span className={`${getStatusColor(status.backend)} font-medium`}>BE</span>
        </div>
        <div className="w-px h-3 bg-base-300"></div>
        <div className={`flex items-center gap-1 ${getStatusGlow(status.database)}`}>
          {getStatusIcon(status.database)}
          <span className={`${getStatusColor(status.database)} font-medium`}>DB</span>
        </div>
      </div>
    </div>
  );
}

export default SystemStatus; 