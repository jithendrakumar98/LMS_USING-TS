import React, { useState } from 'react';
import { Play, Download } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';
import Editor from '@monaco-editor/react';
import axios from 'axios';

function CodingIDE() {
  const user = useAuthStore((state) => state.user);
  const isTeacher = user?.role === 'teacher';

  const [code, setCode] = useState('// If Using Java Class Name Must Be Main');
  const [language, setLanguage] = useState('python');
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');
  const [errorOutput, setErrorOutput] = useState('');

  // Available languages supported by Judge0 API
  const languages: { [key: string]: string } = {
    python: '71',
    cpp: '54',
    java: '62',
    c: '50',
  };

  // Handle code submission
  const runCode = async () => {
    setIsRunning(true);
    setErrorOutput('');
    try {
      const response = await axios.post(
        'https://judge0-ce.p.rapidapi.com/submissions',
        {
          source_code: code,
          language_id: languages[language],
          stdin: '',
        },
        {
          headers: {
            'x-rapidapi-key': 'b34397c385msh5ba2d3112477c78p159cb2jsn0e4a3797b3d8',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
            'Content-Type': 'application/json',
          },
        }
      );

      const token = response.data.token;
      checkSubmissionStatus(token);
    } catch (error) {
      toast.error('Failed to submit the code. Please try again.');
      setIsRunning(false);
    }
  };

  // Check the submission status and get the result
  const checkSubmissionStatus = async (token: string) => {
    try {
      const result = await axios.get(
        `https://judge0-ce.p.rapidapi.com/submissions/${token}?base64_encoded=false`,
        {
          headers: {
            'x-rapidapi-key': 'b34397c385msh5ba2d3112477c78p159cb2jsn0e4a3797b3d8',
            'x-rapidapi-host': 'judge0-ce.p.rapidapi.com',
          },
        }
      );

      if (result.data.status.id <= 2) {
        setTimeout(() => checkSubmissionStatus(token), 1000); // Keep checking until completion
      } else {
        setOutput(result.data.stdout || 'No Output');
        setErrorOutput(result.data.stderr || ''); // Capture stderr if there are errors
        setIsRunning(false);
      }
    } catch (error) {
      toast.error('Error fetching the result.');
      setIsRunning(false);
    }
  };

  // Handle Download Code
  const handleDownloadCode = () => {
    const blob = new Blob([code], { type: 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'code.txt';
    link.click();
    toast.success('Code downloaded');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Coding IDE</h1>
          <p className="mt-1 text-gray-500">Write and test your code in this interactive environment</p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-6">
          <div className="mb-6">
            {/* Language selection dropdown */}
            <div className="mb-4">
              <label htmlFor="language" className="block text-gray-700 font-semibold mb-2">
                Select Language:
              </label>
              <select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="p-2 border border-gray-300 rounded-md w-full"
              >
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="java">Java</option>
                <option value="c">C</option>
              </select>
            </div>

            {/* Monaco Code Editor */}
            <Editor
              height="60vh"
              defaultLanguage="python"
              language={language}
              value={code}
              onChange={(newCode) => setCode(newCode || '')}
              theme="vs-blue"
              options={{
                fontSize: 14,
                minimap: { enabled: true },
                wordWrap: 'on',
              }}
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              onClick={runCode}
              disabled={isRunning}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none"
            >
              <Play className="h-5 w-5 mr-2" />
              {isRunning ? 'Running...' : 'Run Code'}
            </button>

            <button
              onClick={handleDownloadCode}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              <Download className="h-5 w-5 mr-2" />
              Download Code
            </button>
          </div>
        </div>
      </div>
      <div className="mt-6 bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-900">Output</h2>
        <div className="mt-4">
          <pre className="p-4 bg-gray-100 text-gray-800">{output || 'No Output'}</pre>
        </div>
        {errorOutput && (
          <div className="mt-4">
            <h3 className="font-bold text-red-600">Error:</h3>
            <pre className="p-4 bg-red-100 text-red-800">{errorOutput}</pre>
          </div>
        )}
      </div>
    </div>
  );
}

export default CodingIDE;
