import API from '@/Api/api';
import { Button } from '@/components/ui/button';
import { setResult } from '@/redux/assessmentSlice';
import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const assessmentQuestions = [
    {
        text: <>Is your company currently registered and operating in the UK? <span className='opacity-55'>*</span></>,
        options: ['Yes', 'No - Foreign Company', "No - Planning to Register"],
        id: "isUKRegistered"
    },
    {
        text:
            <>Do you have the mandatory documents required to submit a sponsor license application? <span className='opacity-55'>*</span>
                <div className="opacity-70 text-sm font-light mt-2">
                    <p>Document Required-:</p>
                    <p>1. Business bank account</p>
                    <p>2. VAT certificate</p>
                    <p>3. HMRC registration for PAYE/National Insurance</p>
                    <p>4. Employer's liability insurance certificate or a proof of ownership of business premises</p>
                </div>
            </>,
        options: ['Yes', 'Need More Information'],
        id: "documentsSubmitted"
    },
    {
        text:
            <>
                Do you know the job role and SOC code for the role you're looking to sponsor? <span className='opacity-55'>*</span>
                <p className='opacity-70 text-sm font-light mt-2'>You can find the SOC code <a className='text-blue-700 underline font-normal' href="/salary-calculator">here</a></p>
            </>,
        options: ['Yes', 'No'],
        id: "knowsJobRoleAndCode"
    },
    {
        text: <>
            Do you meet the minimum salary threshold of the job role you want to recruit under sponsored worker route? <span className='opacity-55'>*</span>
            <p className='opacity-70 text-sm font-light mt-2'>You can find the minimum salary for the job role <a className='text-blue-700 underline font-normal' href="/salary-calculator">here</a></p>
        </>,
        options: ['Yes', 'No'],
        id: "meetsSalaryThreshold"
    },
    {
        text: <>Do you currently have an Authorising Officer or someone ready to manage the Sponsor Management System (SMS)? <span className='opacity-55'>*</span></>,
        options: ['Yes', 'No'],
        id: "authorizingOfficerAvailable"
    },
    {
        text: <>Almost there! Enter your email to receive your results directly in your inbox! <span className='opacity-55'>*</span></>,
        isTextArea: true,
        isEmail: true,
        id: "email",
    }
];

const submitAssessment = async (data) => {
    try {
        const response = await API.post("/sponsor/assessment", data);
        return response.data;
    } catch (error) {
        console.error("Login Error:", error.response?.data || error.message);
        throw error;
    }
};


const SearchableDropdown = ({ options, value, onChange, hasError, questionIndex }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);
    const questionIndexRef = useRef(questionIndex);

    useEffect(() => {
        setSearchTerm(value || '');
        questionIndexRef.current = questionIndex;
    }, [value, questionIndex]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const filteredOptions = options.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setIsOpen(true);
            setHighlightedIndex(prev => (prev < filteredOptions.length - 1 ? prev + 1 : prev));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setHighlightedIndex(prev => (prev > 0 ? prev - 1 : 0));
        } else if (e.key === 'Enter' && highlightedIndex >= 0) {
            e.preventDefault();
            handleOptionSelect(filteredOptions[highlightedIndex]);
        } else if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    const handleOptionSelect = (option) => {
        setSearchTerm(option);
        onChange(option);
        setIsOpen(false);
        setHighlightedIndex(-1);
    };

    return (
        <div className="relative w-full" ref={dropdownRef}>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    className={`w-full p-2 sm:p-4 text-lg border ${hasError ? 'border-red-500' : 'border-gray-300'} rounded bg-white`}
                    placeholder="Type to search options..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setIsOpen(true);
                    }}
                    onFocus={() => setIsOpen(true)}
                    onKeyDown={handleKeyDown}
                />
                <div
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-700 cursor-pointer"
                    onClick={() => {
                        setIsOpen(!isOpen);
                        if (!isOpen) inputRef.current.focus();
                    }}
                >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path
                            fillRule="evenodd"
                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </div>
            </div>

            {isOpen && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map((option, index) => (
                            <div
                                key={index}
                                className={`p-3 cursor-pointer hover:bg-blue-50 ${highlightedIndex === index ? 'bg-blue-100' : ''}`}
                                onClick={() => handleOptionSelect(option)}
                            >
                                {option}
                            </div>
                        ))
                    ) : (
                        <div className="p-3 text-gray-500">No options found</div>
                    )}
                </div>
            )}
        </div>
    );
};

