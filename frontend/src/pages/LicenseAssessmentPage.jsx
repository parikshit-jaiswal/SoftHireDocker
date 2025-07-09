import Footer from '@/components/Footer.jsx'
import FAQSection from '@/components/Home/FAQSection.jsx'
import Hero from '@/components/LicenseAssesment/Hero.jsx'
import Main from '@/components/LicenseAssesment/Main.jsx'
import Navbar from '@/components/Navbar.jsx'
import React from 'react'

function LicenseAssessmentPage() {
    return (
        <>
            <Navbar />
            <Hero />
            <Main />
            <FAQSection />
            <Footer />
        </>
    )
}

export default LicenseAssessmentPage