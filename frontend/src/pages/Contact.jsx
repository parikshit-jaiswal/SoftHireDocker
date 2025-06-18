import ContactForm from '@/components/Contact/Form'
import Header from '@/components/Contact/Header'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import React from 'react'

const Contact = () => {
  return (
    <div>
      <Navbar />
      <Header />
      <div className="md:px-[7%]">
        <ContactForm />
      </div>
      <Footer />
    </div>
  )
}

export default Contact
