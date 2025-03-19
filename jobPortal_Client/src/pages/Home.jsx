import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import JobListing from '../components/jobListing'
import AppDownload from '../components/AppDownload'
import Footer from '../components/Footer'


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