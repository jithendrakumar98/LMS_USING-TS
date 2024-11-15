import React, { useEffect, useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { GraduationCap, BookOpen, LogOut, LayoutDashboard, FileText, UserPlus, Plus, Code, Menu } from 'lucide-react';

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    const storedRole = localStorage.getItem('userRole');
    const userID = localStorage.getItem('username');

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedRole) {
      setRole(storedRole); 
    }

    if (userID) {
      fetch(`http://localhost:8080/users/viewImage?id=${userID}`)
        .then(response => {
          if (response.ok) {
            return response.blob();
          } else {
            throw new Error('Image not found');
          }
        })
        .then(imageBlob => {
          const imageObjectURL = URL.createObjectURL(imageBlob);
          setProfileImage(imageObjectURL);
        })
        .catch(() => {
          setProfileImage(null);
        });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userID');
    setUser(null);
    setRole(null);
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
              {/* Hamburger menu for small screens */}
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 rounded-full hover:bg-indigo-700 transition-colors"
              >
                <Menu className="h-6 w-6" />
              </button>

              {/* Profile image and logout on the left */}
              <div className="flex items-center space-x-1">
                {/* Profile image or default letter */}
                <div className="relative flex items-center justify-center w-12 h-12 rounded-full bg-gray-200 border-2 border-white shadow-md hover:shadow-xl transition-shadow duration-300">
                  {profileImage ? (
                    <img 
                      src={profileImage} 
                      alt="Profile" 
                      className="w-full h-full object-cover rounded-full" 
                    />
                  ) : (
                    <span className="text-2xl font-bold text-gray-600">{user?.name?.[0] || 'U'}</span>
                  )}
                </div>
                <span className="text-sm">{user?.name}</span>
              </div>
              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="p-2 rounded-full hover:bg-indigo-700 transition-colors"
              >
                <LogOut className="h-10 w-8" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar - Hidden on small screens */}
        <aside className={`lg:w-64 w-full bg-white h-[calc(100vh-4rem)] shadow-lg ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
          <nav className="mt-8 px-4">
            {/* Common Links */}
            <Link
              to="/"
              className={`flex items-center space-x-2 p-3 rounded-lg ${location.pathname === '/' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            <Link
              to="/assignments"
              className={`flex items-center space-x-2 p-3 rounded-lg ${location.pathname === '/assignments' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <BookOpen className="h-5 w-5" />
              <span>Assignments</span>
            </Link>
            <Link
              to="/view-submissions"
              className={`flex items-center space-x-2 p-3 rounded-lg ${location.pathname === '/view-submissions' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
            >
              <FileText className="h-5 w-5" />
              <span>View Submissions</span>
            </Link>

            {/* Conditional Links Based on Role */}
            {role === 'teacher' && (
              <>
                <Link
                  to="/add-student"
                  className={`flex items-center space-x-2 p-3 rounded-lg ${location.pathname === '/add-student' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <UserPlus className="h-5 w-5" />
                  <span>Add Student</span>
                </Link>
                <Link
                  to="/ide"
                  className={`flex items-center space-x-2 p-3 rounded-lg ${location.pathname === '/ide' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Code className="h-5 w-5" />
                  <span>IDE</span>
                </Link>
              </>
            )}

            {role === 'student' && (
              <>
                <Link
                  to="/add-submission"
                  className={`flex items-center space-x-2 p-3 rounded-lg ${location.pathname === '/add-submission' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Plus className="h-5 w-5" />
                  <span>Add Submission</span>
                </Link>
                <Link
                  to="/ide"
                  className={`flex items-center space-x-2 p-3 rounded-lg ${location.pathname === '/ide' ? 'bg-indigo-50 text-indigo-600' : 'text-gray-600 hover:bg-gray-50'}`}
                >
                  <Code className="h-5 w-5" />
                  <span>IDE</span>
                </Link>
              </>
            )}
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
