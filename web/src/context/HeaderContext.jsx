import { createContext, useContext, useState, useCallback } from 'react';

const HeaderContext = createContext();

export function HeaderProvider({ children }) {
  const [headerState, setHeaderState] = useState({
    title: 'Dashboard',
    showLogout: true
  });

  const updateHeader = useCallback((title, showLogout = true) => {
    setHeaderState({ title, showLogout });
  }, []);

  return (
    <HeaderContext.Provider value={{ headerState, updateHeader }}>
      {children}
    </HeaderContext.Provider>
  );
}

export function useHeader() {
  const context = useContext(HeaderContext);
  if (!context) {
    throw new Error('useHeader must be used within a HeaderProvider');
  }
  return context;
} 