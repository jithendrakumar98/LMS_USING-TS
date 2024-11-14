import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, Calendar, User, Trash2, Eye, X } from 'lucide-react';
import { format } from 'date-fns';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';

function Assignments() {
  const user = useAuthStore((state) => state.user);
  const isTeacher = user?.role === 'teacher';

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const assignmentsPerPage = 3;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);

  // Fetch assignments from API
  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/pdf/files');
        setAssignments(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch assignments');
        setLoading(false);
      }
    };

    fetchAssignments();
  }, []);

  const handleDelete = async (assignmentId) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this assignment?');
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:8080/api/pdf/delete/${assignmentId}`);
        setAssignments(assignments.filter((assignment) => assignment.id !== assignmentId));
        toast.success('Assignment deleted successfully');
      } catch (err) {
        setError('Failed to delete assignment');
        toast.error('Failed to delete assignment');
      }
    }
  };

  const handleViewPdf = (pdfUrl) => {
    setSelectedPdfUrl(pdfUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPdfUrl(null);
  };

  const indexOfLastAssignment = currentPage * assignmentsPerPage;
  const indexOfFirstAssignment = indexOfLastAssignment - assignmentsPerPage;
  const currentAssignments = assignments.slice(indexOfFirstAssignment, indexOfLastAssignment);

  const nextPage = () => {
    if (currentPage * assignmentsPerPage < assignments.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignments</h1>
          <p className="mt-1 text-gray-500">Manage and track your classroom assignments</p>
        </div>
        {isTeacher && (
          <Link
            to="/create-assignment"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Plus className="h-5 w-5 mr-2" />
            Create Assignment
          </Link>
        )}
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="grid gap-6 p-6">
          {currentAssignments.map((assignment) => (
            <div
              key={assignment.id}
              className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-indigo-600 mr-2" />
                  <h3 className="text-lg font-medium text-gray-900">{assignment.title}</h3>
                </div>
                <p className="mt-1 text-sm text-gray-500">{assignment.description}</p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className="inline-flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    Due {format(new Date(assignment.dueDate), 'PPp')}
                  </span>
                  <span className="inline-flex items-center text-sm text-gray-500">
                    <User className="h-4 w-4 mr-1" />
                    0 submissions
                  </span>
                </div>
              </div>
              <div className="mt-4 md:mt-0 flex items-center space-x-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
                  Year {assignment.year}
                </span>
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                  {assignment.subject}
                </span>
                <button
                  onClick={() => handleViewPdf(`http://localhost:8080/api/pdf/view/${assignment.id}`)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Eye className="h-5 w-5" />
                  View
                </button>
                {isTeacher && (
                  <button
                    onClick={() => handleDelete(assignment.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-5 w-5" />
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="mt-6 flex justify-between">
        <button
          onClick={prevPage}
          disabled={currentPage === 1}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-500 hover:bg-gray-600 focus:outline-none"
        >
          Previous
        </button>
        <button
          onClick={nextPage}
          disabled={indexOfLastAssignment >= assignments.length}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
        >
          Next
        </button>
      </div>

      {/* Modal for PDF viewing */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-11/12 md:w-3/4 lg:w-1/2 p-6 rounded-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">PDF Viewer</h2>
              <button onClick={closeModal} className="text-gray-600 hover:text-gray-900">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-4">
              <iframe
                src={selectedPdfUrl}
                width="100%"
                height="600px"
                title="PDF"
                className="border rounded-lg"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Assignments;
