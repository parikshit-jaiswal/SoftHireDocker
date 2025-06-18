


import React from 'react'

function Header() {
    return (
        <>
            <div className="h-[65vh] mt-[4rem] bg-[linear-gradient(0deg,rgba(0,0,0,0.5)_0%,rgba(0,0,0,0.5)_100%),url('/pricing/Aboutbg.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center text-white">
                <div className="text-center">
                    <p className='text-6xl font-bold'>Empowering Global Tech Recruitment</p>
                    <p className='w-full mx-auto mt-6 font-medium'> We simplify hiring software engineers internationally with zero
                    hassle.</p>
                </div>
            </div>
        </>
    )
}

export default Header