import React, { ReactNode } from 'react';
import Header from './Header';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        {children}
      </main>
      <footer className="py-4 text-center text-sm text-gray-500">
        <p>Weather App &copy; {new Date().getFullYear()} - Built with Next.js and Laravel</p>
      </footer>
    </div>
  );
};

export default Layout;