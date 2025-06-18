import React, { useState } from 'react';
import { faqs } from '@/constants/plans';

const FaqSection = () => {
  const [activeQuestion, setActiveQuestion] = useState(2);
  const [hoveredQuestion, setHoveredQuestion] = useState(null);

  const handleQuestionClick = (id) => {
    setActiveQuestion(id);
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">Frequently asked Questions</h1>
      
      <div className="flex flex-col md:flex-row gap-8 justify-center">
        {/* Filter tabs */}
        <div className="flex flex-wrap gap-6 mb-8 md:mb-0 justify-center md:justify-start">
          <button className="px-4 py-2 bg-gray-800 text-white rounded-full">All Articles</button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full">UI Design</button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full">Interviews</button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full">UX Design</button>
          <button className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-full">+6 More</button>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row mt-12 gap-8">
        {/* Left side - FAQ questions list */}
        <div className="md:w-1/2">
          {faqs.map((faq) => (
            <div 
              key={faq.id}
              className={`p-6 mb-4 rounded-lg cursor-pointer transition-all duration-300 relative
                ${activeQuestion === faq.id ? 'bg-gray-100' : 'hover:bg-gray-50'}`}
              onClick={() => handleQuestionClick(faq.id)}
              onMouseEnter={() => setHoveredQuestion(faq.id)}
              onMouseLeave={() => setHoveredQuestion(null)}
            >
              {/* Dot indicator */}
              <div 
                className={`absolute left-2 top-1/2 transform -translate-y-1/2 w-5 h-5 rounded-full
                  ${activeQuestion === faq.id ? 'bg-black' : 
                    hoveredQuestion === faq.id ? 'bg-blue-700' : 'bg-transparent'}`}
              />
              
              <div className="flex items-center justify-between pl-4">
                <h3 className="text-lg font-medium">{faq.question}</h3>
                <span className={`
                  ${activeQuestion === faq.id ? 'text-black' : 
                    hoveredQuestion === faq.id ? 'text-sky-400' : 'text-gray-400'}
                `}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </div>
          ))}
        </div>
        
        {/* Right side - FAQ answer display */}
        <div className="lg:w-1/2 bg-gray-50 p-8 rounded-lg shadow-sm">
          {activeQuestion && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-gray-800">
                {faqs.find(faq => faq.id === activeQuestion)?.question}
              </h2>
              <p className="text-gray-700">
                {faqs.find(faq => faq.id === activeQuestion)?.answer}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FaqSection;