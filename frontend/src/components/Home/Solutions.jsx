import React from 'react';
import { Link } from 'react-router-dom';

const solutionsData = [
    {
        title: 'Sponsor License Eligibility Assessment',
        description: "Easily check if your business meets the requirements to apply for a Sponsor License and start hiring international talent.",
        icon: (
            <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none">
                <path d="M22 11.0857V12.0057C21.9988 14.1621 21.3005 16.2604 20.0093 17.9875C18.7182 19.7147 16.9033 20.9782 14.8354 21.5896C12.7674 22.201 10.5573 22.1276 8.53447 21.3803C6.51168 20.633 4.78465 19.2518 3.61096 17.4428C2.43727 15.6338 1.87979 13.4938 2.02168 11.342C2.16356 9.19029 2.99721 7.14205 4.39828 5.5028C5.79935 3.86354 7.69279 2.72111 9.79619 2.24587C11.8996 1.77063 14.1003 1.98806 16.07 2.86572M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
        ),
        link: '/sponsor-license-assessment'
    },
    {
        title: 'Skilled Worker Salary Calculator',
        description: 'Quickly determine the minimum salary needed to sponsor a skilled worker based on job role and visa type.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 49 49" fill="none">
                <path d="M21.4375 6.125H15.3125C13.9049 6.125 12.5111 6.40225 11.2106 6.94092C9.91015 7.47958 8.72853 8.26912 7.7332 9.26445C6.73787 10.2598 5.94833 11.4414 5.40967 12.7419C4.871 14.0423 4.59375 15.4361 4.59375 16.8438C4.59375 18.2514 4.871 19.6452 5.40967 20.9456C5.94833 22.2461 6.73787 23.4277 7.7332 24.423C8.72853 25.4184 9.91015 26.2079 11.2106 26.7466C12.5111 27.2853 13.9049 27.5625 15.3125 27.5625H21.4375V36.75H7.65625V42.875H21.4375V49H27.5625V42.875H33.6875C36.5303 42.875 39.2566 41.7457 41.2668 39.7355C43.277 37.7254 44.4062 34.999 44.4062 32.1562C44.4062 29.3135 43.277 26.5871 41.2668 24.577C39.2566 22.5668 36.5303 21.4375 33.6875 21.4375H27.5625V12.25H41.3438V6.125H27.5625V0H21.4375V6.125ZM27.5625 27.5625H33.6875C34.9058 27.5625 36.0743 28.0465 36.9358 28.908C37.7973 29.7695 38.2812 30.9379 38.2812 32.1562C38.2812 33.3746 37.7973 34.543 36.9358 35.4045C36.0743 36.266 34.9058 36.75 33.6875 36.75H27.5625V27.5625ZM21.4375 21.4375H15.3125C14.7092 21.4375 14.1119 21.3187 13.5545 21.0878C12.9972 20.857 12.4908 20.5186 12.0642 20.092C11.6377 19.6655 11.2993 19.159 11.0684 18.6017C10.8376 18.0444 10.7188 17.447 10.7188 16.8438C10.7188 16.2405 10.8376 15.6431 11.0684 15.0858C11.2993 14.5285 11.6377 14.022 12.0642 13.5955C12.4908 13.1689 12.9972 12.8305 13.5545 12.5997C14.1119 12.3688 14.7092 12.25 15.3125 12.25H21.4375V21.4375Z" fill="#E65C4F" />
            </svg>

        ),
        link: '/salary-calculator'
    },
    {
        title: 'Sponsor License Cost Estimator',
        description: "Get an accurate estimate of all fees involved in applying for and maintaining a Sponsor License.",
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 49 49" fill="none">
                <path d="M36.7498 4.08325H12.2498C9.99467 4.08325 8.1665 5.91142 8.1665 8.16659V40.8333C8.1665 43.0884 9.99467 44.9166 12.2498 44.9166H36.7498C39.005 44.9166 40.8332 43.0884 40.8332 40.8333V8.16659C40.8332 5.91142 39.005 4.08325 36.7498 4.08325Z" stroke="#E65C4F" stroke-width="4.83333" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M16.333 12.25H32.6663M32.6663 28.5833V36.75M32.6663 20.4167H32.6868M24.4997 20.4167H24.5201M16.333 20.4167H16.3534M24.4997 28.5833H24.5201M16.333 28.5833H16.3534M24.4997 36.75H24.5201M16.333 36.75H16.3534" stroke="#E65C4F" stroke-width="4.83333" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
        ),
        link: '/cost-estimator'
    },
    {
        title: 'Immigration Skill Charge Calculator',
        description: 'Calculate the exact Immigration Skill Charges you’ll need to pay when hiring foreign workers.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 49 49" fill="none">
                <path d="M8.16683 42.8749C7.04391 42.8749 6.08297 42.4754 5.284 41.6765C4.48502 40.8775 4.08486 39.9159 4.0835 38.7916V16.3333C4.0835 15.2103 4.48366 14.2494 5.284 13.4504C6.08433 12.6514 7.04527 12.2513 8.16683 12.2499H16.3335V8.16659C16.3335 7.04367 16.7337 6.08272 17.534 5.28375C18.3343 4.48478 19.2953 4.08461 20.4168 4.08325H28.5835C29.7064 4.08325 30.668 4.48342 31.4684 5.28375C32.2687 6.08409 32.6682 7.04503 32.6668 8.16659V12.2499H40.8335C41.9564 12.2499 42.918 12.6501 43.7184 13.4504C44.5187 14.2508 44.9182 15.2117 44.9168 16.3333V38.7916C44.9168 39.9145 44.5173 40.8761 43.7184 41.6765C42.9194 42.4768 41.9578 42.8763 40.8335 42.8749H8.16683ZM20.4168 12.2499H28.5835V8.16659H20.4168V12.2499Z" fill="#E65C4F" />
            </svg>
        ),
        link: '/imigration-skill-charge-calculator'
    }
];

const SolutionCard = ({ title, description, icon, link }) => {
    return (
        <Link to={link} className="bg-[#E9EEF4] rounded-lg p-6 flex-1 flex flex-col shadow-sm hover:shadow-md cursor-pointer">
            <div className="text-[#E65C4F] h-8 w-8 text-2xl mb-4">{icon}</div>
            <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
            <p className="text-gray-600 mt-2 w-full lg:w-[80%]">{description}</p>
        </Link>
    )
};

const Solutions = () => {
    return (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center px-1 py-2 mt-8 lg:p-6 w-full mb-10">
            <div className="text-center mb-14">
                <h1 className="text-2xl lg:text-5xl font-extrabold text-gray-800 mb-2">Discover our solutions</h1>
                <div className="w-full flex justify-center">
                    <p className="text-gray-600 lg:mt-2 w-[85%] lg:w-[70%] text-sm">
                        Explore smart tools designed to simplify your hiring and immigration processes. From eligibility checks to cost estimations, our solutions help you make informed decisions with ease.
                    </p>
                </div>
            </div>
            <div className="flex flex-col items-center space-y-6 w-full max-w-6xl">
                {[0, 2].map(rowStart => (
                    <div key={rowStart} className="flex flex-col md:flex-row w-full justify-between space-y-6 md:space-y-0 md:space-x-6">
                        {solutionsData.slice(rowStart, rowStart + 2).map((card, i) => (
                            <SolutionCard key={i} {...card} />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Solutions;
