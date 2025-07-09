import React from 'react'

function Card({ item }) {
    return (
        <div className={`md:grid md:grid-cols-5 space-x-8 space-y-10  justify-center items-center  py-8 md:py-20 px-[7%]`}>
            <div className={`col-span-2 object-cover flex justify-center items-center md:mt-10 ${item?.imgDir == "right" ? "md:hidden" : ""}`}><img className='rounded-lg h-[20rem] ' src={item.image} alt="" /></div>
            <div className="col-span-3">
                <div className="flex flex-col gap-5 lg:w-[90%]">
                    <div className="text-3xl lg:text-5xl font-bold">{item.title}</div>
                    <div className="text-lg">{item.description}</div>
                </div>
            </div>
            <div className={`col-span-2 object-cover flex justify-center items-center ${item?.imgDir == "left" ? "hidden" : "hidden md:block"}`}><img className='rounded-lg ' src={item.image} alt="" /></div>
        </div>
    )
}

function Main() {

    const data = [
        {
            title: 'Why It’s Important for Your Business',
            description: 'To hire international talent in the UK, businesses must hold a valid Sponsor License. This license allows employers to legally sponsor skilled workers from outside the UK, filling critical skill gaps and driving business growth. With a Sponsor License, your organization gains the ability to tap into a global pool of qualified candidates, helping you stay competitive in today’s dynamic market.',
            image: '/LicenseAssessment/rightComp.png',
            imgDir: "right"
        },
        {
            title: 'Eligibility Criteria',
            description:
                <div className='space-y-3'>
                    <p>To qualify for a Sponsor License, your business must:</p>
                    <p className='flex gap-4'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 30 29" fill="none">
                            <path d="M8.925 14.5L12.975 18.55L21.075 10.45M28.5 14.5C28.5 21.9558 22.4558 28 15 28C7.54415 28 1.5 21.9558 1.5 14.5C1.5 7.04415 7.54415 1 15 1C22.4558 1 28.5 7.04415 28.5 14.5Z" fill="#276EF1" />
                            <path d="M28.5 14.5C28.5 21.9558 22.4558 28 15 28C7.54415 28 1.5 21.9558 1.5 14.5C1.5 7.04415 7.54415 1 15 1C22.4558 1 28.5 7.04415 28.5 14.5Z" fill="#276EF1" />
                            <path d="M8.925 14.5L12.975 18.55L21.075 10.45M28.5 14.5C28.5 21.9558 22.4558 28 15 28C7.54415 28 1.5 21.9558 1.5 14.5C1.5 7.04415 7.54415 1 15 1C22.4558 1 28.5 7.04415 28.5 14.5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <p>Be a legitimate and active organization operating lawfully in the UK</p>
                    </p>
                    <p className='flex gap-4'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 30 29" fill="none">
                            <path d="M8.925 14.5L12.975 18.55L21.075 10.45M28.5 14.5C28.5 21.9558 22.4558 28 15 28C7.54415 28 1.5 21.9558 1.5 14.5C1.5 7.04415 7.54415 1 15 1C22.4558 1 28.5 7.04415 28.5 14.5Z" fill="#276EF1" />
                            <path d="M28.5 14.5C28.5 21.9558 22.4558 28 15 28C7.54415 28 1.5 21.9558 1.5 14.5C1.5 7.04415 7.54415 1 15 1C22.4558 1 28.5 7.04415 28.5 14.5Z" fill="#276EF1" />
                            <path d="M8.925 14.5L12.975 18.55L21.075 10.45M28.5 14.5C28.5 21.9558 22.4558 28 15 28C7.54415 28 1.5 21.9558 1.5 14.5C1.5 7.04415 7.54415 1 15 1C22.4558 1 28.5 7.04415 28.5 14.5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <p>Have genuine vacancies that meet the skill and salary thresholds</p>
                    </p>
                    <p className='flex gap-4'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 30 29" fill="none">
                            <path d="M8.925 14.5L12.975 18.55L21.075 10.45M28.5 14.5C28.5 21.9558 22.4558 28 15 28C7.54415 28 1.5 21.9558 1.5 14.5C1.5 7.04415 7.54415 1 15 1C22.4558 1 28.5 7.04415 28.5 14.5Z" fill="#276EF1" />
                            <path d="M28.5 14.5C28.5 21.9558 22.4558 28 15 28C7.54415 28 1.5 21.9558 1.5 14.5C1.5 7.04415 7.54415 1 15 1C22.4558 1 28.5 7.04415 28.5 14.5Z" fill="#276EF1" />
                            <path d="M8.925 14.5L12.975 18.55L21.075 10.45M28.5 14.5C28.5 21.9558 22.4558 28 15 28C7.54415 28 1.5 21.9558 1.5 14.5C1.5 7.04415 7.54415 1 15 1C22.4558 1 28.5 7.04415 28.5 14.5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <p>Demonstrate robust HR and record-keeping systems to manage sponsored employees</p>
                    </p>
                    <p className='flex gap-4 justify-center items-center'>
                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 30 29" fill="none">
                            <path d="M8.925 14.5L12.975 18.55L21.075 10.45M28.5 14.5C28.5 21.9558 22.4558 28 15 28C7.54415 28 1.5 21.9558 1.5 14.5C1.5 7.04415 7.54415 1 15 1C22.4558 1 28.5 7.04415 28.5 14.5Z" fill="#276EF1" />
                            <path d="M28.5 14.5C28.5 21.9558 22.4558 28 15 28C7.54415 28 1.5 21.9558 1.5 14.5C1.5 7.04415 7.54415 1 15 1C22.4558 1 28.5 7.04415 28.5 14.5Z" fill="#276EF1" />
                            <path d="M8.925 14.5L12.975 18.55L21.075 10.45M28.5 14.5C28.5 21.9558 22.4558 28 15 28C7.54415 28 1.5 21.9558 1.5 14.5C1.5 7.04415 7.54415 1 15 1C22.4558 1 28.5 7.04415 28.5 14.5Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                        <p>Be compliant with UK immigration rules and not have any history of immigration offences</p>
                    </p>
                </div>,
            image: '/LicenseAssessment/leftComp.png',
            imgDir: "left"
        }
    ];

    return (
        <>
            <Card item={data[0]} />
            <Card item={data[1]} />
        </>
    )
}

export default Main