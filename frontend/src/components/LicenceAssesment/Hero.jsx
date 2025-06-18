import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

function Hero() {
    return (
        <div className="h-[65vh] mt-[4rem] bg-[linear-gradient(0deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.5)_100%),url('/LicenceAssessment/LicenceAssessmentHero.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center text-white">
            <div className="text-center">
                <p className='text-4xl lg:text-6xl font-bold'>Sponser License Eligibility Assessment</p>
                <p className='lg:w-[70%] mx-auto mt-6 font-medium'>Quickly assess your company's eligibility to hire international talent.</p>
                <Link to="/assessment"><Button className="w-fit h-14 text-lg p-5 bg-[#E65C4F] hover:bg-[#cd5449] hover:opacity-85 mt-10">Start Assessment</Button></Link>
            </div>
        </div>
    )
}

export default Hero