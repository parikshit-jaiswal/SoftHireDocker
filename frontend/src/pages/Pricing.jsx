import Footer from '@/components/Footer'
import FAQSection from '@/components/Home/FAQSection'
import Navbar from '@/components/Navbar'
import ContactForm from '@/components/Pricing/Contact'
import PricingBanner from '@/components/Pricing/Header'
import PricingDetails from '@/components/Pricing/pricingPlans'
import React from 'react'

const Pricing = () => {
  return (
    <div>
      <Navbar/>
      <PricingBanner/>
      <PricingDetails/>
      <FAQSection/>
      <ContactForm/>
      <Footer/>
    </div>
  )
}

export default Pricing
