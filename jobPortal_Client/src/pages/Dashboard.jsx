import React, { useContext, useEffect, useState } from 'react'
import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { assets } from '../assets/assets'
import { toast } from 'react-toastify'
import { AppContext } from '../context/AppContext'

const Dashboard = () => {
  const navigate = useNavigate()
  const [company, setCompany] = useState(null)
  const {backendUrl}=useContext(AppContext)

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get(backendUrl + '/api/company/company', { withCredentials: true });
        console.log("Fetched Company Data:", response.data);
  
        if (response.data) {
          setCompany(response.data); 
        } else {
          console.warn("Company data not found in response!");
        }
      } catch (error) {
        toast.error("Failed to fetch company data");
        console.error("Error fetching company:", error);
      }
    };
  
    fetchCompanyData();
  }, []);

  // Logout Function
  const handleLogout = async () => {
    try {
      await axios.post(backendUrl + '/api/company/logout', {}, { withCredentials: true });
      setCompany(null); // Remove company from state
      toast.success("Logged out successfully");
      navigate('/'); // Redirect to login page
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Logout failed");
    }
  };

  return (
    <div className='min-h-screen'>

      {/* Navbar for Recruiter Panel */}
      <div className='shadow py-4'>
        <div className='px-5 flex justify-between items-center'>
          <img onClick={() => navigate('/')} className='max-sm:w-32 cursor-pointer' src={assets.logo} alt="Logo" />
          {company && (
            <div className='flex items-center gap-3'>
              <p className='max-sm:hidden'>
                Welcome, {company.name}
              </p>

              <div className='relative group'>
                <img className='w-8 border rounded-full' src={backendUrl +`/${company.companyImage}`} alt="Company Icon" />

                <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-2'>
                  <ul className='list-none m-0 p-2 bg-white rounded-md border text-sm' >
                    <li className='py-1 px-2 cursor-pointer pr-10' onClick={handleLogout}>
                      Logout
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Dashboard Layout */}
      <div className='flex items-start'>

        {/* Left Sidebar */}
        <div className='inline-block min-h-screen border-r-2 max-sm:hidden'>
          <ul className='flex flex-col items-start pt-5 text-gray-800'>
            <NavLink className={({ isActive }) => `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`} to={'/dashboard/add-job'}>
              <img className='min-w-4' src={assets.add_icon} alt="Add Job" />
              <p className='max-sm-hidden '>Add Job</p>
            </NavLink>

            <NavLink className={({ isActive }) => `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`} to={'/dashboard/manage-job'}>
              <img className='min-w-4' src={assets.home_icon} alt="Manage Jobs" />
              <p className='max-sm-hidden '>Manage Jobs</p>
            </NavLink>

            <NavLink className={({ isActive }) => `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${isActive && 'bg-blue-100 border-r-4 border-blue-500'}`} to={'/dashboard/view-applications'}>
              <img className='min-w-4' src={assets.person_tick_icon} alt="View Applications" />
              <p className='max-sm-hidden '>View Applications</p>
            </NavLink>
          </ul>
        </div>

        {/* Main Content */}
        <div>
          <Outlet />
        </div>
      </div>

    </div>
  )
}

export default Dashboard;
