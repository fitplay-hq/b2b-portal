import { ReactNode, useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import NavItems from "./nav-items";
import AccountInfo from "./account-info";

interface LayoutProps {
  children: ReactNode;
  isClient: boolean;
}

export default function Layout({ children, isClient }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      setIsMobile(mobile);
      // On mobile, we use overlay, so don't auto-close
      // On desktop, we use collapsible sidebar
    };

    handleResize(); // Check initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    console.log('toggleSidebar called, current state:', sidebarOpen);
    setSidebarOpen(!sidebarOpen);
  };

  // Debug: Monitor sidebar state changes
  useEffect(() => {
    console.log('Sidebar state changed to:', sidebarOpen);
  }, [sidebarOpen]);

  return (
    <SessionProvider>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar Overlay for mobile */}
        {isMobile && sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Professional Sidebar */}
        <div className={`
          ${isMobile 
            ? `fixed left-0 top-0 h-full z-30 ${sidebarOpen ? 'w-64' : 'w-0'}` 
            : `flex-shrink-0 ${sidebarOpen ? 'w-64' : 'w-16'}`
          } 
          bg-white border-r border-gray-200 shadow-sm transition-all duration-300 ease-in-out overflow-hidden
        `}>
          <div className={`flex flex-col h-full min-h-0 ${isMobile ? 'w-64' : sidebarOpen ? 'w-64' : 'w-16'} transition-all duration-300`}>
            {/* Logo Section */}
            <div className={`border-b border-gray-100 transition-all duration-300 ${sidebarOpen || isMobile ? 'p-6' : 'p-3'}`}>
              <div className={`flex items-center ${sidebarOpen || isMobile ? 'gap-3' : 'justify-center'}`}>
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                {(sidebarOpen || isMobile) && (
                  <div>
                    <h1 className="font-semibold text-gray-900">Fitplay B2B</h1>
                    <p className="text-xs text-gray-500">
                      {isClient ? "Client Portal" : "Admin Dashboard"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation */}
            <div className={`flex-1 overflow-y-auto sidebar-scrollbar transition-all duration-300 ${sidebarOpen || isMobile ? 'p-4 pt-6' : 'p-2 pt-4'}`}>
              <NavItems isClient={isClient} isCollapsed={!sidebarOpen && !isMobile} />
            </div>

            {/* User Profile Section */}
            <div className={`border-t border-gray-100 transition-all duration-300 ${sidebarOpen || isMobile ? 'p-4' : 'p-2'}`}>
              <AccountInfo isCollapsed={!sidebarOpen && !isMobile} />
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col transition-all duration-300 ease-in-out bg-gray-50">
          {/* Professional Navbar */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm relative z-10">
            <div className="flex items-center gap-4 flex-1">
              {/* Sidebar Toggle Button */}
              <button
                onClick={toggleSidebar}
                className="p-2 text-gray-400 hover:text-gray-700 transition-all duration-200 rounded-lg hover:bg-gray-50 hover:shadow-sm"
                suppressHydrationWarning={true}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {sidebarOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
              
              <div className="relative max-w-md w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
                  suppressHydrationWarning={true}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative group">
                <button 
                  className="relative p-2 text-gray-400 hover:text-gray-700 transition-all duration-200 rounded-lg hover:bg-gray-50 hover:shadow-sm"
                  suppressHydrationWarning={true}
                >
                  {/* Bell Icon */}
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.73 21a2 2 0 0 1-3.46 0" />
                  </svg>
                  {/* Active notification indicator */}
                  <span className="absolute -top-0.5 -right-0.5 flex h-4 w-4 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500 text-white text-xs font-medium items-center justify-center">3</span>
                  </span>
                </button>
                {/* Hover tooltip */}
                <div className="absolute top-full right-0 mt-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  3 new notifications
                  <div className="absolute bottom-full right-3 border-4 border-transparent border-b-gray-900"></div>
                </div>
              </div>
              
              {/* Settings */}
              <div className="relative group">
                <button 
                  className="p-2 text-gray-400 hover:text-gray-700 transition-all duration-200 rounded-lg hover:bg-gray-50 hover:shadow-sm"
                  suppressHydrationWarning={true}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <div className="absolute top-full right-0 mt-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  Settings
                  <div className="absolute bottom-full right-3 border-4 border-transparent border-b-gray-900"></div>
                </div>
              </div>
              
              {/* Profile */}
              <div className="relative group">
                <button 
                  className="p-2 text-gray-400 hover:text-gray-700 transition-all duration-200 rounded-lg hover:bg-gray-50 hover:shadow-sm"
                  suppressHydrationWarning={true}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </button>
                <div className="absolute top-full right-0 mt-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-10">
                  Profile
                  <div className="absolute bottom-full right-3 border-4 border-transparent border-b-gray-900"></div>
                </div>
              </div>
              
              <div className="h-6 w-px bg-gray-200 mx-2"></div>
              
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 bg-gray-50">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
