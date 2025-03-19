import React, { useContext, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';
import Loading from '../components/Loading';
import Header from '../components/Header';
import kconvert from 'k-convert';
import moment from 'moment';
import JobCard from '../components/JobCard';
import Footer from '../components/Footer';
import axios from 'axios';
import { toast } from 'react-toastify';

const Applyjob = () => {
  const { id } = useParams();
  const navigate=useNavigate()
  const [jobData, setJobData] = useState(null);
  const { jobs,backendUrl } = useContext(AppContext);
  const [user,setUser]=useState(null)

  const fetchJob = async () => {
    
    try {

      const {data}=await axios.get(backendUrl + `/api/jobs/${id}`)

    if(data.success){
      setJobData(data.job)
    }else{
      toast.error(data.message)
    }
  

      
      
    } catch (error) {

      toast.error(error.message)

      
    }

  }

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(backendUrl + '/api/auth/me', {
          withCredentials: true,
        });
        setUser(response.data);
      } catch (error) {
        console.log(error, "in fetchUser header");
      }
    };

    fetchUser();
  }, []);

  const applyHandler = async () => {
    try {
      if (!user) {
        toast.error('Login to Apply For Jobs');
        return;
      }
  
      if (!user.resume) {
        navigate('/applications');
        toast.error('Upload resume to apply');
        return;
      }
  
      // Sending request to apply for the job
      const response = await axios.post(
        backendUrl + `/api/auth/apply/`,
        { jobId: jobData._id },
        { withCredentials: true }
      );
  
      console.log("Apply Response:", response.data); // Debugging
  
      if (response.data.success) {
        toast.success('Applied successfully!');
      } else {
        toast.error(response.data.message || "Application failed.");
      }
    } catch (error) {
      console.error("Apply Error:", error); // Debugging
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };
  
  


    

  useEffect(() => {
    fetchJob()
    
  }, [id]);

  return jobData ? (
    <>
      <Header />
      <div className="min-h-screen flex flex-col py-6 md:py-10 max-w-7xl px-4 2xl:px-20 mx-auto">
        <div className="bg-white rounded-lg w-full">
          {/* Job Header Section */}
          <div className="flex flex-col md:flex-row justify-between gap-6 p-6 md:px-10 md:py-8 mb-6 bg-sky-50 border border-sky-200 rounded-xl">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <img 
                className="h-20 w-20 md:h-24 md:w-24 bg-white rounded-lg p-3 border border-gray-200"
                src={backendUrl +`/${jobData.companyId.companyImage} `}
                alt={jobData.companyId.name} 
              />
              <div className="text-center md:text-left">
                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                  {jobData.title}
                </h1>
                <div className="flex flex-wrap justify-center gap-3 md:gap-4 text-sm text-gray-600">
                  <span className="flex items-center gap-2">
                    <img src={assets.suitcase_icon} className="h-4 w-4" alt="company" />
                    {jobData.companyId.name}
                  </span>
                  <span className="flex items-center gap-2">
                    <img src={assets.location_icon} className="h-4 w-4" alt="location" />
                    {jobData.location}
                  </span>
                  <span className="flex items-center gap-2">
                    <img src={assets.person_icon} className="h-4 w-4" alt="level" />
                    {jobData.level}
                  </span>
                  <span className="flex items-center gap-2">
                    <img src={assets.money_icon} className="h-4 w-4" alt="salary" />
                    CTC: {kconvert.convertTo(jobData.salary)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-2">
              <button onClick={applyHandler} className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-6 py-2.5 rounded-lg font-medium w-full md:w-auto">
                Apply Now
              </button>
              <p className="text-xs md:text-sm text-gray-500">
                Posted {moment(jobData.date).fromNow()}
              </p>
            </div>
          </div>

          {/* Job Description Section */}
          <div className="flex flex-col lg:flex-row gap-8 px-4 md:px-10 pb-10">
            <div className="w-full lg:w-2/3">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Job Description</h2>
              <div className="rich-text prose prose-sm md:prose-base max-w-none text-gray-700 
                [&_h3]:text-lg [&_h3]:md:text-xl [&_h3]:font-semibold [&_h3]:text-gray-900 [&_h3]:mt-6 [&_h3]:mb-3
                [&_h4]:text-base [&_h4]:md:text-lg [&_h4]:font-medium [&_h4]:text-gray-900 [&_h4]:mt-5 [&_h4]:mb-2
                [&_p]:mb-4 [&_p]:leading-relaxed
                [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2
                [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2
                [&_li]:mb-2">
                <div dangerouslySetInnerHTML={{ __html: jobData.description }} />
              </div>
              <button onClick={applyHandler} className="bg-blue-600 hover:bg-blue-700 transition-colors text-white px-8 py-3 rounded-lg font-medium w-full md:w-auto mt-8">
                Apply Now
              </button>
            </div>
             {/* Right Section MOre Jobs  */}
            <div className='w-full lg:w-1/3 mt-8 lg:mt--0 lg:ml-8 space-y-5'>

              <h2>More jobs from {jobData.companyId.name}</h2>

              {jobs.filter(job =>job._id !== jobData._id && job.companyId._id === jobData.companyId._id).filter(job=>true).slice(0,4).map((job,index)=><JobCard key={index} job={job}/>)}

            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
  ) : (
    <Loading />
  );
};

export default Applyjob;