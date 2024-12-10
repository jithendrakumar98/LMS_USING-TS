import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Eye, Upload, X, Trash2 } from 'lucide-react';

function AddSubmission() {
  const user = useAuthStore((state) => state.user);
  const isStudent = user?.role === 'student';

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const assignmentsPerPage = 3;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [userName, setUserName] = useState('');
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const response = await axios.get('https://edutrackspring.up.railway.app/api/pdf/files');
        const sortedAssignments = response.data.sort((a, b) => new Date(b.id) - new Date(a.id));
        setAssignments(sortedAssignments);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch assignments');
        setLoading(false);
      }
    };

    const fetchUserName = async () => {
      const storedUsername = localStorage.getItem('username');
      if (storedUsername) {
        try {
          const response = await axios.get(`https://edutrackspring.up.railway.app/users/getbyid`, {
            params: { id: storedUsername },
          });
          setUserName(response.data.name);
        } catch (error) {
          console.error('Error fetching user name:', error);
        }
      }
    };

    const fetchSubmissions = async () => {
      try {
        const response = await axios.get('https://edutrackspring.up.railway.app/api/submission/files');
        setSubmissions(response.data); // Store all submissions
      } catch (error) {
        console.error('Error fetching submissions:', error);
      }
    };

    fetchAssignments();
    fetchUserName();
    fetchSubmissions();
  }, []);

  const handleFileChange = (e) => {
    setSubmissionFile(e.target.files[0]);
  };

  const handleSubmit = async (assignmentId) => {
    if (!submissionFile) {
      toast.error('Please choose a file to submit.');
      return;
    }

    const studentId = localStorage.getItem('username');

    if (!studentId) {
      toast.error('Student ID is missing or not found in localStorage.');
      return;
    }

    const formData = new FormData();
    formData.append('file', submissionFile);
    formData.append('assignmentId', assignmentId);
    formData.append('studentId', studentId);
    formData.append('name', userName);
    formData.append('marks', 0);

    try {
      setIsSubmitting(true);
      await axios.post(`https://edutrackspring.up.railway.app/api/submission/upload`, formData);
      toast.success('Submission successful!');
      setIsSubmitting(false);
      setSubmissionFile(null); // Clear the file after submission
      window.location.reload(); // Reload the page after successful submission
    } catch (error) {
      console.error('Error submitting answer:', error.response?.data || error.message);
      toast.error('Submission failed!');
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this submission?')) {
      try {
        await axios.delete(`https://edutrackspring.up.railway.app/api/assignments/${assignmentId}/delete`);
        toast.success('Submission deleted successfully!');
        setAssignments(assignments.filter(assignment => assignment.id !== assignmentId));
      } catch (error) {
        toast.error('Failed to delete submission');
      }
    }
  };

  const handleViewPdf = (submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubmission(null);
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

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const totalPages = Math.ceil(assignments.length / assignmentsPerPage);

  return (
    <div className="p-1 min-h-screen flex flex-col">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add Submission</h1>
          <p className="mt-1 text-gray-600">View your assignments and submit your answers</p>
          {userName && <p className="text-lg text-gray-500">Welcome, {userName}!</p>}
        </div>
      </div>

      <div className="bg-white shadow-lg rounded-lg flex-1">
        <div className="grid gap-5 p-2">
          {currentAssignments.map((assignment) => {
            const isPastDue = new Date(assignment.dueDate) < new Date();
            const submission = submissions.find(
              (sub) => sub.assignmentId === assignment.id && sub.studentId === parseInt(localStorage.getItem('username'))
            );
            const hasSubmitted = !!submission;

            return (
              <div
                key={assignment.id}
                className="flex flex-col md:flex-row md:items-center justify-between p-6 bg-gray-100 rounded-lg transition duration-300 ease-in-out hover:shadow-xl"
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <Eye className="h-5 w-5 text-indigo-600 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-900">{assignment.title}</h3>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{assignment.description}</p>
                  <p className="mt-1 text-sm text-gray-500 font-semibold">Subject: {assignment.subject}</p>
                  <div className="mt-2 flex items-center space-x-4">
                    <span className="inline-flex items-center text-sm text-gray-600">
                      Due {new Date(assignment.dueDate).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {isStudent && (
                  <div className="mt-4 md:mt-0 flex items-center space-x-4">
                    {isPastDue ? (
                      <p className="text-red-600 font-semibold">Opps! It's HighTime</p>
                    ) : hasSubmitted ? (
                      <>
                        <p className="text-green-600 font-semibold">Submitted</p>
                        <button
                          onClick={() => handleViewPdf(submission)}
                          className="text-blue-600 hover:text-blue-800 transition-all duration-200"
                        >
                          <Eye className="h-5 w-5" />
                          View Submission
                        </button>
                        <button
                          onClick={() => handleDelete(assignment.id)}
                          className="text-red-600 hover:text-red-800 transition-all duration-200"
                        >
                          <Trash2 className="h-5 w-5 mr-2" />
                          Delete
                        </button>
                      </>
                    ) : (
                      <div>
                        <input type="file" accept=".pdf" onChange={handleFileChange} />
                        <button
                          onClick={() => handleSubmit(assignment.id)}
                          className={`text-white ${isSubmitting ? 'bg-gray-500' : 'bg-indigo-600'} hover:bg-indigo-700 transition-all duration-200 rounded-md p-2`}
                          disabled={isSubmitting}
                        >
                          <Upload className="h-5 w-5 inline-block mr-2" />
                          {isSubmitting ? 'Submitting...' : 'Submit PDF'}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex justify-center items-center mt-6 space-x-4">
          <button
            onClick={prevPage}
            className={`px-4 py-2 rounded-full text-white bg-indigo-600 hover:bg-indigo-800 transition-all duration-300 ${
              currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={currentPage === 1}
          >
            Prev
          </button>

          {/* Page Numbers */}
          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index + 1}
              onClick={() => goToPage(index + 1)}
              className={`px-4 py-2 rounded-full ${
                currentPage === index + 1 ? 'bg-indigo-800 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-600'
              } transition-all duration-300`}
            >
              {index + 1}
            </button>
          ))}

          <button
            onClick={nextPage}
            className={`px-4 py-2 rounded-full text-white bg-indigo-600 hover:bg-indigo-800 transition-all duration-300 ${
              currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      </div>

      {isModalOpen && selectedSubmission && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 overflow-hidden">
    <div className="bg-white rounded-lg shadow-lg p-6 max-w-4xl w-full h-[100vh] overflow-hidden">
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-semibold">View Submission</h3>
        <button onClick={closeModal}>
          <X className="h-6 w-6" />
        </button>
      </div>
      <div className="mt-4 h-full">
        <iframe
          src={`https://edutrackspring.up.railway.app/api/submission/view/${selectedSubmission.id}`}
          width="100%"
          height="100%"
          title="PDF Viewer"
          className="rounded-lg shadow-lg"
        />
      </div>
    </div>
  </div>
)}
    </div>
  );
}

export default AddSubmission;