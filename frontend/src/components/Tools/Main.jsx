import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom';

function Content({ item }) {
    return (
        <div className={`md:grid md:grid-cols-5  justify-center items-center py-10 px-[8%] ${item?.bg}`}>
            <div className={`col-span-2 object-fill flex justify-center items-center ${item?.imgDir == "right" ? "md:hidden" : ""}`}><img src={item.image} alt="" /></div>
            <div className="col-span-3">
                <div className="flex flex-col gap-5 lg:w-[90%]">
                    <div className="text-3xl lg:text-5xl font-bold">{item?.title}</div>
                    <div className="text-lg">{item?.description}</div>
                    <Link to={item?.link}><Button className="w-[45%] p-5 bg-[#E65C4F] hover:bg-[#E65C4F] hover:opacity-85">{item.button}</Button></Link>
                </div>
            </div>
            <div className={`col-span-2 object-fill flex justify-center items-center ${item?.imgDir == "left" ? "hidden" : "hidden md:block"}`}><img src={item.image} alt="" /></div>
        </div>
    )
}

function Main() {

    const data = [
        {
            title: 'Immigration Skill Charge Calculator',
            description: 'Easily check if your business meets the requirements to apply for a Sponsor Licence and start hiring international talent.',
            button: 'Learn More',
            image: '/tools/img1.svg',
            bg: 'bg-white',
            imgDir: "right",
            link: "/imigration-skill-charge-calculator"
        },
        {
            title: 'Sponsor Licence Eligibility Assessment',
            description: 'Quickly determine the minimum salary needed to sponsor a skilled worker based on job role and visa type.',
            button: 'Learn More',
            image: '/tools/img2.svg',
            bg: 'bg-[#E9EEF4]',
            imgDir: "left",
            link: "/sponsor-licence-assessment"

        },
        {
            title: 'Skilled Worker Minimum Salary Calculator',
            description: 'Get an accurate estimate of all fees involved in applying for and maintaining a Sponsor Licence.',
            button: 'Learn More',
            image: '/tools/img3.svg',
            bg: 'bg-white',
            imgDir: "right",
            link: "/salary-calculator"
        },
        {
            title: 'Sponsor Licence Cost Estimator',
            description: 'Calculate the exact Immigration Skill Charges you’ll need to pay when hiring foreign workers.',
            button: 'Learn More',
            image: '/tools/img4.svg',
            bg: 'bg-[#E9EEF4]',
            imgDir: "left",
            link: "/cost-estimator"
        },

    ];

    return (
        <>
            <div className="mb-[-5rem]">
                {data.map((item, index) => (
                    <Content key={index} item={item} />
                ))}
            </div>
        </>
    )
}

export default Main