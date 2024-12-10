import React, { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function ViewSubmission() {
  const [submissions, setSubmissions] = useState([]);
  const [allSubmissions, setAllSubmissions] = useState([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPdfUrl, setSelectedPdfUrl] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 50;

  const role = localStorage.getItem('userRole');
  const studentId = localStorage.getItem('username');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const submissionsResponse = await axios.get(
          'https://edutrackspring.up.railway.app/api/submission/files'
        );
        const pdfResponse = await axios.get('https://edutrackspring.up.railway.app/api/pdf/files');

        const updatedSubmissions = submissionsResponse.data.map((submission) => {
          const matchedPdf = pdfResponse.data.find((pdf) => pdf.id === submission.assignmentId);
          return {
            ...submission,
            title: matchedPdf?.title || 'N/A',
            subject: matchedPdf?.subject || 'N/A',
          };
        });
        // Role-based filtering

        let filteredByRole = updatedSubmissions;
        if (role === 'student') {
          filteredByRole = updatedSubmissions.filter((submission) => {
            return String(submission.studentId) === String(studentId);
          });
          
        }
        //console.log(filteredByRole)
        setAllSubmissions(filteredByRole);
        setFilteredSubmissions(filteredByRole);
        setSubjects(['All', ...new Set(filteredByRole.map((s) => s.subject))]);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data');
        setLoading(false);
      }
    };

    fetchData();
  }, [role, studentId]);

  useEffect(() => {
    let filtered = allSubmissions;

    if (selectedSubject !== 'All') {
      filtered = filtered.filter((submission) => submission.subject === selectedSubject);
    }

    setFilteredSubmissions(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  }, [selectedSubject, allSubmissions]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query === '') {
      setFilteredSubmissions(allSubmissions);
    } else {
      const filteredData = allSubmissions.filter(
        (submission) =>
          submission.studentId.toLowerCase().includes(query.toLowerCase()) ||
          submission.fileName.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredSubmissions(filteredData);
    }
  };

  const handleViewPdf = (submissionId) => {
    setSelectedPdfUrl(`https://edutrackspring.up.railway.app/api/submission/view/${submissionId}`);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPdfUrl(null);
  };

  const handleMarksUpdate = async (submissionId, newMarks) => {
    try {
      await axios.put(`https://edutrackspring.up.railway.app/api/submission/update/${submissionId}`, {
        marks: newMarks,
      });
      setAllSubmissions((prev) =>
        prev.map((submission) =>
          submission.id === submissionId ? { ...submission, marks: newMarks } : submission
        )
      );
      toast.success('Marks updated successfully');
    } catch (err) {
      toast.error('Failed to update marks');
    }
  };

  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
          <h1 className="text-2xl font-bold text-gray-900">Submitted Assignments</h1>
          <p className="mt-1 text-gray-500">View and grade student submissions</p>
        </div>
      </div>

      <div className="flex justify-between mb-4">
        <input
          type="text"
          placeholder="Search by Student ID or File Name"
          className="p-2 border rounded-md w-1/3"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <select
          className="p-2 border rounded-md"
          value={selectedSubject}
          onChange={(e) => setSelectedSubject(e.target.value)}
        >
          {subjects.map((subject, idx) => (
            <option key={idx} value={subject}>
              {subject}
            </option>
          ))}
        </select>
      </div>

      {filteredSubmissions.length === 0 ? (
        <div className="text-center text-lg text-gray-600">
          Oops, there is no submission matching your search criteria.
        </div>
      ) : (
        <div className="bg-white shadow rounded-lg">
          <div className="overflow-auto max-h-96">
            <table className="min-w-full table-auto">
              <thead>
                <tr className="text-left text-sm font-medium text-gray-700">
                  <th className="px-6 py-3">Student ID</th>
                  <th className="px-6 py-3">File Name</th>
                  <th className="px-6 py-3">Subject</th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Marks</th>
                  <th className="px-6 py-3">Action</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSubmissions.map((submission) => (
                  <tr key={submission.id} className="border-b">
                    <td className="px-6 py-4">{submission.studentId}</td>
                    <td className="px-6 py-4">{submission.fileName}</td>
                    <td className="px-6 py-4">{submission.subject}</td>
                    <td className="px-6 py-4">{submission.title}</td>
                    <td className="px-6 py-4">{submission.marks}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleViewPdf(submission.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="h-5 w-5" />
                        View
                      </button>
                      {role === 'teacher' && (
                        <div className="flex items-center space-x-2">
                          <input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="Enter marks"
                            className="p-2 border rounded-md text-sm"
                            onBlur={(e) => handleMarksUpdate(submission.id, e.target.value)}
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 border rounded-md bg-gray-200 hover:bg-gray-300"
        >
          Previous
        </button>
        <p>
          Page {currentPage} of {Math.ceil(filteredSubmissions.length / pageSize)}
        </p>
        <button
          onClick={() =>
            setCurrentPage((prev) =>
              prev < Math.ceil(filteredSubmissions.length / pageSize) ? prev + 1 : prev
            )
          }
          disabled={currentPage === Math.ceil(filteredSubmissions.length / pageSize)}
          className="p-2 border rounded-md bg-gray-200 hover:bg-gray-300"
        >
          Next
        </button>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white w-11/12 md:w-3/4 lg:w-1/2 p-6 rounded-lg">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">PDF Viewer</h2>
              <button onClick={closeModal} className="text-gray-600 hover:text-gray-900">
                Close
              </button>
            </div>
            <div className="mt-4">
              <iframe
                src={selectedPdfUrl}
                width="100%"
                height="500px"
                title="PDF Viewer"
                className="rounded-md border"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
