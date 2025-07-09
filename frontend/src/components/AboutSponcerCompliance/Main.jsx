import { CircleCheck } from 'lucide-react';
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
            title: 'Why It’s Crucial for Your Organization',
            description: "Hiring international talent involves ongoing legal responsibilities. Non-compliance can lead to license suspension, legal penalties, or hiring restrictions. Our Sponsorship Compliance Portal helps you stay ahead—automating documentation, alerts, and updates to ensure you meet Home Office standards effortlessly. Mitigate risks, ensure continuous sponsorship capability, and protect your organization’s reputation.",
            image: '/AboutSponcerCompliance/img1.png',
            imgDir: "right",
            bg: "bg-[#E9EEF4]"
        },
        {
            title: 'Key Features',
            description:
                <div className="space-y-4 text-sm">
                    <ol className="space-y-3">
                        <li className="flex items-start gap-3">
                            <CircleCheck color="#2557ef" className="mt-1" />
                            <span><strong>Document Tracking:</strong> Seamlessly manage and store visa documentation and compliance records for all employees.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CircleCheck color="#2557ef" className="mt-1" />
                            <span><strong>Automated Reminders:</strong> Stay ahead of visa expirations, reporting deadlines, and audit timelines with intelligent alerts.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CircleCheck color="#2557ef" className="mt-1" />
                            <span><strong>Real-Time Dashboard:</strong> Instantly view the compliance status of your sponsored employees with actionable insights.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CircleCheck color="#2557ef" className="mt-1" />
                            <span><strong>Custom Alerts & Reports:</strong> Get audit-ready reports on demand and receive real-time anomaly notifications.</span>
                        </li>
                        <li className="flex items-start gap-3">
                            <CircleCheck color="#2557ef" className="" />
                            <span><strong>Secure Data Handling:</strong> End-to-end encryption safeguards your employee data at every stage.</span>
                        </li>
                    </ol>
                </div>,

            image: '/AboutSponcerCompliance/img2.png',
            imgDir: "left"
        },
    ];

    return (
        <>
            <div className="">
                <Card item={data[0]} />
                <Card item={data[1]} />
            </div>
        </>
    )
}

export default Main