import React, { useContext, useRef } from 'react'
import { assets } from '../assets/assets'
import { AppContext } from '../context/AppContext'

const Hero = () => {

    const {setSearchFilter,setIsSearched}=useContext(AppContext)

    const titleRef=useRef(null)
    const locationRef=useRef(null)

    const onSearch=()=>{

        setSearchFilter({
            title:titleRef.current.value,
            location:locationRef.current.value,

        })

        setIsSearched(true)
        
        

    }



    return (
        <main className='max-w-7xl  mx-auto my-10'>

            <div className='bg-gradient-to-r from-purple-800 to-purple-950 max-w-[1199px] h-[354px] p-5 rounded-xl py-16 text-white mx-2 text-center'>
                <div>
                    <h1 className='text-2xl md:text-3xl lg:text-4xl font-medium mb-4 '>Over 10,000+ jobs to apply</h1>
                    <p className='mb-8 max-w-xl mx-auto text-sm font-light px-5' >Your Next Big Carrer Move Starts Right Here-Explore the Best Job Opportunity
                        And Take the First Step Toward Your Future!</p>
                    <div className='flex items-center justify-between bg-white rounded text-gray-600 max-w-xl pl-4 mx-4 sm:mx-auto'>
                        <div className='flex items-center'>
                            <img src={assets.search_icon} alt="" className='h-4 sm:h-5' />
                            <input
                                type="text"
                                placeholder='Search for jobs'
                                className='max-sm:text-xs p-2 outline-none w-full bg-transparent'
                                ref={titleRef}
                            />
                        </div>

                        <div className='flex items-center'>
                            <img src={assets.location_icon} alt="" className='h-4 sm:h-5' />
                            <input
                                type="text"
                                placeholder='Search for Location'
                                className='max-sm:text-xs p-2 outline-none  w-full bg-transparent'
                                ref={locationRef}
                            />
                        </div>

                        <button onClick={onSearch} className="bg-blue-600 px-6 py-2 rounded text-white m-1">Search</button>
                    </div>
                </div>

                


            </div>
            <div className='max-w-7xl   my-10 border border-gray-300 shadow-md mx-2 mt-5 p-6 rounded-md flex'>
                    <div className='flex justify-center gap-10 lg:gap-16 flex-wrap'>
                        <p className='font-medium'>Trusted By </p>
                        <img className='h-6' src={assets.microsoft_logo} alt="" />
                        <img className='h-6' src={assets.walmart_logo}  alt=""  />
                        <img className='h-6' src={assets.accenture_logo} alt="" />
                        <img className='h-6' src={assets.samsung_logo} alt="" />
                        <img className='h-6' src={assets.amazon_logo}  alt="" />
                        <img className='h-6' src={assets.adobe_logo}  alt="" />
                    </div>
                </div>


        </main>
    )
}

export default Hero