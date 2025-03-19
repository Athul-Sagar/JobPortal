import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { FiMenu } from "react-icons/fi";
import { AppContext } from "../context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { setShowRecruiterLogin,backendUrl } = useContext(AppContext);
  const navigate = useNavigate();

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

  const handleLogout = async () => {
    try {
      await axios.post(backendUrl + '/api/auth/logout', {}, { 
        withCredentials: true 
      });
      setUser(null);
      setDropdownOpen(false);
      navigate("/");
      // Add page reload to ensure cookie changes take effect
      window.location.reload();
    } catch (error) {
      console.log("Error logging out:", error.response?.data || error);
      toast.error(error.response?.data?.message || "Logout failed");
    }
  };

  return (
    <header className="max-w-7xl mx-auto p-4">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <div>
          <img src={assets.logo} alt="Logo" className="w-32 sm:w-40" />
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-5">
          {user ? (
            <>
              <Link to="/applications">
                <button className="btn btn-soft">Applied Jobs</button>
              </Link>
              
              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  onMouseEnter={() => setDropdownOpen(true)}
                  onMouseLeave={() => setDropdownOpen(false)}
                  className="btn btn-primary py-3 px-6 rounded-full relative"
                >
                  {user.name}
                </button>

                {/* Dropdown Menu */}
                {dropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-40 bg-white shadow-md rounded-lg py-2"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <button 
                      onClick={handleLogout} 
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
             <button 
  onClick={() => setShowRecruiterLogin(true)} 
  className="px-6 py-3 rounded-full border border-blue-500 text-blue-500 font-semibold shadow-md transition-all duration-300 hover:bg-blue-500 hover:text-white"
>
  Recruiter Login
</button>
<Link to="/authform">
  <button 
    className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-md transition-all duration-300 hover:scale-105"
  >
    Login
  </button>
</Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-2xl" onClick={() => setIsOpen(!isOpen)}>
          <FiMenu />
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="mt-4 flex flex-col items-center gap-3 md:hidden">
          {user ? (
            <>
              <Link to="/applications">
                <button className="btn btn-soft w-full">Applied Jobs</button>
              </Link>
              
              {/* Mobile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="btn btn-primary w-full"
                >
                  {user.name}
                </button>
                
                {dropdownOpen && (
                  <div className="absolute left-0 mt-2 w-full bg-white shadow-md rounded-lg py-2">
                    <button 
                      onClick={handleLogout} 
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button onClick={() => setShowRecruiterLogin(true)} className="btn btn-soft w-full">
                Recruiter Login
              </button>
              <Link to="/authform">
                <button className="btn btn-primary w-full">Login</button>
              </Link>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
