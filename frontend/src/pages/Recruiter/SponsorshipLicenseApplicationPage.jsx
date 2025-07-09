import React, { useEffect, useState } from "react";
import ApplicationProgress from "@/components/Recruiter/Sponsorship/ApplicationProgress";
import ApplicationStepList from "@/components/Recruiter/Sponsorship/ApplicationStepList";
import RecruiterNavbar from "@/components/Recruiter/RecruiterNavbar";
import { createSponsorshipApplication } from "@/Api/SpocershipApplicationServices";
import Loader from "@/components/miniComponents/Loader";
import { setApplicationId, setCompanyName } from "@/redux/sponcershipApplicationSlice";
import { useDispatch, useSelector } from "react-redux";
import { redirectToCheckout } from "@/Api/StripeServices.js";

export default function SponsorshipLicenseApplicationPage() {
    const dispatch = useDispatch();
    const { applicationId, companyName } = useSelector((state) => state.sponcershipApplication);

    const [loading, setLoading] = useState(false);
    const [formIInfo, setFormInfo] = useState();

    const priceId = "price_1Rg8Cv2acj2EAQETQPmzRzew"

    const handleSubmit = (e) => {
        e.preventDefault();
        redirectToCheckout(applicationId, priceId);
        console.log("Submitting application with ID:", applicationId);
    };

    const [steps, setSteps] = useState([
        {
            label: "Getting Started",
            key: "gettingStarted",
            status: "pending",
            to: "/sponsorship-license-application/getting-started",
        },
        {
            label: "About Your Company",
            key: "aboutYourCompany",
            status: "pending",
            to: "/sponsorship-license-application/about-your-company",
        },
        {
            label: "Company Structure",
            key: "companyStructure",
            status: "pending",
            to: "/sponsorship-license-application/company-structure",
        },
        {
            label: "Activity & Needs",
            key: "activityAndNeeds",
            status: "pending",
            to: "/sponsorship-license-application/activity-needs",
        },
        {
            label: "About You",
            key: "authorisingOfficers",
            status: "pending",
            to: "/sponsorship-license-application/about-you",
        },
        {
            label: "System Access",
            key: "level1AccessUsers",
            status: "pending",
            to: "/sponsorship-license-application/system-access",
        },
        {
            label: "Supporting Documents",
            key: "supportingDocuments",
            status: "pending",
            to: "/sponsorship-license-application/supporting-documents",
        },
        {
            label: "Organisation Size",
            key: "organizationSize",
            status: "pending",
            to: "/sponsorship-license-application/organisation-size",
        },
        {
            label: "Declaration",
            key: "declarations",
            status: "pending",
            to: "/sponsorship-license-application/declaration",
        },
    ]);

    const createApplication = async () => {
        setLoading(true);
        try {
            const response = await createSponsorshipApplication();
            setFormInfo(response?.application)
            dispatch(setApplicationId(response?.application?._id || null));
            dispatch(setCompanyName(response?.companyName || ""));
        } catch (error) {
            console.error("Error Creating Sponsorship Application:", error);
        } finally {
            setLoading(false);
        }
    };

    const stepKeys = [
        "gettingStarted",
        "aboutYourCompany",
        "companyStructure",
        "activityAndNeeds",
        "declarations",
        "authorisingOfficers",
        "organizationSize",
        "level1AccessUsers",
        "supportingDocuments"
    ];
    const arrayKeys = ["authorisingOfficers", "level1AccessUsers"];
    const completedSteps = stepKeys.filter(key => {
        const val = formIInfo?.[key];
        if (arrayKeys.includes(key)) return Array.isArray(val) && val.length > 0;
        return !!val;
    }).length;
    const progress = Math.round((completedSteps / stepKeys.length) * 100);

    // Check if form is submitted and paid
    const isFormSubmittedAndPaid = formIInfo?.isSubmitted === true && formIInfo?.isPaid === true;

    useEffect(() => {
        createApplication();
    }, []);

    useEffect(() => {
        if (!formIInfo) return;
        setSteps(prevSteps =>
            prevSteps.map(step => {
                if (!step.key) return { ...step, status: "pending" };
                if (arrayKeys.includes(step.key)) {
                    return Array.isArray(formIInfo[step.key]) && formIInfo[step.key].length > 0
                        ? { ...step, status: "completed" }
                        : { ...step, status: "pending" };
                }
                return formIInfo[step.key]
                    ? { ...step, status: "completed" }
                    : { ...step, status: "pending" };
            })
        );
    }, [formIInfo]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader /></div>;
    }

    if (!applicationId || !companyName || !formIInfo) {
        return <div className="flex justify-center items-center h-screen text-xl opacity-60 font-semibold">Unable to create application at this moment please try again later.</div>;
    }

    return (
        <>
            <div className="min-h-screen py-6 px-2 md:px-8 lg:px-24">
                <div className="max-w-5xl mx-auto">
                    <h4 className="text-xs font-bold text-primary mb-1 tracking-widest uppercase">
                        {companyName} LTD
                    </h4>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-1">
                        Application
                    </h1>
                    <p className="text-gray-500 mb-2">Account Created</p>

                    {/* Success Message for Submitted and Paid Applications */}
                    {isFormSubmittedAndPaid ? (
                        <div className="bg-green-100 text-green-800 rounded-xl px-6 py-4 mb-6 border-l-4 border-green-500">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 mr-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <div>
                                    <h3 className="font-semibold text-sm">Application Successfully Submitted!</h3>
                                    <p className="text-sm mt-1">Your application has been submitted and payment has been processed. We'll review your application and get back to you soon.</p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-blue-100 text-blue-800 rounded-xl px-4 py-3 mb-6 text-sm font-medium">
                            Complete all steps then submit application.
                        </div>
                    )}

                    <ApplicationProgress percent={progress} />

                    {/* Make steps non-clickable if submitted and paid */}
                    <ApplicationStepList
                        steps={steps}
                        readOnly={isFormSubmittedAndPaid}
                    />
                </div>

                {/* Bottom message and buttons - Hide if submitted and paid */}
                {!isFormSubmittedAndPaid && (
                    <div className="mt-16 flex flex-col items-center">
                        <p className="text-center text-gray-800 text-base mb-4 max-w-2xl">
                            You must click 'Submit' & Pay for Softhire to start working on
                            the application. Finish all steps above to enable the button.
                        </p>
                        <div className="flex gap-4">
                            <button className={`px-6 py-2 rounded-xl font-semibold text-base transition-colors border ${progress === 100
                                ? 'bg-blue-50 text-blue-500 border-blue-200 hover:bg-blue-100'
                                : 'bg-blue-50 text-blue-300 border-blue-100 cursor-not-allowed select-none'}`}
                                disabled={progress !== 100}
                                onClick={handleSubmit}
                            >
                                Submit
                            </button>

                            <button
                                className="px-6 py-2 rounded-xl bg-blue-50 text-blue-500 font-semibold text-base border border-blue-200  hover:bg-blue-100 transition-colors"
                            >
                                Back
                            </button>
                        </div>
                    </div>
                )}

                {/* Success state bottom section for submitted and paid applications */}
                {isFormSubmittedAndPaid && (
                    <div className="mt-16 flex flex-col items-center">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Application Submitted Successfully!</h2>
                            <p className="text-gray-600 mb-6 max-w-2xl">
                                Thank you for submitting your sponsorship license application. Our team will review your application and contact you within 5-10 business days with an update.
                            </p>
                            <div className="bg-gray-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
                                <p className="text-sm text-gray-600 mb-1">Application ID:</p>
                                <p className="font-mono text-sm font-semibold text-gray-900">{applicationId}</p>
                            </div>
                            {/* <button
                                className="px-6 py-2 rounded-xl bg-blue-50 text-blue-500 font-semibold text-base border border-blue-200 hover:bg-blue-100 transition-colors"
                                onClick={() => window.location.href = '/dashboard'}
                            >
                                Go to Dashboard
                            </button> */}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}