import { useContext, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const AuthForm = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const { backendUrl } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    resume: null,
    image: null,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let dataToSend;
      let headers = {};

      if (isLogin) {
        dataToSend = {
          email: formData.email,
          password: formData.password,
        };
        headers["Content-Type"] = "application/json";
      } else {
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("email", formData.email);
        formDataToSend.append("password", formData.password);
        if (formData.resume) formDataToSend.append("resume", formData.resume);
        if (formData.image) formDataToSend.append("image", formData.image);

        dataToSend = formDataToSend;
        headers["Content-Type"] = "multipart/form-data";
      }

      const endpoint = isLogin
        ? backendUrl + "/api/auth/login"
        : backendUrl + "/api/auth/register";

      const response = await axios.post(endpoint, dataToSend, {
        headers,
        withCredentials: true,
      });

      toast.success(response.data.message, {
        position: "top-right",
        autoClose: 3000,
      });

      setTimeout(() => {
        navigate("/");
      }, 3000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <ToastContainer />
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-center text-2xl font-semibold text-gray-800">
          {isLogin ? "Sign in to your account" : "Create an account"}
        </h2>

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-600">Full Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={handleChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Resume (PDF)</label>
                <input
                  type="file"
                  name="resume"
                  accept=".pdf"
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={handleFileChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600">Profile Image</label>
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onChange={handleFileChange}
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-600">Email address</label>
            <input
              type="email"
              name="email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={handleChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              onChange={handleChange}
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-300"
            >
              {isLogin ? "Sign in" : "Register"}
            </button>
          </div>
        </form>

        <div className="mt-4 text-center text-sm">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-indigo-600 hover:underline font-medium"
          >
            {isLogin ? "Create one" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
