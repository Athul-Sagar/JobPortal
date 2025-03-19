import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const ViewApplication = () => {
  const { backendUrl } = useContext(AppContext);
  const [applicants, setApplicants] = useState([]);
  const [companyToken, setCompanyToken] = useState(null);

  // Fetch company details and store token
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get(
          `${backendUrl}/api/company/company`,
          { withCredentials: true }
        );

        if (response.data) {
          setCompanyToken(response.data._id);
        } else {
          console.warn("Company data not found in response!");
        }
      } catch (error) {
        toast.error("Failed to fetch company data");
        console.error("Error fetching company:", error);
      }
    };

    fetchCompanyData();
  }, [backendUrl]);

  // Fetch applicants
  const fetchCompanyJobApplications = async () => {
    if (!companyToken) return; // Ensure token is available

    try {
      const response = await axios.get(
        `${backendUrl}/api/company/applicants`,
        {
          headers: {
            Authorization: `Bearer ${companyToken}`,
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setApplicants(response.data.applications || []);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unauthorized access");
      console.error("Error fetching applicants:", error);
    }
  };

  // Fetch applications when companyToken is available
  useEffect(() => {
    fetchCompanyJobApplications();
  }, [companyToken, backendUrl]);

  // Function to update job application status
  const changeJobApplicationStatus = async (id, status) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/company/change-status",
        { id, status },
        { withCredentials: true }
      );

      if (data.success) {
        fetchCompanyJobApplications(); // Now this function is accessible
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <table className="w-full max-w-4xl bg-white border border-gray-200 max-sm:text-sm">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-4 text-left">#</th>
            <th className="py-2 px-4 text-left">UserName</th>
            <th className="py-2 px-4 text-left max-sm:hidden">Job Title</th>
            <th className="py-2 px-4 text-left max-sm:hidden">Location</th>
            <th className="py-2 px-4 text-left">Resume</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {applicants.length > 0 ? (
            applicants.map((applicant, index) => (
              <tr key={index} className="text-gray-700">
                <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                <td className="py-2 px-4 border-b text-center flex items-center">
                  <img
                    className="w-10 h-10 rounded-full mr-3 max-sm:hidden"
                    src={
                      backendUrl + `/${applicant.userId?.image}` ||
                      assets.default_user_icon
                    }
                    alt={applicant.userId?.name || "User"}
                  />
                  <span>{applicant.userId?.name || "Unknown"}</span>
                </td>
                <td className="py-2 px-4 border-b max-sm:hidden">
                  {applicant.jobId.title}
                </td>
                <td className="py-2 px-4 border-b max-sm:hidden">
                  {applicant.jobId.location}
                </td>
                <td className="py-2 px-4 border-b">
                  <a
                    href={backendUrl + `${applicant.userId?.resume}`}
                    target="_blank"
                    className="bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center"
                    rel="noreferrer"
                  >
                    Resume <img src={assets.resume_download_icon} alt="" />
                  </a>
                </td>
                <td className="py-2 px-4 border-b relative">
                  {applicant.status === "pending" ? (
                    <div className="relative inline-block text-left group">
                      <button className="text-gray-500 action-button">...</button>
                      <div className="z-10 hidden absolute right-0 md:left-0 top-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block">
                        <button
                          onClick={() =>
                            changeJobApplicationStatus(applicant._id, "Accepted")
                          }
                          className="block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            changeJobApplicationStatus(applicant._id, "Rejected")
                          }
                          className="block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100"
                        >
                          Reject
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>{applicant.status}</div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="text-center py-4">
                No applications found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ViewApplication;
