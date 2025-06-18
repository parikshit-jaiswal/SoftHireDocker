import Footer from '@/components/Footer'
import FAQSection from '@/components/Home/FAQSection'
import Navbar from '@/components/Navbar'
import BlogSection from '@/components/Events/BlogSection'
import EventsSection from '@/components/Events/EventsSection'
import Hero from '@/components/Events/Hero'
import StoriesCaseStudy from '@/components/Events/StoriesCaseStudy'
import React from 'react'

function Blogs() {
  return (
    <>
      <Navbar />
      <Hero />
      {/* <div className="px-[5%]">
        <EventsSection />
      </div> */}
      <div className="">
        <BlogSection />
      </div>
      {/* <div className="px-[7%]">
        <StoriesCaseStudy />
      </div > */}
      <FAQSection />
      <div className="mt-[-5rem]">
        <Footer />
      </div>
    </>
  )
}

export default Blogs