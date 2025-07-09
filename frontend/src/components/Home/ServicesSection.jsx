import React, { act, useState } from 'react';
import { useMediaQuery } from 'react-responsive';
import { Button } from '../ui/button';
import { toast } from 'react-toastify';

function Card({ variant, title, content, img, link }) {

    const handleNavigate = () => {
        if (link) {
            window.location.href = link;
        } else {
            toast.info("Coming Soon!");
        }
    }

    if (variant === "lg") {
        return (
            <div className="flex flex-col items-center px-4 mb-[6rem]">
                <div className="flex flex-col md:flex-row max-w-4xl w-full bg-white text-gray-800 rounded-2xl shadow-lg overflow-hidden">
                    {/* Image Section */}
                    <div className="flex w-full md:w-1/2 p-2">
                        <img
                            src={img}
                            alt={title}
                            className="w-full h-auto object-cover rounded-2xl"
                        />
                    </div>

                    {/* Text Section */}
                    <div className="flex flex-col p-6 w-full md:w-1/2 gap-5 justify-center">
                        <h2 className="text-2xl font-extrabold">{title}</h2>
                        <p className="text-gray-600 text-sm">
                            {content}
                        </p>
                        <div className=" w-8">
                            <Button onClick={handleNavigate} variant="hero1">Register Now</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <div className="flex flex-col items-center px-4 md:mb-[6rem]">
                <div className="flex flex-col max-w-sm w-full bg-white text-gray-800 rounded-2xl shadow-lg overflow-hidden">
                    {/* Image Section */}
                    <div className="flex w-full p-2">
                        <img
                            src={img}
                            alt={title}
                            className="w-full h-[30vh] object-cover rounded-2xl"
                        />
                    </div>

                    {/* Text Section */}
                    <div className="flex flex-col p-6 w-full gap-5 justify-center">
                        <h2 className="text-2xl font-extrabold">{title}</h2>
                        <p className="text-gray-600 text-sm">
                            {content}
                        </p>
                        <div className=" w-8">
                            <Button onClick={handleNavigate} variant="hero1">Learn More</Button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

function ServicesSection() {

    const sm = useMediaQuery({ query: '(max-width: 639px)' });

    const [activeTab, setActiveTab] = useState("For Organizations");

    const tabs = [
        { id: 1, name: "For Organizations" },
        { id: 2, name: "For Individuals" },
        { id: 3, name: "For Universities" },
    ];

    const forOrganisations = [
        {
            title: "Sponsor License",
            link: "/sponsor-license-assessment",
            img: "/hero/licensed.png",
            content: "Easily obtain and manage your Sponsor License to hire international talent. Our platform simplifies compliance, documentation, and application tracking, ensuring a seamless process for your organization."
        },
        {
            title: "Compliance",
            img: "/hero/compliance.png",
            link: "/about-sponsorship-compliance",
            content: "With changing policies and regulations, staying compliant is crucial. SoftHire provides automated compliance tracking and guidance to help your organization meet all legal obligations related to international recruitment."
        },
        {
            title: "Recruitment",
            link: "/recruiter",
            img: "/hero/recruitment.png",
            content: "SoftHire empowers your recruitment team to find and hire international candidates efficiently. With integrated applicant tracking, smart filters, and team collaboration tools, you can streamline your hiring funnel."
        }
    ]

    const forIndividuals = [{
        title: "Job Seekers",
        link: "/dashboard",
        img: "/hero/jobSearch.png",
        content: "Looking for job opportunities abroad? SoftHire connects ambitious professionals with top global employers. Our platform helps you discover roles that match your skills, supports you through the application process, and prepares you for success in international job markets.",
    },
    {
        title: "Visa Processing",
        img: "/hero/visaProcessing.png",
        content: "Navigating visa requirements can be complex—but not with SoftHire. We provide end-to-end assistance for your visa application, ensuring every document is in place and every deadline is met. Our team supports you at every step, from eligibility checks to final approvals."
    }]

    const forUniversities = [{
        title: "Partner with us",
        img: "/hero/partnerUs.png",
        content: "At SoftHire, we collaborate with universities to bridge the gap between education and employment. By partnering with us, your institution gains access to international recruitment networks, career development tools, and visa support services—helping your students launch their global careers with confidence.",
    }]

    return (
        <div className="flex flex-col min-h-screen bg-[#011627] text-white pb-8 sm:pb-0">
            {/* Header Section */}
            <div className="flex flex-col items-center py-12 px-4">
                <h1 className=" text-2xl lg:text-4xl text-center font-bold mb-2">You get a Sponsorship License, we take the hassle</h1>
                <p className=" text-center max-w-2xl">
                    Plans starting from £1250* - refundable if you recruit from us!
                </p>
                <p className='text-gray-300 text-[0.7rem] text-right'>Plus Home Office Fees</p>
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center mb-12 p-5">
                {sm ? <div className="w-full bg-white flex justify-center py-3 rounded-2xl">
                    <div className="sm:flex w-fit bg-white rounded-lg ">
                        {tabs.map((tab) => (
                            <p key={tab.id} onClick={() => setActiveTab(tab.name)} className={`${activeTab == tab.name ? `bg-[#E65C4F]` : `text-black`} h-12 flex items-center p-7 rounded-lg text-sm font-bold  cursor-pointer transition-all`}>{tab.name}</p>
                        ))}
                    </div>
                </div>
                    :
                    <div>
                        <div className="flex w-fit bg-white rounded-lg ">
                            {tabs.map((tab) => (
                                <p key={tab.id} onClick={() => setActiveTab(tab.name)} className={`${activeTab == tab.name ? `bg-[#E65C4F]` : `text-black`} h-12 flex items-center p-7 rounded-lg text-sm font-bold  cursor-pointer transition-all`}>{tab.name}</p>
                            ))}
                        </div>
                    </div>}

            </div>

            {/* Content Card */}
            <div className="flex flex-col flex-wrap gap-5 md:gap-7 md:flex-row justify-center items-center">
                {activeTab == "For Organizations" && forOrganisations.map((item, index) => (
                    <Card key={index} variant="sm" title={item.title} content={item.content} img={item.img} link={item.link} />
                ))}
                {activeTab == "For Individuals" && forIndividuals.map((item, index) => (
                    <Card key={index} variant="sm" title={item.title} content={item.content} img={item.img} link={item.link} />
                ))}
                {activeTab == "For Universities" && forUniversities.map((item, index) => (
                    <Card key={index} variant="lg" title={item.title} content={item.content} img={item.img} link={item.link} />
                ))}
            </div>
        </div >
    );
}

export default ServicesSection;