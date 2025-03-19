import React, { useContext, useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import moment from 'moment';
import axios from 'axios';
import { toast } from 'react-toastify';
import { AppContext } from '../context/AppContext';

const Application = () => {
  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);
  const [user, setUser] = useState(null);
  const [applications, setApplications] = useState([]);
  const { backendUrl } = useContext(AppContext);

  // Fetch user details
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/auth/me`, {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [backendUrl]);

  // Fetch user job applications
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/auth/applications`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setApplications(response.data.applications); // FIXED: Use 'applications' instead of 'application'
          console.log("Applications:", response.data.applications);
        } else {
          toast.error("No job applications found.");
        }
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast.error("Failed to load applications.");
      }
    };

    fetchApplications();
  }, [backendUrl]);

  return (
    <>
      <Header />
      <div className='max-w-7xl px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10'>
        <h2 className='text-xl font-semibold'>Your Resume</h2>
        <div className='flex gap-2 mb-6 mt-3'>
          {isEdit || !user?.resume ? (
            <>
              <label className='flex items-center' htmlFor="resumeUpload">
                <p className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2'>
                  {resume ? resume.name : "Select Resume"}
                </p>
                <input
                  id='resumeUpload'
                  onChange={e => setResume(e.target.files[0])}
                  type="file"
                  accept='application/pdf'
                  hidden
                />
              </label>
              <button className='bg-green-100 border border-green-400 rounded-lg px-4 py-2'>
                Save
              </button>
              <button onClick={() => setIsEdit(false)} className='text-gray-500 border border-gray-300 rounded-lg px-4 py-2'>
                Cancel
              </button>
            </>
          ) : (
            <div className='flex gap-2'>
              <a href={`${backendUrl}/${user.resume}`} target="_blank" rel="noopener noreferrer" className='bg-blue-100 text-blue-600 px-4 py-2 rounded-lg'>
                View Resume
              </a>
              <button onClick={() => setIsEdit(true)} className='text-gray-500 border border-gray-300 rounded-lg px-4 py-2'>
                Edit
              </button>
            </div>
          )}
        </div>

        <h2 className='text-xl font-medium mb-4'>Job Applications</h2>
        <table className='min-w-full bg-white border rounded-lg'>
          <thead>
            <tr>
              <th className='py-3 px-4 border-b text-left'>Company</th>
              <th className='py-3 px-4 border-b text-left'>Job Title</th>
              <th className='py-3 px-4 border-b text-left max-sm:hidden'>Location</th>
              <th className='py-3 px-4 border-b text-left'>Date</th>
              <th className='py-3 px-4 border-b text-left'>Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.length > 0 ? (
              applications.map((app, index) => (
                <tr key={index}>
                  <td className='py-3 px-4 flex items-center gap-2 border-b'>
                    {/* FIXED: If company image doesn't exist, use a placeholder */}
                    <img 
  className='w-8 h-8' 
  src={app?.companyId?.companyImage ? backendUrl + `/${app.companyId.companyImage}` : "/default-company.png"} 
  alt={app?.companyId?.name || "Company"} 
/>

                    {app?.companyId?.name}
                  </td>
                  <td className='py-2 px-4 border-b'>{app?.jobId?.title}</td>
                  <td className='py-2 px-4 border-b max-sm:hidden'>{app?.jobId?.location}</td>
                  {/* FIXED: Use correct date format */}
                  <td className='py-2 px-4 border-b max-sm:hidden'>{moment(app?.date).format('ll')}</td>
                  <td className='py-2 px-4 border-b'>
                    <span className={`${app?.status === 'Accepted' ? 'bg-green-100' : app?.status === 'Rejected' ? 'bg-red-100' : 'bg-blue-100'} px-4 py-1.5 rounded`}>
                      {app?.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4">No job applications found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  );
};

export default Application;
