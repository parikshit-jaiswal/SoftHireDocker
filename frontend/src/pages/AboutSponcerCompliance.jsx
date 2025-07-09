import Hero from '@/components/AboutSponcerCompliance/Hero'
import Main from '@/components/AboutSponcerCompliance/Main'
import FAQSection from '@/components/Home/FAQSection'
import Navbar from '@/components/Navbar'
import React from 'react'
import { Footer } from 'react-day-picker'

function AboutSponcerCompliance() {
    return (
        <>
            <Navbar />
            <Hero />
            <Main />
            <FAQSection />
            <div className="mt-[-5rem]">
                <Footer />
            </div>
        </>
    )
}

export default AboutSponcerCompliance