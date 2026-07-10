
import React from 'react';
import { Sidebar } from './Sidebar';
import { useAuth } from '@/contexts/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
  hideNav?: boolean;
}

export const Layout: React.FC<LayoutProps> = ({ children, hideNav = false }) => {
  const { isAuthenticated } = useAuth();
  
  return (
    <div className="min-h-screen bg-background">
      {isAuthenticated && !hideNav && <Sidebar />}
      <main className={`flex min-h-screen flex-col ${isAuthenticated && !hideNav ? 'md:pl-64 pl-[70px]' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
