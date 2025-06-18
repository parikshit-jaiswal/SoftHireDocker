import { useRef } from 'react'
import { Button } from '../ui/button'
import { gsap } from "gsap";
import { useGSAP } from '@gsap/react';
import { CustomEase } from 'gsap/all';
import { Link } from 'react-router-dom';

function Hero() {

    const img1 = useRef();
    const img2 = useRef();
    const img3 = useRef();
    const img4 = useRef();

    useGSAP(() => {
        gsap.to(img1.current, {
            x: 10,
            y: 20,
            duration: 2.75,
            ease: CustomEase.create("custom", "M0,0 C0.126,0.382 0.281,0.826 0.439,0.974 0.631,1.154 0.903,0.119 1,0.01 "),
            delay: 2,
            repeat: -1,
        });
    })
    useGSAP(() => {
        gsap.to(img2.current, {
            x: -10,
            y: 20,
            duration: 2.75,
            ease: CustomEase.create("custom", "M0,0 C0.126,0.382 0.281,0.826 0.439,0.974 0.631,1.154 0.903,0.119 1,0.01 "),
            delay: 2,
            repeat: -1,
        });
    })
    useGSAP(() => {
        gsap.to(img3.current, {
            x: 10,
            y: -5,
            duration: 2.75,
            ease: CustomEase.create("custom", "M0,0 C0.126,0.382 0.281,0.826 0.439,0.974 0.631,1.154 0.903,0.119 1,0.01 "),
            delay: 2,
            repeat: -1,
        });
    })
    useGSAP(() => {
        gsap.to(img4.current, {
            x: -10,
            y: -5,
            duration: 2.75,
            ease: CustomEase.create("custom", "M0,0 C0.126,0.382 0.281,0.826 0.439,0.974 0.631,1.154 0.903,0.119 1,0.01 "),
            delay: 2,
            repeat: -1,
        });
    })

    return (
        <div className="flex justify-between items-center mt-[10rem] md:px-[5%] w-full">
            <div className="flex-col space-y-[8rem]  hidden md:flex z-0">
                <img ref={img1} className='motion-translate-x-in-[200%] motion-translate-y-in-[71%] motion-duration-[1750ms] motion-duration-[1550ms]/translate motion-delay-[500ms]' src="hero/img1.svg" alt="" />
                <img ref={img3} className='motion-translate-x-in-[200%] motion-translate-y-in-[-69%] motion-duration-[1750ms] motion-delay-[500ms]' src="hero/img3.svg" alt="" />
            </div>
            <div className='flex flex-col justify-center items-center'>
                <div className="w-full md:w-[80%] z-20">
                    <div className="text-2xl lg:text-4xl text-wrap font-bold text-center mb-5">Your Integrated International Recruitment and Immigration Portal</div>
                    <div className="text-center text-[14px] font-semibold opacity-60 mb-10">Become a Skilled Worker Visa Sponsor – Comply with your sponsorship obligations-  Gain access to international talent</div>
                </div>
                <div className=" flex  flex-col md:flex-row gap-4 min-w-20 flex-wrap text-center justify-center">
                    <Link to="/e"><Button variant="hero1" size="hero">Get Started</Button></Link>
                    <Link to="/login"><Button variant="hero2" size="hero">Explore Jobs</Button></Link>
                </div>
            </div>
            <div className="flex-col space-y-[8rem]  hidden md:flex z-0">
                <img ref={img2} className='motion-translate-x-in-[-189%] motion-translate-y-in-[65%] motion-duration-[1750ms] motion-delay-[500ms]' src="hero/img2.svg" alt="" />
                <img ref={img4} className='motion-translate-x-in-[-200%] motion-translate-y-in-[-100%] motion-duration-[1750ms] motion-duration-[1550ms]/translate motion-delay-[500ms]' src="hero/img4.svg" alt="" />
            </div>
        </div>
    )
}

export default Hero