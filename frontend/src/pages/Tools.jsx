import React from 'react'
import Hero from '../components/Tools/Hero.jsx'
import Navbar from '@/components/Navbar.jsx'
import Footer from '@/components/Footer.jsx'
import Main from '@/components/Tools/Main.jsx'

function Resources2() {
    return (
        <>
            <Navbar />
            <Hero />
            <div className="mb-16"><Main /></div>
            <Footer />
        </>
    )
}

export default Resources2