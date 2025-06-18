import React from 'react'

function Card({ item }) {
    return (
        <div className={`md:grid md:grid-cols-5 space-x-8 space-y-10  justify-center items-center py-8 md:py-16 px-[7%] ${item?.bg}`}>
            <div className={`col-span-2 object-cover flex justify-center items-center md:mt-10 ${item?.imgDir == "right" ? "md:hidden" : ""}`}><img className='rounded-lg h-[20rem] ' src={item.image} alt="" /></div>
            <div className="col-span-3">
                <div className="flex flex-col gap-5 lg:w-[90%]">
                    <div className="text-3xl lg:text-5xl font-bold">{item?.title}</div>
                    <div className="text-lg">{item?.description}</div>
                </div>
            </div>
            <div className={`col-span-2 object-cover flex justify-center items-center md:mt-10 ${item?.imgDir == "left" ? "hidden" : "hidden md:block"}`}><img className='rounded-lg ' src={item.image} alt="" /></div>
        </div>
    )
}

function Main() {

    const data = [
        {
            title: 'What is the Immigration Skills Charge?',
            description: "The Immigration Skills Charge (ISC) is a fee that UK employers must pay when sponsoring a Skilled Worker or Senior/Specialist Worker on a visa. It’s designed to encourage investment in the domestic workforce and to help fund training programs for UK-based workers.This charge applies per sponsored employee and is based on the duration of the sponsorship and the size of the organisation (small/charity vs. medium/large business).",
            image: '/imigrationSkillChargeCalculator/img1.png',
            imgDir: "right",
            bg: "bg-[#E9EEF4]"
        },
        {
            title: 'How Does the Immigration Skills Charge Calculator Work?',
            description:
                <div className='space-y-3 text-[0.5]'>
                    <p>Our Immigration Skills Charge Calculator simplifies the process of estimating the total cost you’ll incur:</p>
                    <ol>
                        <li>1. Select your business size (small/charity or large)</li>
                        <li>2. Choose the length of the sponsorship (in months or years) </li>
                        <li>3. Get an instant estimate of the Immigration Skills Charge payable for that sponsorship</li>
                    </ol>
                </div>,
            image: '/imigrationSkillChargeCalculator/img2.png',
            imgDir: "left"
        },
        {
            title: 'Benefits of Using the Skills Charge Calculator',
            description:
                <div className='text-[0.5]'>
                    <ol className='space-y-3'>
                        <li><b>1. Saves Time:</b> Instantly calculates complex fee structures in seconds</li>
                        <li><b>2. Improves Accuracy:</b> Avoids common mistakes in fee estimation</li>
                        <li><b>3. Helps with Budgeting:</b> Provides clear financial insights for planning your hiring strategy</li>
                        <li><b>4. User-Friendly:</b> No jargon—just straightforward inputs and clear results</li>
                    </ol>
                </div>,
            image: '/imigrationSkillChargeCalculator/img3.png',
            imgDir: "right",
            bg: "bg-[#E9EEF4]"
        },

    ];

    return (
        <>
            <div className="mb-[-5rem]">
                <Card item={data[0]} />
                <Card item={data[1]} />
                <Card item={data[2]} />
            </div>
        </>
    )
}

export default Main