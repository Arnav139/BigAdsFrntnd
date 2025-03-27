import React from 'react';
import { Home, GamepadIcon, CalendarClock, Key, BarChart3, BookOpen, UserPlus } from 'lucide-react';
import { useAuthStore } from '@/store/auth';
import logo from '@/assets/big-ads-logo.avif';
import { Link } from 'react-router-dom';

const backendUrl: string = import.meta.env.VITE_BACKEND_URL;

const navigation = [
  { name: 'Overview', icon: Home, href: '/dashboard' },
  { name: 'Documentation', icon: BookOpen, href: '/dashboard/docs' },
  { name: 'Analytics', icon: BarChart3, href: '/dashboard/analytics' },
  // { name: 'Pending Requests', icon: UserPlus, href: '/dashboard/pending-requests' },
];

const Sidebar: React.FC<{ isSidebarOpen: boolean; setIsSidebarOpen: any }> = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div
      className={
        "fixed z-50 lg:inset-y-0 lg:flex lg:w-64 lg:flex-col transition-transform duration-300" +
        " " +
        (isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0")
      }
    >
      <div
        className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white h-screen"
        style={{ background: 'linear-gradient(104deg, rgb(0, 0, 56) 0%, rgb(113, 0, 132) 100%)' }}
      >
        <div className="flex flex-1 flex-col overflow-y-auto lg:pt-5 pb-40 pt-20">
          <div className="flex flex-shrink-0 items-center px-4">
            <img src={logo} alt="Bigads Logo" className="h-16 w-24 sm:h-20 sm:w-30 md:h-24 md:w-36 lg:h-28 lg:w-40" />
          </div>
          <nav className="mt-8 flex-1 space-y-1 px-2">
            {navigation.map((item) =>
              item.name === 'Documentation' ? (
                <a
                  key={item.name}
                  href={`${backendUrl}api-docs`}
                  target="_blank"
                  rel="noopener noreferrer"
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
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <item.icon
                    className="mr-3 h-5 w-5 flex-shrink-0 text-white group-hover:text-gray-500"
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              )
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;