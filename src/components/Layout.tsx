import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, LogOut, LayoutDashboard, FileText, UserPlus, Plus, Code } from 'lucide-react';

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user'); 
    setUser(null); 
    navigate('/login'); 
    
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <GraduationCap className="h-8 w-8" />
              <span className="ml-2 text-xl font-bold">EduTrack</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">{user?.name}</span>
              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-indigo-700 transition-colors"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-64 bg-white h-[calc(100vh-4rem)] shadow-lg">
          <nav className="mt-8 px-4">
            <Link
              to="/"
              className={`flex items-center space-x-2 p-3 rounded-lg ${
                location.pathname === '/'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/assignments"
              className={`flex items-center space-x-2 p-3 rounded-lg ${
                location.pathname === '/assignments'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="h-5 w-5" />
              <span>Assignments</span>
            </Link>
            <Link
              to="/view-submissions"
              className={`flex items-center space-x-2 p-3 rounded-lg ${
                location.pathname === '/view-submissions'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <FileText className="h-5 w-5" />
              <span>View Submissions</span>
            </Link>
            <Link
              to="/add-student"
              className={`flex items-center space-x-2 p-3 rounded-lg ${
                location.pathname === '/add-student'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <UserPlus className="h-5 w-5" />
              <span>Add Student</span>
            </Link>

            {/* Add Submission Button */}
            <Link
              to="/add-submission"
              className={`flex items-center space-x-2 p-3 rounded-lg ${
                location.pathname === '/add-submission'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Plus className="h-5 w-5" />
              <span>Add Submission</span>
            </Link>

            {/* IDE Button */}
            <Link
              to="/ide"
              className={`flex items-center space-x-2 p-3 rounded-lg ${
                location.pathname === '/ide'
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Code className="h-5 w-5" />
              <span>IDE</span>
            </Link>
          </nav>
        </aside>

        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;
