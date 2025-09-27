import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Chatbot from './Chatbot';

const Layout: React.FC = () => {
  const location = useLocation();
  const isQnAPage = location.pathname === '/qna';
  
  return (
    <div className="flex h-screen bg-[var(--background)] text-[var(--text-secondary)]">
      <Navbar />
      <main className={`flex-1 ${isQnAPage ? 'p-0 overflow-hidden' : 'p-8 overflow-y-auto'}`}>
        <Outlet />
      </main>
      <Chatbot />
    </div>
  );
};

export default Layout;