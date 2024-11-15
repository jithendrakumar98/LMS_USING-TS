import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Assignments from './pages/Assignments';
import CreateAssignment from './pages/CreateAssignment';
import { useAuthStore } from './store/authStore';
import AddSubmission from './pages/AddSubmission';
import CodingIDE from './pages/CodingIDE';
const queryClient = new QueryClient();
import Sorry from './pages/Sorry';
import AddStudent from './pages/AddStudent';
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="create-assignment" element={<CreateAssignment />} />
            <Route path="add-submission" element={<AddSubmission />} />
            <Route path="view-submissions" element={<Sorry />} />
            <Route path="add-student" element={<AddStudent />} />
            <Route path="ide" element={<CodingIDE />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;
