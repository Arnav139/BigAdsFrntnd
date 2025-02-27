import React from 'react';
import { Home, GamepadIcon, CalendarClock, Key, BarChart3, BookOpen, UserPlus } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
// import { parse } from 'uuid';
import logo from '@/assets/big-ads-logo.avif';
import { Link } from 'react-router-dom';

const navigation = [
  { name: 'Overview', icon: Home, href: '/dashboard' },
  { name: 'Games', icon: GamepadIcon, href: '/dashboard/games'},
  { name: 'Events', icon: CalendarClock, href: '/dashboard/events' },
  { name: 'API Keys', icon: Key, href: '/dashboard/api-keys' },
  { name: 'Documentation', icon: BookOpen, href: '/dashboard/docs' },
  { name: 'Analytics', icon: BarChart3, href: '/dashboard/analytics' },
  { name: 'Pending Requests', icon: UserPlus, href: '/dashboard/pending-requests' },
];

const Sidebar: React.FC<{isSidebarOpen: boolean; setIsSidebarOpen: any}> = ({isSidebarOpen, setIsSidebarOpen}) => {
  const { isAuthenticated } = useAuthStore();
  
  // Get user role from localStorage
  const getAuthFromStorage = () => {
    const authData = localStorage.getItem('auth-storage');
    
    if (authData) {
      try {
        const parsedData = JSON.parse(authData);
        
        return parsedData?.state?.userData?.role;
      } catch (error) {
        console.error('Error parsing auth data:', error);
        return null;
      }
    }
    return null;
  };

  // Filter navigation items based on user role from localStorage
  const filteredNavigation = navigation.filter(item => {
    if (item.name === 'Pending Requests' || item.name === 'Analytics') {
      const userRole = getAuthFromStorage();
      return userRole === 'admin';
    }
    return true;
  });



  return (
    <div className={"fixed z-50 lg:inset-y-0 lg:flex lg:w-64 lg:flex-col transition-transform duration-300" + " " + (isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")} >
      <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white h-screen" style={{ background: 'linear-gradient(104deg, rgb(0, 0, 56) 0%, rgb(113, 0, 132) 100%)' }}>
        <div className="flex flex-1 flex-col overflow-y-auto lg:pt-5 pb-40 pt-20">
          <div className="flex flex-shrink-0 items-center px-4">
            {/* <GamepadIcon className="h-8 w-8 text-indigo-600" /> */}
            <img src={logo} alt="Bigads Logo" className="h-20 w-30" />
            {/* <span className="ml-2 text-xl font-bold text-white">Bigads</span> */}
          </div>
          <nav className="mt-8 flex-1 space-y-1 px-2">
            {filteredNavigation.map((item) => (
              item.name === 'Documentation' ? (
                <a
                  key={item.name}
                  href="https://data-center-7yhai.ondigitalocean.app/api-docs"
                  target="_blank"
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-white hover:bg-gray-50 hover:text-gray-900"
                >
                  <item.icon
                    className="mr-3 h-5 w-5 flex-shrink-0 text-white group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  className="group flex items-center px-2 py-2 text-sm font-medium rounded-md text-white hover:bg-gray-50 hover:text-gray-900"
                  onClick={(e) => {
                    if (!isAuthenticated) {
                      e.preventDefault();
                    }
                    setIsSidebarOpen(false);
                  }}
                >
                  <item.icon
                    className="mr-3 h-5 w-5 flex-shrink-0 text-white group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              )
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;