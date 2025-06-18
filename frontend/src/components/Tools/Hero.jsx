import React from 'react'

function Hero() {
    return (
        <>
            <div className="h-[65vh] mt-[4rem] bg-[linear-gradient(0deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.5)_100%),url('/tools/heroR2.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center text-white">
                <div className="text-center">
                    <p className='text-4xl lg:text-6xl font-bold'>Powerful Hiring & Compliance Tools</p>
                    <p className='lg:w-[70%] mx-auto mt-6 font-medium'>Easily assess your eligibility,calculate costs, and simplify UK work visa requirements</p>
                </div>
            </div>
        </>
    )
}

export default Hero