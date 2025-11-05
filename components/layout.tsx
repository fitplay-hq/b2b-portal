import { ReactNode, useState, useEffect } from "react";
import { SessionProvider } from "next-auth/react";
import NavItems from "./nav-items";
import AccountInfo from "./account-info";

interface LayoutProps {
  children: ReactNode;
  isClient: boolean;
}

export default function Layout({ children, isClient }: LayoutProps) {
  // Initialize sidebar state directly from localStorage to prevent flicker
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Only access localStorage on client side
    if (typeof window !== 'undefined') {
      const savedSidebarState = localStorage.getItem('sidebarOpen');
      return savedSidebarState !== null ? JSON.parse(savedSidebarState) : true;
    }
    return true; // Default for server-side rendering
  });
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024; // lg breakpoint
      const wasMobile = isMobile;
      setIsMobile(mobile);
      
      // Auto-collapse sidebar when transitioning to mobile
      if (mobile && !wasMobile) {
        setSidebarOpen(false);
        localStorage.setItem('sidebarOpen', JSON.stringify(false));
        document.documentElement.style.setProperty('--sidebar-open', '0');
      }
      
      // On desktop, restore sidebar if it was collapsed due to mobile
      if (!mobile && wasMobile) {
        const savedState = localStorage.getItem('sidebarOpen');
        const shouldOpen = savedState !== null ? JSON.parse(savedState) : true;
        setSidebarOpen(shouldOpen);
        document.documentElement.style.setProperty('--sidebar-open', shouldOpen ? '1' : '0');
      }
    };

    handleResize(); // Check initial size
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile]);

  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    // Save to localStorage to persist across page navigation
    localStorage.setItem('sidebarOpen', JSON.stringify(newState));
    
    // Immediately update CSS custom property to prevent flicker
    document.documentElement.style.setProperty('--sidebar-open', newState ? '1' : '0');
  };

  // Set CSS custom property on initial load
  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-open', sidebarOpen ? '1' : '0');
  }, [sidebarOpen]);

  return (
    <SessionProvider>
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        {/* Sidebar Overlay for mobile - positioned to not interfere with content visibility */}
        {sidebarOpen && isMobile && (
          <div 
            className="fixed inset-0 bg-transparent z-25"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Professional Sidebar */}
        <aside 
          className={`
            ${isMobile 
              ? `fixed top-0 left-0 z-40 h-screen transform transition-transform duration-300 ${
                  sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`
              : `relative z-10 h-screen transition-all duration-300 ${
                  sidebarOpen ? 'w-64' : 'w-16'
                }`
            }
            flex flex-col flex-shrink-0 bg-white border-r border-gray-200 shadow-sm
          `}
          suppressHydrationWarning={true}
          style={isMobile ? { width: '16rem' } : {}}
        >
          <div className="flex flex-col h-full"
            suppressHydrationWarning={true}
          >
            {/* Logo Section */}
            
            <div className={`border-b border-gray-100 transition-all duration-300 ${(sidebarOpen || isMobile) ? 'p-6' : 'p-3'}`}>
              <div className={`flex items-center ${(sidebarOpen || isMobile) ? 'gap-3' : 'justify-center'}`}>
                <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center shadow-sm">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                {(sidebarOpen || isMobile) && (
                  <div className="overflow-hidden">
                    <h1 className="font-semibold text-gray-900 truncate">Fitplay B2B</h1>
                    <p className="text-xs text-gray-500 truncate">
                      {isClient ? "Client Portal" : "Admin Dashboard"}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation - Scrollable when needed */}
            <div className={`flex-1 overflow-y-auto sidebar-scrollbar transition-all duration-300 ${(sidebarOpen || isMobile) ? 'p-4 pt-6' : 'p-2 pt-4'} min-h-0`}>
              <NavItems isClient={isClient} isCollapsed={!sidebarOpen && !isMobile} />
            </div>

            {/* User Profile Section */}
            <div className={`border-t border-gray-100 transition-all duration-300 ${(sidebarOpen || isMobile) ? 'p-4' : 'p-2'}`}>
              <AccountInfo isCollapsed={!sidebarOpen && !isMobile} />
            </div>
          </div>
        </aside>

        {/* Main Content Area - Fixed Height with Internal Scrolling */}
        <div className="flex-1 flex flex-col h-screen bg-gray-50 overflow-hidden min-w-0 relative z-10">
          {/* Professional Navbar - Fixed at Top */}
          <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm relative z-10 flex-shrink-0">
            <div className="flex items-center">
              {/* Sidebar Toggle Button */}
              <button
                onClick={toggleSidebar}
                className="p-2 text-gray-400 hover:text-gray-700 transition-all duration-200 rounded-lg hover:bg-gray-50 hover:shadow-sm"
                suppressHydrationWarning={true}
                aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobile ? (
                    // Mobile hamburger/X icon
                    sidebarOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    )
                  ) : (
                    // Desktop sidebar toggle icons
                    sidebarOpen ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                    )
                  )}
                </svg>
              </button>
            </div>
            
            <div className="flex items-center">
              <div className="text-sm text-gray-500">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </div>
            </div>
          </header>

          {/* Main Content - Scrollable Area */}
          <main className="flex-1 bg-gray-50 overflow-y-auto">
            <div className="p-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
