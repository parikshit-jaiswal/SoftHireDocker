import React from 'react'

function Hero() {
    return (
        <>
            <div className="h-[65vh] mt-[4rem] bg-[linear-gradient(0deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.5)_100%),url('/events/hero-bg.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center text-white">
                <div className="text-center">
                    <p className='text-5xl md:text-6xl font-bold'>Learn and Connect</p>
                    <p className='md:w-[70%] mx-auto mt-6 font-medium'>Access expert insights, attend webinars, and explore real-world case studies to make informed hiring and career decisions.</p>
                </div>
            </div>
        </>
    )
}

export default Hero