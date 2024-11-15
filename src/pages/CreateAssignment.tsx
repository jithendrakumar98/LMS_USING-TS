import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import toast from 'react-hot-toast';
import Sorry from './Sorry';
interface AssignmentForm {
  title: string;
  subject: string;
  description: string;
  dueDate: string;
  year: number;
  subjectFile: File | null;
}

function CreateAssignment() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm<AssignmentForm>();
  const [file, setFile] = React.useState<File | null>(null);
  const [userRole, setUserRole] = useState(null);
  useEffect(() => {
    const role = localStorage.getItem('userRole');
    setUserRole(role);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
    },
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setFile(acceptedFiles[0]);
    },
  });

  const onSubmit = async (data: AssignmentForm) => {
    try {
      if (!file) {
        toast.error('Please upload a Subject Name and Title PDF');
        return;
      }

      // Rename the file using title and subject
      const fileExtension = file.name.split('.').pop();
      const renamedFile = new File([file], `${data.title}-${data.subject}.${fileExtension}`, { type: file.type });

      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('subject', data.subject);
      formData.append('description', data.description);
      formData.append('dueDate', data.dueDate);
      formData.append('year', String(data.year));
      formData.append('file', renamedFile);  // Send renamed file

      const response = await fetch('http://localhost:8080/api/pdf/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success('Assignment created successfully');
        navigate('/assignments');
      } else {
        toast.error('Failed to create assignment');
      }
    } catch (error) {
      toast.error('Failed to create assignment');
    }
  };
  if (userRole === 'student') {
    return <Sorry />;
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Create Assignment</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="bg-white shadow rounded-lg p-6">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Title</label>
              <input
                {...register('title')}
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Subject Name</label>
              <input
                {...register('subject')}
                type="text"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                {...register('description')}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input
                {...register('dueDate')}
                type="date"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Year</label>
              <select
                {...register('year')}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              >
                <option value="">Select Year</option>
                <option value={1}>Year 1</option>
                <option value={2}>Year 2</option>
                <option value={3}>Year 3</option>
                <option value={4}>Year 4</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Subject PDF</label>
              <div
                {...getRootProps()}
                className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md cursor-pointer hover:border-indigo-500"
              >
                <div className="space-y-1 text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="flex text-sm text-gray-600">
                    <input {...getInputProps()} />
                    <p className="pl-1">
                      {file ? file.name : "Drag 'n' drop a Subject PDF, or click to select"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => navigate('/assignments')}
            className="mr-4 bg-gray-300 py-2 px-6 rounded-md text-white"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 py-2 px-6 rounded-md text-white"
          >
            Create Assignment
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateAssignment;
