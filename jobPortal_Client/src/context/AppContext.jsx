import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets.js";
import axios from "axios";
import { toast } from "react-toastify"; // Ensure this is imported if used

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  console.log(backendUrl)

  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });

  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRecruiterLogin, setShowRecruiterLogin] = useState(false);

  const [companyToken, setCompanyToken] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [userData,setUserData]=useState(null)
  const[userApplications,setUserApplications]=useState([])

  // // Helper function to get cookie value by name
  // const getCookie = (name) => {
  //   const cookies = document.cookie.split("; ");
  //   for (let cookie of cookies) {
  //     const [key, value] = cookie.split("=");
  //     if (key === name) {
  //       return decodeURIComponent(value);
  //     }
  //   }
  //   return null;
  // };

  const fetchJobs = async () => {
    try {

      const {data}=await axios.get(`${backendUrl}/api/jobs`)

      if(data.success){
        setJobs(data.jobs)
        console.log(data.jobs)
  console.log(backendUrl)

      }else{
        toast.error(data.message)
      }
      
    } catch (error) {

      toast.error(error.message)
      
    }
  };

  // Function to fetch company data
  const fetchCompanyData = async () => {
    try {
      const { data } = await axios.get(`${backendUrl}/api/company/company`, {
        withCredentials: true // Rely on cookies only
      });
  
      if (data.success) {
        setCompanyData(data.company);
        console.log("Company data:", data.company); // Better logging
      }
    } catch (error) {
      console.error("Error fetching company data:", error);
      setCompanyData(null); // Clear company data on error
    }
  };

  useEffect(() => {
    fetchJobs();

    // Get the token from cookies
    
  }, []);


  // Fuctions to fetch user's applied applications data

  const fetchUserApplications=async()=>{
    try{
      const token=await getToken()

      const {data}=await axios.get(backendUrl +'/api/auth/applications',
        {withCredentials:true}
      )

      if(data.success){
        setUserApplications(data.applications)
      }else{
        toast.error(data.message)
      }
    }catch(error){
      toast.error(error.message)
    
    }
  }

  // Fetch company data when the token is set
  useEffect(() => {
    if (companyToken) {
      fetchCompanyData();
    }
  }, [companyToken]);

  const value = {
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    showRecruiterLogin,
    setShowRecruiterLogin,
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
    backendUrl,
    fetchUserApplications
  };

  return <AppContext.Provider value={value}>{props.children}</AppContext.Provider>;
};
