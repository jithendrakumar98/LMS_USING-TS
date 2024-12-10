import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import Sorry from './Sorry';  

function AddStudent() {
  const [userID, setUserID] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [year, setYear] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
 
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);

  // Handle file upload
  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!userID || !name || !email || !year || !mobileNo || !password) {
      toast.error('Please fill out all fields');
      return;
    }
    

    setLoading(true);

    const formData = new FormData();
    formData.append('userID', userID);
    formData.append('name', name);
    formData.append('email', email);
    formData.append('year', year);
    formData.append('mobileNo', mobileNo);
    formData.append('password', password);
    if (image) {
      formData.append('image', image);
    }

    try {
      await axios.post('https://edutrackspring.up.railway.app/users/post', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Reset form fields
      
      setEmail('');
      setName('');
      setImage(null);
      setUserID('');
      setYear('');
      setMobileNo('');
      setPassword('');
      toast.success('Student added successfully');
    } catch (err) {
      // Handle errors (e.g., server-side validation)
      if (err.response && err.response.data) {
        toast.error(err.response.data.message || 'Failed to add student');
      } else {
        toast.error('Failed to add student');
      }
    } finally {
      setLoading(false);
    }
  };

  // If userRole is 'student', show the Sorry page
  if (userRole === 'student') {
    return <Sorry />;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add Student</h1>
          <p className="mt-1 text-gray-500">Fill out the form to add a new student</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="grid gap-6 p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">User ID</label>
                <input
                  type="text"
                  value={userID}
                  onChange={(e) => setUserID(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Year</label>
                <input
                  type="number"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Mobile No</label>
                <input
                  type="text"
                  value={mobileNo}
                  onChange={(e) => setMobileNo(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-gray-700">Profile Image</label>
                <input
                  type="file"
                  onChange={handleImageChange}
                  className="mt-1 block w-full text-sm text-gray-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
              >
                {loading ? 'Adding...' : 'Add Student'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddStudent;