const LicenseAssessment = () => {
    const navigate = useNavigate();
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answers, setAnswers] = useState(assessmentQuestions.map(() => ''));
    const [email, setEmail] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [emailError, setEmailError] = useState('');
    const [dropdownError, setDropdownError] = useState('');

    const totalQuestions = assessmentQuestions.length - 1;
    const completedPercentage = Math.round((currentQuestion / totalQuestions) * 100);

    const progressGradient = useMemo(() => {
        const colorStops = [
            { percent: 0, color: '#E1E4ED' },
            { percent: 33, color: '#B4B9C9' },
            { percent: 66, color: '#353E5C' },
            { percent: 100, color: '#19213D' }
        ];

        let startColor, endColor;

        for (let i = 0; i < colorStops.length - 1; i++) {
            if (
                completedPercentage >= colorStops[i].percent &&
                completedPercentage <= colorStops[i + 1].percent
            ) {
                startColor = colorStops[i].color;
                endColor = colorStops[i + 1].color;
                break;
            }
        }

        return startColor ? `linear-gradient(to right, ${startColor}, ${endColor})` : '#19213D';
    }, [completedPercentage]);

    const handleDropdownChange = (selectedOption) => {
        if (!selectedOption.trim()) {
            setDropdownError('Please select an answer');
            return;
        }

        const currentOptions = assessmentQuestions[currentQuestion].options;
        const isValidOption = currentOptions.some(option =>
            option.toLowerCase() === selectedOption.toLowerCase()
        );

        if (!isValidOption) {
            setDropdownError('Please select a valid option');
            return;
        }

        setDropdownError('');
        const newAnswers = [...answers];
        newAnswers[currentQuestion] = selectedOption;
        setAnswers(newAnswers);
    };

    const handleNextQuestion = () => {
        if (!answers[currentQuestion]?.trim()) {
            setDropdownError('Please select an answer before proceeding');
            return;
        }

        setDropdownError('');
        if (currentQuestion < assessmentQuestions.length - 1) {
            setCurrentQuestion((prev) => prev + 1);
        }
    };

    const handlePreviousQuestion = () => {
        if (currentQuestion > 0) {
            setCurrentQuestion((prev) => prev - 1);
            setDropdownError('');
        }
    };

    const handleSkipAssessment = () => {
        navigate('/');
    };

    const validateEmail = (email) => {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const handleSubmitAssessment = async () => {
        if (!validateEmail(email)) {
            setEmailError('Please enter a valid email address');
            return;
        }

        setIsSubmitting(true);
        setEmailError('');

        const formattedAnswers = assessmentQuestions.reduce((acc, q, index) => {
            acc[q.id] = answers[index];
            return acc;
        }, {});

        try {
            const result = await submitAssessment({ ...formattedAnswers, email });
            // console.log('Assessment results:', result);
            dispatch(setResult(result));
            navigate('/assessment/result');
        } catch (error) {
            console.error('Error submitting assessment:', error);
            setIsSubmitting(false);
        }
    };

    const currentQuestionData = assessmentQuestions[currentQuestion];
    const isEmailSection = currentQuestionData?.isEmail;
    const dispatch = useDispatch();

    return (
        <div className="min-h-screen w-full p-6 bg-[#E9EEF4]">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm p-8">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">UK Sponsor License Eligibility Assessment</h1>

                <div className="flex justify-between items-center mb-6">
                    <p className="sm:text-lg font-medium">
                        Question {currentQuestion + 1} of {assessmentQuestions.length}
                    </p>
                    <p className="sm:text-lg font-medium">{completedPercentage}% Completed</p>
                </div>

                <div className="w-full h-2 rounded bg-gray-200 mb-8">
                    <div
                        className="h-2 rounded"
                        style={{
                            width: `${completedPercentage}%`,
                            background: progressGradient
                        }}
                    />
                </div>

                <h2 className="text-lg sm:text-xl font-semibold mb-6">{currentQuestionData.text}</h2>

                {isEmailSection ? (
                    <div>
                        <input
                            type="email"
                            className={`w-full p-2 sm:p-4 border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded`}
                            placeholder="Your email address"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {emailError && <p className="text-red-500 text-sm mt-2">{emailError}</p>}

                        <div className="flex justify-between mt-6">
                            <button
                                className="px-4 py-2 border rounded text-gray-700 hover:bg-gray-100"
                                onClick={handlePreviousQuestion}
                            >
                                Previous
                            </button>
                            <button
                                className={`px-6 py-2 text-white rounded ${isSubmitting
                                    ? 'bg-[#E65C4F] opacity-70 cursor-not-allowed'
                                    : 'bg-red-500 hover:bg-red-700'
                                    }`}
                                onClick={handleSubmitAssessment}
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="mb-10">
                        <SearchableDropdown
                            options={currentQuestionData.options}
                            value={answers[currentQuestion]}
                            onChange={handleDropdownChange}
                            hasError={!!dropdownError}
                            questionIndex={currentQuestion}
                        />
                        {dropdownError && <p className="text-red-500 text-sm mt-2">{dropdownError}</p>}

                        <div className="flex justify-between mt-6">
                            {currentQuestion > 0 && (
                                <Button
                                    onClick={handlePreviousQuestion}
                                >
                                    Previous
                                </Button>
                            )}
                            {currentQuestion === 0 && (
                                <Button
                                    onClick={handleSkipAssessment}
                                >
                                    Skip Assessment
                                </Button>
                            )}
                            <Button
                                className="bg-[#E65C4F] text-white rounded hover:bg-red-700 px-10"
                                onClick={handleNextQuestion}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LicenseAssessment;
