import React, { useContext, useEffect, useRef, useState } from 'react'
import Quill from 'quill'
import { JobCategories, JobLocations } from '../assets/assets'
import axios from 'axios'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'

const AddJob = () => {
  const [title,setTitle]=useState('')
  const [location,setLocation]=useState('Banglore')
  const [category,setCategory]=useState('Programming')
  const [level,setLevel]=useState('Beginner level')
  const [salary,setSalary]=useState(0)

  const editorRef=useRef(null)
  const quillRef=useRef(null)
  const {backendUrl}=useContext(AppContext)

  const onSubmitHandler = async (e) => {
    e.preventDefault();
  
    try {
      const description = quillRef.current.root.innerHTML;
  
      const response = await axios.post(backendUrl + '/api/company/post-job', 
        { title, description, location, salary, category, level }, 
        { withCredentials: true }
      );
  
      console.log("Response from API:", response); // Debugging
  
      if (response.data?.success) {
        toast.success(response.data.message || "Job added successfully!");
        setTitle('');
        setSalary(0);
        quillRef.current.root.innerHTML = "";
      } else {
        toast.error(response.data?.message || "Failed to add job");
      }
    } catch (error) {
      console.error("Error while adding job:", error);
      toast.error(error.response?.data?.message || "An error occurred while adding the job.");
    }
  };
  
  useEffect(()=>{

    // initiate quill only once

    if(!quillRef.current && editorRef.current){
      quillRef.current=new Quill(editorRef.current,{
        theme:'snow',
      })
    }



  },[])
  return (
   <form onSubmit={onSubmitHandler} className='container p-4 flex flex-col w-full items-start gap-3'>


    <div className='w-full '>
      <p className='mb-2 '>Job Title</p>
      <input type="text" placeholder='Type Here' onChange={e=>setTitle(e.target.value)} value={title}
      required className='w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded'/>
    </div>

    <div className='w-full max-w-lg'>

      <p className='my-2'>Job Description</p>
      <div ref={editorRef}>

      </div>

    </div>

    <div className='flex flex-col sm:flex-row gap-2 w-full sm:gap-8'>
      <div>
        <p className='mb-2'>Job Category</p>
        <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' onChange={e=>setCategory(e.target.value)}>
          {JobCategories.map((category,index)=>(
            <option key={index} value={category}>{category}</option>
          ))}

        </select>
      </div>

      <div>
        <p className='mb-2'>Job Location</p>
        <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' onChange={e=>setLocation(e.target.value)}>
          {JobLocations.map((location,index)=>(
            <option key={index} value={location}>{location}</option>
          ))}

        </select>
      </div>

      <div>
        <p className='mb-2'>Job Lever</p>
        <select className='w-full px-3 py-2 border-2 border-gray-300 rounded' onChange={e=>setLevel(e.target.value)}>
          
            <option value='Beginner level'>Beginner Lever</option>
            <option value='Intermediate level'>Intermediate Lever</option>
            <option value='Senior level'>Senior Lever</option>


        

        </select>
      </div>
    </div>

    <div>
      <p className='mb-2'>Job Salary</p>
      <input min={0} className='w-full px-3 py-2 border-2 border-gray-300 rounded sm:w-[120px]' type="Number" placeholder='25000' onChange={e=>setSalary(e.target.value) } value={salary}/>

    </div>

    <button className='w-28 py-3 mt-4 bg-black text-white rounded '>ADD</button>



   </form>
  )
}

export default AddJob