import React from 'react';
import { 
  Home, 
  ChevronRight,
  Menu,
  Code,
  Search,
  FileText as DocumentIcon
} from 'lucide-react';
import { 
  Link, 
  Outlet, 
  useLocation 
} from 'react-router-dom';

// import SearchBar from './SearchBar';
// import DocumentAnalysisContainer from './DocumentAnalysisContainer';
// import LandingPage from './LandingPage';

const Header = () => {
  const location = useLocation();

  return (
    <header className="py-6 border-b border-gray-900 bg-[#1C1C1C]/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-8 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white shadow-md animate-pulse-slow">
            <Code size={24} />
          </div>
          <h1 className="text-3xl font-bold gradient-text tracking-tight">
            LegalEagle
          </h1>
        </div>
        
        <nav className="hidden md:block">
          <ul className="flex space-x-6 items-center">
            <li>
              <Link 
                to="/" 
                className={`
                  text-gray-300 
                  hover:text-green-400 
                  transition-colors 
                  font-medium 
                  flex 
                  items-center 
                  ${location.pathname === '/' ? 'text-green-400' : ''}
                `}
              >
                <Home size={18} className="mr-2" />
                Home
              </Link>
            </li>
            <li>
              <Link 
                to="/search" 
                className={`
                  text-gray-300 
                  hover:text-green-400 
                  transition-colors 
                  font-medium 
                  flex 
                  items-center 
                  ${location.pathname === '/search' ? 'text-green-400' : ''}
                `}
              >
                <Search size={18} className="mr-2" />
                Search
              </Link>
            </li>
            {/* <li>
              <Link 
                to="/document" 
                className={`
                  text-gray-300 
                  hover:text-green-400 
                  transition-colors 
                  font-medium 
                  flex 
                  items-center 
                  ${location.pathname === '/document' ? 'text-green-400' : ''}
                `}
              >
                <DocumentIcon size={18} className="mr-2" />
                Document
              </Link>
            </li> */}
            <li>
              <nav className="flex space-x-4"> 
                <Link to="/dashboard" className="btn-primary px-5 py-2 rounded-lg flex items-center font-semibold ${location.pathname === '/dashboard' ? 'text-green-400' : ''}">
                  <DocumentIcon size={18} className="mr-2" />
                  Dashboard
                  <ChevronRight size={16} className="ml-2" />
                </Link>

                <Link to="/action-items" className="btn-primary px-5 py-2 rounded-lg flex items-center font-semibold ${location.pathname === '/action-items' ? 'text-green-400' : ''}">
                  <DocumentIcon size={18} className="mr-2" />
                  Action Items
                  <ChevronRight size={16} className="ml-2" />
                </Link>

                {/* <Link to="/compliance" className="btn-primary px-5 py-2 rounded-lg flex items-center font-semibold ${location.pathname === '/compliance' ? 'text-green-400' : ''}">
                  <DocumentIcon size={18} className="mr-2" />
                  Compliance
                  <ChevronRight size={16} className="ml-2" />
                </Link> */}
              </nav>
            </li>
          </ul>
        </nav>

        <button className="md:hidden text-gray-300 hover:text-green-400">
          <Menu className="h-6 w-6" />
        </button>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="py-10 border-t border-gray-900 bg-[#1C1C1C]/80 backdrop-blur-sm">
    <div className="container mx-auto px-8 flex flex-col md:flex-row justify-between items-center">
      <div className="flex items-center space-x-3 mb-4 md:mb-0">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center text-white shadow-md">
          <Code size={20} />
        </div>
        <span className="text-xl font-bold gradient-text">LegalEagle</span>
      </div>
      
      <p className="text-gray-400 text-sm mb-4 md:mb-0">
        {new Date().getFullYear()} LegalEagle. All rights reserved.
      </p>
      
      <div className="flex space-x-4">
        <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Privacy</a>
        <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Terms</a>
        <a href="#" className="text-gray-400 hover:text-green-400 transition-colors">Contact</a>
      </div>
    </div>
  </footer>
);

const MainLayout: React.FC = () => {
  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white">
      <Header />

      <main className="flex-grow px-4 md:px-8 lg:px-16 xl:px-24 py-8 flex flex-col items-center">
        <div className="w-full max-w-[90%] mx-auto">
          <Outlet />
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;
