import Footer from '@/components/Footer.jsx'
import FAQSection from '@/components/Home/FAQSection.jsx'
import Hero from '@/components/LicenceAssesment/Hero.jsx'
import Main from '@/components/LicenceAssesment/Main.jsx'
import Navbar from '@/components/Navbar.jsx'
import React from 'react'

function LicenceAssessmentPage() {
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

export default LicenceAssessmentPage