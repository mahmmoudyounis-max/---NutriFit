import React from 'react';
import { Activity, User, LogOut, Menu, X, Home } from 'lucide-react';
import { clearUser, getUser } from '../services/storage';

interface LayoutProps {
  children: React.ReactNode;
  user: any;
  setUser: (u: any) => void;
  setView: (v: string) => void;
  currentView: string;
}

const Layout: React.FC<LayoutProps> = ({ children, user, setUser, setView, currentView }) => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const handleLogout = () => {
    clearUser();
    setUser(null);
    setView('home');
  };

  const navItemClass = (view: string) => 
    `flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg transition-colors cursor-pointer ${
      currentView === view 
        ? 'bg-primary text-white font-bold shadow-md' 
        : 'text-gray-600 hover:bg-green-50'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans">
      <nav className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center cursor-pointer" onClick={() => setView('home')}>
              <Activity className="h-8 w-8 text-primary" />
              <span className="mr-2 text-2xl font-bold text-gray-800">نظامي<span className="text-primary">الصحي</span></span>
            </div>
            
            <div className="hidden md:flex items-center space-x-4 space-x-reverse">
              <button onClick={() => setView('home')} className={navItemClass('home')}>
                <Home size={20} />
                <span>الرئيسية</span>
              </button>
              
              {user ? (
                <>
                  <button onClick={() => setView('dashboard')} className={navItemClass('dashboard')}>
                    <Activity size={20} />
                    <span>لوحة التحكم</span>
                  </button>
                  <div className="border-r-2 border-gray-200 h-6 mx-2"></div>
                  <div className="flex items-center text-sm font-medium text-gray-700">
                    <User size={16} className="ml-1" />
                    {user.name}
                  </div>
                  <button onClick={handleLogout} className="text-red-500 hover:text-red-700 mr-4 font-medium flex items-center">
                    <LogOut size={18} className="ml-1" />
                    خروج
                  </button>
                </>
              ) : (
                <button 
                  onClick={() => setView('auth')} 
                  className="bg-primary text-white px-6 py-2 rounded-full hover:bg-green-600 transition-colors shadow-lg shadow-green-200 font-bold"
                >
                  ابدأ الآن
                </button>
              )}
            </div>

            <div className="md:hidden flex items-center">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-600 hover:text-primary">
                {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-2 shadow-lg">
            <button onClick={() => { setView('home'); setIsMenuOpen(false); }} className="block w-full text-right px-4 py-3 rounded hover:bg-gray-50">
              الرئيسية
            </button>
            {user ? (
              <>
                <button onClick={() => { setView('dashboard'); setIsMenuOpen(false); }} className="block w-full text-right px-4 py-3 rounded hover:bg-gray-50 text-primary font-bold">
                  لوحة التحكم
                </button>
                <div className="border-t border-gray-100 my-2"></div>
                <div className="px-4 py-2 text-sm text-gray-500">مرحباً، {user.name}</div>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="block w-full text-right px-4 py-3 rounded text-red-500 hover:bg-red-50">
                  تسجيل خروج
                </button>
              </>
            ) : (
              <button 
                onClick={() => { setView('auth'); setIsMenuOpen(false); }} 
                className="block w-full text-center bg-primary text-white px-4 py-3 rounded-lg font-bold mt-4"
              >
                ابدأ رحلتك
              </button>
            )}
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      <footer className="bg-dark text-white py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center items-center mb-4">
            <Activity className="h-6 w-6 text-primary ml-2" />
            <span className="text-xl font-bold">نظامي الصحي</span>
          </div>
          <p className="text-gray-400 text-sm mb-4">
            جميع الخطط الغذائية تعتمد على أحدث الأبحاث العلمية المعتمدة عالمياً.
          </p>
          <p className="text-gray-500 text-xs">
            © 2024 NutriFit. جميع الحقوق محفوظة.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;