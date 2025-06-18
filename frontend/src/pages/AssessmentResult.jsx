import confetti from 'canvas-confetti';
import { Check, Cross, TicketCheck, X } from 'lucide-react';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

function AssessmentResult() {
    const result = useSelector(state => state.assessment.result);
    const navigate = useNavigate();
    // console.log(result)

    useEffect(() => {
        if (result == null) {
            navigate("/assessment");
        }
    }, [result, navigate]);

    if (result == null) return null;

    useEffect(() => {
        if (result?.status === "eligible") {
            confetti(window.confettiSettings || {
                particleCount: 200,
                startVelocity: 50,
                spread: 360,
                origin: { y: 0.6 },
                colors: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
                scalar: 1.5,
            });
        }
    }, []);


    return (
        <div className="flex flex-col items-center justify-center min-h-screen text-gray-800  p-4">
            <div className="max-w-3xl w-full rounded-lg p-8 shadow-sm text-center">
                <div className="flex justify-center mb-6">
                    <div className="bg-pink-100 rounded-full p-3">
                        {result?.status === "eligible" ? (
                            <Check className="text-red-500" size={40} strokeWidth={2.75} />
                        ) : <X className="text-red-500" size={30} strokeWidth={2.75} />}
                    </div>
                </div>

                <h1 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                    {result?.message}
                </h1>

                <p className="text-xl md:text-2xl mb-8 font-medium">
                    Book a free 15-minute consultation today to get started.
                </p>

                <button className="bg-gray-900 hover:bg-gray-800 text-white font-medium py-3 px-6 rounded-md transition duration-300">
                    Book your consultation
                </button>
            </div>
        </div>
    );
}

export default AssessmentResult;
