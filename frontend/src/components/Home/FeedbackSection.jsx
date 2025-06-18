import React, { useRef, useEffect } from 'react';

const FeedbackSection = () => {
    const scrollContainerRef = useRef(null);

    // Center the middle card on component mount and window resize
    useEffect(() => {
        const centerMiddleCard = () => {
            if (scrollContainerRef.current) {
                const container = scrollContainerRef.current;
                const containerWidth = container.offsetWidth;
                const cardWidth = container.children[1].offsetWidth; // Middle card (index 1)
                const scrollPosition = container.scrollLeft;
                const middleCardPosition = cardWidth + 24; // Card width + gap (24px)

                // Center the middle card
                container.scrollTo({
                    left: middleCardPosition - (containerWidth / 2) + (cardWidth / 2),
                    behavior: 'smooth'
                });
            }
        };

        // Center on load and resize
        centerMiddleCard();
        window.addEventListener('resize', centerMiddleCard);

        return () => window.removeEventListener('resize', centerMiddleCard);
    }, []);

    return (
        <div className="md:min-h-screen py-[2.5rem] md:py-0 bg-[#011627] flex flex-col items-center justify-center  md:p-6">
            <div className="text-center mb-8 md:mb-14">
                <h1 className="text-3xl lg:text-5xl font-bold text-white">What our clients say</h1>
                <p className="text-gray-300 mt-3  md:mt-5 px-4 max-w-3xl mx-auto">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
                    tempor incididunt ut labore et dolore magna aliqua.
                </p>
            </div>

            <div className="w-full max-w-7xl">
                <div
                    ref={scrollContainerRef}
                    className="flex flex-row gap-6 overflow-x-auto pb-6 md:flex-wrap md:justify-center snap-x snap-mandatory hide-scroll"
                >
                    <div className="bg-white rounded-lg p-6 flex-shrink-0 w-80 md:w-auto md:flex-1 flex flex-col items-center text-center shadow-md snap-center">
                        <img
                            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80"
                            alt="John Doe"
                            className="w-20 h-20 rounded-full mb-4 object-cover"
                        />
                        <h2 className="text-xl font-semibold text-gray-800">John Doe</h2>
                        <p className="text-gray-500 mt-1">HR Manager, TechCorp</p>
                        <p className="text-black mt-5 italic">
                            "This platform made hiring international talent effortless! The tools are accurate
                            and easy to use."
                        </p>
                    </div>

                    <div className="bg-white rounded-lg p-6 flex-shrink-0 w-80 md:w-auto md:flex-1 flex flex-col items-center text-center shadow-md snap-center">
                        <img
                            src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80"
                            alt="Sarah Lee"
                            className="w-20 h-20 rounded-full mb-4 object-cover"
                        />
                        <h2 className="text-xl font-semibold text-gray-800">Sarah Lee</h2>
                        <p className="text-gray-500 mt-1">CEO, Innovate Ltd.</p>
                        <p className="text-black mt-5 italic">
                            "The sponsor license eligibility tool saved us hours of research. Highly
                            recommended!"
                        </p>
                    </div>

                    <div className="bg-white rounded-lg p-6 flex-shrink-0 w-80 md:w-auto md:flex-1 flex flex-col items-center text-center shadow-md snap-center">
                        <img
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80"
                            alt="Michael Smith"
                            className="w-20 h-20 rounded-full mb-4 object-cover"
                        />
                        <h2 className="text-xl font-semibold text-gray-800">Michael Smith</h2>
                        <p className="text-gray-500 mt-1">Recruitment Lead, FutureWorks</p>
                        <p className="text-black mt-5 italic">
                            "The skilled worker salary calculator was a game-changer for our recruitment
                            process!"
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackSection;