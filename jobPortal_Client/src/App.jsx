import React, { useContext } from 'react';
import { Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Applyjob from './pages/Applyjob';
import Application from './pages/Application';
import RecruiterLogin from './components/RecruiterLogin';
import { AppContext } from './context/AppContext';
import Dashboard from './pages/Dashboard';
import AddJob from './pages/AddJob';
import MangeJobs from './pages/MangeJobs';
import ViewApplication from './pages/ViewApplication';
import 'quill/dist/quill.snow.css'
import AuthForm from './pages/AuthForm';
import  {ToastContainer,toast} from 'react-toastify'
import  'react-toastify/dist/ReactToastify.css'


const App = () => {
  const { showRecruiterLogin } = useContext(AppContext); // Now correctly getting value
  
  

  return (
    <div>
      {showRecruiterLogin && <RecruiterLogin />}
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/apply-job/:id' element={<Applyjob />} />
        <Route path='/authform' element={<AuthForm/>} />
        <Route path='/applications' element={<Application />} />
        <Route path='/dashboard' element={<Dashboard />}>
          <Route path='add-job' element={<AddJob />} />
          <Route path='manage-job' element={<MangeJobs />} />
          <Route path='view-applications' element={<ViewApplication />} />
        </Route>



      </Routes>
    </div>
  );
};

export default App;