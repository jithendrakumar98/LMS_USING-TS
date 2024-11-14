import React, { useEffect, useState } from 'react';
import axios from 'axios'; 
import { BarChart, Users, BookOpen, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function StatCard({ icon: Icon, label, value, color }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color} bg-opacity-10`}>
          <Icon className={`h-6 w-6 ${color}`} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function Dashboard() {
  const navigate = useNavigate();
  const [totalStudents, setTotalStudents] = useState(0); 
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    
    const checkAuthAndFetchData = async () => {
      const isAuthenticated = localStorage.getItem('isAuthenticated');
      
      if (isAuthenticated !== 'true') {
        navigate('/login');
        return;
      }

      try {
        const response = await axios.get('http://localhost:8080/users/count');
        setTotalStudents(response.data);
      } catch (error) {
        console.error('Error fetching total students:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('username');
          localStorage.removeItem('userRole');
          navigate('/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    const checkAndReload = () => {
      const hasReloaded = localStorage.getItem('hasReloaded');

      if (!hasReloaded) {
        localStorage.setItem('hasReloaded', 'true');
        window.location.reload(); // Reload the page
      }
    };

    checkAuthAndFetchData();
    checkAndReload(); // Reload once

  }, [navigate]);

  const username = localStorage.getItem('username') || '';

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome back, {username}!
        </h1>
        <p className="mt-1 text-gray-500">
          Here's what's happening in your classroom
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={BookOpen}
          label="Active Assignments"
          value={12}
          color="text-blue-600"
        />
        <StatCard
          icon={Users}
          label="Total Students"
          value={isLoading ? 'Loading...' : totalStudents}
          color="text-green-600"
        />
        <StatCard
          icon={Clock}
          label="Pending Submissions"
          value={23}
          color="text-yellow-600"
        />
        <StatCard
          icon={BarChart}
          label="Average Score"
          value="85%"
          color="text-purple-600"
        />
      </div>

      <div className="mt-8 bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
          <div className="mt-4 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center py-3 border-b last:border-0">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-4"></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    New submission for "Mathematics Assignment 3"
                  </p>
                  <p className="text-sm text-gray-500">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
