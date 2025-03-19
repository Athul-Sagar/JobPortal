import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import AppDownload from '../components/AppDownload'
import Footer from '../components/Footer'
import JobListing from '../components/jobListing'



const Home = () => {
  return (
    <div>
      <Header/>
      <Hero/>
      <JobListing/>
      <AppDownload/>
      <Footer/>
    </div>
  )
}

export default Home