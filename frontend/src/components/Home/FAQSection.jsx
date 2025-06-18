import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'lucide-react';

const tabs = [
    { id: 1, name: 'All Articles' },
    { id: 2, name: 'UI Design' },
    { id: 3, name: 'Interviews' },
    { id: 4, name: 'UX Design' },
    { id: 5, name: '+6 More' },
];

const faqs = [
    {
        id: 1,
        category: 'All Articles',
        question: "Why do I need a Sponsorship License?",
        answer: "A Skilled Worker Sponsor License allows your business to recruit from outside the UK. It involves making an application to the Home Office. We can assist with this [include link here]."
    },
    {
        id: 2,
        category: 'All Articles',
        question: "What is the cost of a Sponsorship License?",
        answer: "Currently, the Home Office fee to obtain a sponsorship license in the UK is £536 for small or charitable sponsors and £1,476 for medium or large sponsors. See our Sponsorship License cost calculator (Link) to see which one applies to you"
    },
    {
        id: 3,
        category: 'All Articles',
        question: "Is there any limit to the number of workers I can sponsor?",
        answer: "No. There is no limit to the number of sponsorships a Skilled Worker Visa sponsor can give, provided the employees meet all relevant eligibility requirements. "
    },
    {
        id: 4,
        category: 'All Articles',
        question: "What is a Certificate of Sponsorship?",
        answer: "A Certificate of Sponsorship (CoS) is an electronic certificate an employer with a sponsorship license needs to assign to any worker they intend to sponsor. It is the second step to go through to hire foreign talent after obtaining a Skiller Worker Visa Sponsor We can assist with this.  "
    },
    {
        id: 5,
        category: 'All Articles',
        question: "Why do I need a Skilled Worker Sponsor License? ",
        answer: "If you want to have the ability to hire skilled non-UK citizens or permanent residents for your business, you will need a Skilled Worker Sponsor License. More information on how we can help here [Add Link to our Skilled Worker Sponsorship Page]. "
    },
    {
        id: 6,
        category: 'All Articles',
        question: "What roles can I hire for with a Skilled Worker Sponsorship License?",
        answer: <>The full list of roles is comprehensive, although different requirements apply to some categories than others – the full list of eligible occupations is set out here <a className='block text-blue-800 hover:underline' href="https://www.gov.uk/government/publications/skilled-worker-visa-eligible-occupations/skilled-worker-visa-eligible-occupations-and-codes" target="_blank" rel="noopener noreferrer">https://www.gov.uk/government/publications/skilled-worker-visa-eligible-occupations/skilled-worker-visa-eligible-occupations-and-codes</a>.</>
    },
    {
        id: 7,
        category: 'All Articles',
        question: "Can you help me with a compliance audit??",
        answer: "Yes. Using our compliance systems will ensure you are up to date with Home Office requirements and sail through most compliance audit questions and be prepared for unexpected compliance visits. "
    },
    {
        id: 8,
        category: 'All Articles',
        question: "Can you help me recruit talent?",
        answer: "We will be able to connect you with talented Software Engineers from outside the UK looking for opportunities in the UK. We are aiming to expand this offering to other industries soon. If you already have a foreign worker you want to hire who you have identified, we can handle their visa and immigration process for you regardless of industry."
    },

];


const FAQSection = () => {
    const [activeTab, setActiveTab] = useState('All Articles');
    const [activeQuestion, setActiveQuestion] = useState(faqs[0].id);

    // const filteredFAQs = activeTab === 'All Articles' ? faqs : faqs.filter(faq => faq.category === activeTab);
    const filteredFAQs = faqs;

    useEffect(() => {
        if (filteredFAQs.length > 0) {
            setActiveQuestion(filteredFAQs[0].id);
        }
    }, [activeTab]);

    return (
        <div className="bg-[#f4f4f5] min-h-screen flex flex-col items-center py-16 px-4">
            <div className="bg-[#353e5c] text-white px-6 py-2 rounded-full inline-block mb-4">FAQs</div>
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-700 mb-12 text-center mt-4">
                Frequently Asked Questions
            </h1>

            <div className="flex flex-wrap justify-center gap-3 mb-12 mt-8 max-w-4xl w-full">
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        className={`px-5 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${activeTab === tab.name ? 'bg-gray-700 text-white' : 'text-gray-700 border border-[#797f92] hover:bg-gray-100'}`}
                        onClick={() => setActiveTab(tab.name)}
                    >
                        {tab.name}
                    </button>
                ))}
            </div>

            <div className="max-w-7xl w-full p-1 relative flex flex-col md:flex-row items-center md:items-start justify-center gap-4">
                <div className="my-auto w-full md:w-[648px] bg-white border border-gray-200 flex flex-col">
                    {filteredFAQs.map(faq => (
                        <div
                            key={faq.id}
                            className={`p-4 cursor-pointer flex justify-between items-center group transition-colors ${activeQuestion === faq.id ? 'bg-[#fbfaff]' : 'hover:bg-gray-50'}`}
                            onClick={() => setActiveQuestion(faq.id)}
                        >
                            <div className="flex items-center">
                                <div className={`h-5 w-5 rounded-full bg-[#f4f4f5] flex-shrink-0 transition-colors ${activeQuestion === faq.id ? 'bg-black' : 'group-hover:bg-[#5c5fee]'}`}></div>
                                <p className={`${activeQuestion === faq.id ? 'font-medium' : ''} ml-2`}>{faq.question}</p>
                            </div>
                            <div className={`transition-colors ${activeQuestion === faq.id ? 'text-black' : 'text-gray-400 group-hover:text-[#5c5fee]'}`}>
                                <ChevronRight />
                            </div>
                        </div>
                    ))}
                </div>

                <div className="w-full md:w-[648px] h-[472px] bg-[#fbfaff] border border-gray-200 rounded-xl p-10 transition-opacity duration-500 ease-in-out">
                    <h2 className="text-xl font-semibold text-gray-800 mb-5">
                        {faqs.find(faq => faq.id === activeQuestion)?.question}
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        {faqs.find(faq => faq.id === activeQuestion)?.answer || "No answer available."}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FAQSection;
