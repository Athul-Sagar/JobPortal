import React from 'react'
import Header from '../components/Header'
import Hero from '../components/Hero'
import AppDownload from '../components/AppDownload'
import Footer from '../components/Footer.jsx'
import JobListing from '../components/JobListing'




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