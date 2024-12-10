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
  const [file, setFile] = useState<File | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [subject, setSubject] = useState<string | null>(null);
  const [isSubjectEditable, setIsSubjectEditable] = useState<boolean>(false);

  useEffect(() => {
    const role = localStorage.getItem('userRole');
    const savedSubject = localStorage.getItem('Subject');
    setUserRole(role);
    setSubject(savedSubject);

    // Convert username to integer and check conditions
    const username = localStorage.getItem('username');
    if (username) {
      const usernameInt = parseInt(username);
      if (usernameInt < 2000 || !savedSubject) {
        setIsSubjectEditable(true); 
      }
    }
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

  const fetchEmails = async (subject,year, title, dueDate, body) => {
    try {
      const response = await fetch(`https://edutrackspring.up.railway.app/emails/${year}`);
      if (response.ok) {
        const emails = await response.json();
        const emailsToSend = emails.map((email) => ({
          email: email,
          subject: `New Assignment Unlocked.....!`,
          body: `
            <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background-color: #f4f4f4; border-radius: 8px;">
              <div style="max-width: 600px; margin: 0 auto; background-color: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                <h2 style="text-align: center; color: #5C6BC0;">New Assignment Unlocked!</h2>
                <p style="font-size: 16px; line-height: 1.5; color: #555;">
                  Dear <strong>Student</strong>,
                </p>
                <p style="font-size: 16px; line-height: 1.5; color: #555;">
                  We are excited to inform you that a new assignment has been unlocked for you. Please make sure to complete it within the given time frame.
                </p>
                <h3 style="color: #5C6BC0; font-size: 18px; border-bottom: 2px solid #5C6BC0; padding-bottom: 5px;">Assignment Details:</h3>
                <ul style="list-style-type: none; padding-left: 0;">
                  <li style="font-size: 16px; color: #555; margin-bottom: 10px;">
                    <strong style="color: #333;">Subject:</strong> ${subject}
                  </li>
                  <li style="font-size: 16px; color: #555; margin-bottom: 10px;">
                    <strong style="color: #333;">Title:</strong> ${title}
                  </li>
                  <li style="font-size: 16px; color: #555; margin-bottom: 10px;">
                    <strong style="color: #333;">Due Date:</strong> ${dueDate}
                  </li>
                </ul>
                <p style="font-size: 16px; line-height: 1.5; color: #555;">
                  You can find further instructions and access the assignment on the portal.
                </p>
                <p style="font-size: 16px; line-height: 1.5; color: #555;">
                  <strong>Best regards,</strong><br/>
                  <span style="color: #5C6BC0; font-weight: bold;">[EduTrack]</span>
                </p>
              </div>
            </div>
          `
        }));
        const dataToSend = {
          emails: emailsToSend,
        };
        const powerAutomateUrl = 'https://prod-06.centralindia.logic.azure.com:443/workflows/a7e1ecaa54ea41579ac8d4bcdfedc43c/triggers/manual/paths/invoke?api-version=2016-06-01&sp=%2Ftriggers%2Fmanual%2Frun&sv=1.0&sig=R7rC_FLhYFQS_J22IcG76i6YjP_aTZQoeVwR8JapwPM';
        const postResponse = await fetch(powerAutomateUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        });
        if (postResponse.ok) {
          const postData = await postResponse.json();
          toast.success('Emails successfully sent to Power Automate!');
        } else {
          const errorData = await postResponse.text();
          console.error('Failed to send to Power Automate:', errorData);
        }
      } else {
        toast.error('Failed to fetch emails from backend');
      }
    } catch (error) {
      console.error('Error fetching or sending emails:', error);
    }
  };

  const onSubmit = async (data: AssignmentForm) => {
    try {
      
      if (!file) {
        toast.error('Please upload a Subject Name and Title PDF');
        return;
      }
      const savedSubject = localStorage.getItem('Subject') || data.subject;

      const fileExtension = file.name.split('.').pop();
      const renamedFile = new File([file], `${data.title}-${savedSubject}.${fileExtension}`, { type: file.type });

      const formData = new FormData();
      
      formData.append('title', data.title);
      formData.append('subject', data.subject);
      formData.append('description', data.description);
      formData.append('dueDate', data.dueDate);
      formData.append('year', String(data.year));
      formData.append('file', renamedFile);

      const response = await fetch('https://edutrackspring.up.railway.app/api/pdf/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        toast.success('Assignment created successfully');
        const emailBody = `You have a new assignment in the subject ${savedSubject}. The assignment is due on ${data.dueDate}.`;
        await fetchEmails(data.subject,data.year, data.title, data.dueDate, emailBody);
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
                value={subject || ''}
                onChange={(e) => setSubject(e.target.value)}
                readOnly={!isSubjectEditable}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                {...register('description')}
                rows={4}
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Due Date</label>
              <input
                {...register('dueDate')}
                type="datetime-local"
                required
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Select Year</label>
              <select {...register('year')} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500">
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Subject File</label>
              <div {...getRootProps()} className="mt-1 block w-full border-2 border-dashed p-6 rounded-md text-center">
                <input {...getInputProps()} />
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <p className="mt-2 text-sm text-gray-600">Drag & drop a file here, or click to select a file</p>
              </div>
              {file && <p className="mt-2 text-sm text-gray-600">{file.name}</p>}
            </div>
          </div>
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Submit
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default CreateAssignment;
