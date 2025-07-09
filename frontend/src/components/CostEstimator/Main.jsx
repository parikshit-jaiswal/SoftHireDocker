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
            title: 'Sponsor License Fees & Ongoing Costs',
            description:
                <>
                    <div className='text-[1rem] md:w-[90%]'>
                        <p >When hiring international talent in the UK, it's important to understand the full financial picture. The Sponsor License comes with a set of mandatory fees—both at the application stage and throughout its validity. Here's what you need to know:</p>
                        <div className=" mt-3 space-y-3">
                            <p className='font-bold'>&#x2022; Sponsor License Application Fee</p>
                            <p>This is a one-time fee paid when applying for a Sponsor License.</p>
                            <div className="">
                                <p>Small or charitable sponsors: <b>£536</b></p>
                                <p>Medium or large sponsors: <b> £1,476</b></p>
                            </div>
                            <p>Your business size is assessed based on your annual turnover and
                                number of employees.</p>
                        </div>
                        <div className=" mt-3 space-y-3">
                            <p className='font-bold'>&#x2022; Certificate of Sponsorship (CoS) Fee</p>
                            <p>For every skilled worker you intend to sponsor, you’ll need to issue a
                                Certificate of Sponsorship.</p>
                            <p><p>Cost per certificate: <b>£239</b></p> This is a mandatory step and must be done before a candidate can
                                apply for their visa.</p>
                        </div>
                        <div className=" mt-3 space-y-3">
                            <p className='font-bold'>&#x2022; Immigration Skills Charge</p>
                            <p>This is an additional fee aimed at upskilling the UK workforce, payable
                                for each sponsored worker.</p>
                            <p><p>Small sponsors / charities: <b>£364</b> for the first 12 months, £182 for every
                                6 months after.</p> Medium / large sponsors: <b>£1,000</b> for the first 12 months, £500 for every
                                6 months after.</p>
                        </div>
                        <div className=" mt-3 space-y-3">
                            <p className='font-bold'>&#x2022; License Renewal Fee (Every 4 years)</p>
                            <p>Sponsor Licenses are valid for 4 years and must be renewed.</p>
                            <p>Renewal costs are the same as the initial application, depending on
                                company size.</p>
                        </div>
                    </div>
                </>,
            image: '/CostEstimator/img.png',
            imgDir: "right",
            bg: "bg-[#E9EEF4]"
        }
    ];

    return (
        <>
            <div className="mb-[-5rem]">
                <Card item={data[0]} />
            </div>
        </>
    )
}

export default Main