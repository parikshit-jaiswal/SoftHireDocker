import React, { useEffect, useState } from 'react'
import { Input, Question, OptionSelect, DateInput } from "@/components/miniComponents/MiniInputComponents.jsx";
import { countryOptions, prospectiveRolesOptions, timeFormatOptions } from "@/constants/sponcerLicenseFormOptions.js";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { AlertCircleIcon, Plus, X } from 'lucide-react';
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "@/components/miniComponents/Loader";
import { useNavigate } from "react-router-dom";
import { getSystemAccess, updateSystemAccess } from '@/Api/SpocershipApplicationServices';


function SystemAccess() {
    const [answers, setAnswers] = React.useState({});
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const { applicationId, companyName } = useSelector((state) => state.sponcershipApplication);

    const [submitting, setSubmitting] = useState(false);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    // Initial state for all user fields
    const initialUserState = {
        title: '',
        firstname: '',
        lastname: '',
        previouslyKnownAs: '',
        phoneNo: '',
        email: '',
        dob: '',
        role: '',
        haveNationalInsuranceNumber: '',
        nationalInsuranceNumber: '',
        nationality: '',
        isSettledWorker: '',
        immigrationStatus: '',
        passportNum: '',
        homeOfficeRef: '',
        UKStayPermissionExpiery: '',
        hasCriminalConvictions: '',
        convictionDetails: '',
        line1: '',
        line2: '',
        line3: '',
        city: '',
        county: '',
        postcode: '',
        country: ''
    };
    const [user, setUser] = useState(initialUserState);
    const [userList, setUserList] = useState([]);

    // Only include fields that are required
    const requiredFields = [
        'title',
        'firstname',
        'lastname',
        'phoneNo',
        'email',
        'dob',
        'role',
        'haveNationalInsuranceNumber',
        'nationality',
        'line1',
        'city',
        'postcode',
        'country'
    ];
    const isUserDetailsValid = () => {
        // Only check required fields
        for (const field of requiredFields) {
            if (!user[field]) return false;
        }
        // National Insurance Number: only required if answered Yes
        if (user.haveNationalInsuranceNumber === 'Yes') {
            if (!user.nationalInsuranceNumber || user.nationalInsuranceNumber.length !== 9 || !user.nationalInsuranceNumber.match(/^[A-Z]{2}\d{6}[A-Z]$/)) {
                return false;
            }
        }
        // Immigration status: required if not a settled worker
        if (user.isSettledWorker === 'No') {
            if (!user.immigrationStatus) {
                return false;
            }
        }
        // Conviction details: required if hasCriminalConvictions is Yes
        if (user.hasCriminalConvictions === 'Yes') {
            if (!user.convictionDetails) {
                return false;
            }
        }
        return true;
    }

    const fetchFormData = async () => {
        try {
            setLoading(true);
            const response = await getSystemAccess(applicationId);
            if (response && Array.isArray(response.level1AccessUsers)) {
                // Collect all entries with a level1User
                const allWithUser = response.level1AccessUsers.filter(u => u.level1User);
                // Map all entries to frontend format
                const mappedUsers = allWithUser.map(mapBackendToAnswersUser);
                // Use the latest entry (by createdAt) for level1Access toggle
                let latest = response.level1AccessUsers.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
                setAnswers({
                    level1Access: latest && latest.level1Access ? 'Yes' : 'No',
                    userList: mappedUsers
                });
                setUserList(mappedUsers);
            }
        } catch (error) {
            // toast.error("Error fetching form data. Please try again.");
            console.error("Error fetching form data:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (applicationId) fetchFormData();
    }, [applicationId]);


    const mapBackendToAnswersUser = (entry) => {
        const data = entry.level1User;
        return {
            title: data.title || '',
            firstname: data.firstName || '',
            lastname: data.lastName || '',
            previouslyKnownAs: data.previouslyKnownAs || '',
            phoneNo: data.phoneNumber || '',
            email: data.email || '',
            dob: data.dateOfBirth ? data.dateOfBirth.slice(0, 10) : '',
            role: data.roleInCompany || '',
            haveNationalInsuranceNumber: data.hasNINumber ? 'Yes' : 'No',
            nationalInsuranceNumber: data.nationalInsuranceNumber || '',
            niExemptReason: data.niExemptReason || '',
            nationality: data.nationality || '',
            isSettledWorker: data.isSettledWorker ? 'Yes' : 'No',
            immigrationStatus: data.immigrationStatus || '',
            passportNum: data.passportNumber || '',
            homeOfficeRef: data.homeOfficeReference || '',
            UKStayPermissionExpiery: data.permissionExpiryDate ? data.permissionExpiryDate.slice(0, 10) : '',
            hasCriminalConvictions: data.hasConvictions ? 'Yes' : 'No',
            convictionDetails: data.convictionDetails || '',
            line1: data.address?.line1 || '',
            line2: data.address?.line2 || '',
            line3: data.address?.line3 || '',
            city: data.address?.city || '',
            county: data.address?.county || '',
            postcode: data.address?.postcode || '',
            country: data.address?.country || '',
        };
    };

    const data = {
        level1Access: answers.level1Access === 'Yes',
        ...(answers.level1Access === 'Yes' && userList.length > 0
            ? {
                level1User: {
                    title: userList[0].title,
                    firstName: userList[0].firstname,
                    lastName: userList[0].lastname,
                    previouslyKnownAs: userList[0].previouslyKnownAs,
                    phoneNumber: userList[0].phoneNo,
                    email: userList[0].email,
                    dateOfBirth: userList[0].dob,
                    roleInCompany: userList[0].role,
                    hasNINumber: userList[0].haveNationalInsuranceNumber === 'Yes',
                    nationalInsuranceNumber: userList[0].nationalInsuranceNumber,
                    niExemptReason: userList[0].niExemptReason,
                    nationality: userList[0].nationality,
                    isSettledWorker: userList[0].isSettledWorker === 'Yes',
                    immigrationStatus: userList[0].immigrationStatus,
                    passportNumber: userList[0].passportNum,
                    homeOfficeReference: userList[0].homeOfficeRef,
                    permissionExpiryDate: userList[0].UKStayPermissionExpiery,
                    hasConvictions: userList[0].hasCriminalConvictions === 'Yes',
                    convictionDetails: userList[0].convictionDetails,
                    address: {
                        line1: userList[0].line1,
                        line2: userList[0].line2,
                        line3: userList[0].line3,
                        city: userList[0].city,
                        county: userList[0].county,
                        postcode: userList[0].postcode,
                        country: userList[0].country,
                    }
                }
            }
            : {})
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            const response = await updateSystemAccess(applicationId, data);
            toast.success("Sponsorship Application updated successfully!");
        } catch (error) {
            toast.error("Error submitting the form. Please try again.");
            console.error("Error updating Sponsorship Application:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleSelect = (name, value) => {
        setAnswers((prev) => ({ ...prev, [name]: value }));
    };

    React.useEffect(() => {
        console.log("answers:", answers);
    }, [answers]);

    const isFormValid = () => {
        // Level 1 access question is always required
        if (answers.level1Access !== 'Yes' && answers.level1Access !== 'No') return false;

        // If user wants to add Level 1 users, at least one user must be added and all required fields must be filled for each
        if (answers.level1Access === 'Yes') {
            if (!userList.length) return false;
            for (const u of userList) {
                for (const field of requiredFields) {
                    if (!u[field]) return false;
                }
                if (u.haveNationalInsuranceNumber === 'Yes') {
                    if (!u.nationalInsuranceNumber || u.nationalInsuranceNumber.length !== 9 || !u.nationalInsuranceNumber.match(/^[A-Z]{2}\d{6}[A-Z]$/)) {
                        return false;
                    }
                }
                if (u.isSettledWorker === 'No' && !u.immigrationStatus) return false;
                if (u.hasCriminalConvictions === 'Yes' && !u.convictionDetails) return false;
            }
        }
        return true;
    };


    if (loading) {
        return <div className="flex justify-center items-center h-screen"><Loader /></div>;
    }

    return (
        <form className="max-w-4xl mx-auto py-12 px-2 md:px-0 space-y-10">
            <div className="bg-blue-50 text-blue-900 rounded-xl px-6 py-4 text-base font-medium mt-8">
                Other people within your company can have access to your SMS system. These people can be your Level 1 users. Typically, companies may add recruitment / HR managers as Level 1 users if necessary.
            </div>
            <Question name="level1Access" label={`Would you like anyone else other than ${companyName} to have Level 1 Access to your account?`} answers={answers} handleSelect={handleSelect} />
            {
                answers.level1Access === 'Yes' && (
                    <div className="space-y-2 ">
                        <div className="">
                            <div className="flex items-center justify-between mt-10 mb-6">
                                <h2 className="text-2xl sm:text-3xl font-bold">Level 1 Access</h2>

                                <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
                                    <SheetTrigger asChild>
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 bg-blue-400 hover:bg-blue-500 text-white font-semibold rounded-lg px-5 py-2 text-base shadow-none border-none focus:outline-none focus:ring-2 focus:ring-blue-300 transition-colors"
                                        >
                                            <Plus size={20} /> Add
                                        </button>
                                    </SheetTrigger>
                                    <SheetContent side="rightSm" className="overflow-y-auto">
                                        <SheetTitle className="hidden">title</SheetTitle>
                                        <div className="">
                                            <p className="font-bold text-center text-lg mb-5">Add Level 1 User</p>
                                            <div className="space-y-7 pb-10">
                                                <OptionSelect label="Title" value={user.title || ""} required={true} onChange={label => setUser(prev => ({ ...prev, title: label }))} options={[
                                                    { label: 'Mr', value: 'Mr' },
                                                    { label: 'Mrs', value: 'Mrs' },
                                                    { label: 'Miss', value: 'Miss' },
                                                    { label: 'Ms', value: 'Ms' },
                                                    { label: 'Mx', value: 'Mx' },
                                                    { label: 'Dr', value: 'Dr' }
                                                ]} />

                                                <Input name="firstname" label="First Name" value={user.firstname || ""} onChange={e => setUser(prev => ({ ...prev, firstname: e.target.value }))} />
                                                <Input name="lastname" label="Last Name" value={user.lastname || ""} onChange={e => setUser(prev => ({ ...prev, lastname: e.target.value }))} />
                                                <Input name="previouslyKnownAs" label="Previously Known As" type="text" placeholder='if applicable' required={false} value={user.previouslyKnownAs || ""} onChange={e => setUser(prev => ({ ...prev, previouslyKnownAs: e.target.value }))} />
                                                <Input name="phoneNo" label="Phone Number" type="tel" required={true} placeholder='11 digits starting with 0' value={user.phoneNo || ""} onChange={e => setUser(prev => ({ ...prev, phoneNo: e.target.value }))} />
                                                <Input name="email" label="Email Address" type="email" placeholder='please enter your work email' value={user.email || ""} onChange={e => setUser(prev => ({ ...prev, email: e.target.value }))} />
                                                <div className="bg-blue-50 text-blue-900 rounded-xl px-6 py-4 text-sm font-medium mt-8">
                                                    Please ensure this email is secure & accessible to one person only.
                                                </div>
                                                <Input name="dob" label="Date of Birth" type='date' value={user.dob || ""} onChange={e => setUser(prev => ({ ...prev, dob: e.target.value }))} />
                                                <Input name="role" label="Your role in your company" type='text' value={user.role || ""} onChange={e => setUser(prev => ({ ...prev, role: e.target.value }))} />
                                                <Question
                                                    name="haveNationalInsuranceNumber"
                                                    label="Do you have a National Insurance Number?"
                                                    answers={user}
                                                    handleSelect={(name, value) => setUser(prev => ({ ...prev, [name]: value }))}
                                                />
                                                {user.haveNationalInsuranceNumber === 'Yes' && (
                                                    <div className="bg-[#e3ebfa]  rounded-lg px-5 py-4 text-base flex items-start gap-2">
                                                        <span>
                                                            Your National Insurance number is 9 digits long and starts with two letters, followed by six numbers and one letter e.g. AB123456C. If you have lost it www.gov.uk/lost-national-insurance-number may help you find it.
                                                        </span>
                                                    </div>
                                                )}
                                                <Input name="nationalInsuranceNumber" label="Please enter your National Insurance Number" type='text' placeholder='' value={user.nationalInsuranceNumber || ""} onChange={e => setUser(prev => ({ ...prev, nationalInsuranceNumber: e.target.value }))} />
                                                <OptionSelect name="nationality" label="Nationality" options={countryOptions} value={user.nationality} onChange={e => setUser(prev => ({ ...prev, nationality: e }))} />
                                                <Question
                                                    name="isSettledWorker"
                                                    label="Are you a settled worker? (e.g. on Indefinite Leave to Remain, settled under EUSS scheme, etc)"
                                                    answers={user}
                                                    handleSelect={(name, value) => setUser(prev => ({ ...prev, [name]: value }))}
                                                />
                                                {user.isSettledWorker === 'No' && (
                                                    <>
                                                        <Input name="immigrationStatus" label="What’s your Immigration status in the UK as displayed on your BRP? (e.g pre-settled status, skilled worker)" type='text' placeholder='' value={user.immigrationStatus || ""} onChange={e => setUser(prev => ({ ...prev, immigrationStatus: e.target.value }))} />
                                                        <Input name="passportNum" label="Passport Number" type='text' placeholder='' value={user.passportNum || ""} onChange={e => setUser(prev => ({ ...prev, passportNum: e.target.value }))} />
                                                        <Input name="homeOfficeRef" label="Home Office Reference (BRP number or GWF Number)" type='text' placeholder='' value={user.homeOfficeRef || ""} onChange={e => setUser(prev => ({ ...prev, homeOfficeRef: e.target.value }))} />
                                                        <Input name="UKStayPermissionExpiery" label="When does your permission to stay in the UK expire?" type='date' placeholder='' value={user.UKStayPermissionExpiery || ""} onChange={e => setUser(prev => ({ ...prev, UKStayPermissionExpiery: e.target.value }))} />
                                                    </>
                                                )}
                                                <Question
                                                    name="hasCriminalConvictions"
                                                    label="Do you have any convictions or penalties?"
                                                    answers={user}
                                                    handleSelect={(name, value) => setUser(prev => ({ ...prev, [name]: value }))}
                                                />
                                                {user.hasCriminalConvictions === 'Yes' && (
                                                    <div className="">
                                                        <div className="flex items-center justify-between mb-2">
                                                            <label className="block font-bold text-gray-900 text-sm">Conviction Details</label>
                                                            <span className="text-xs text-gray-400 ml-4 whitespace-nowrap">Required</span>
                                                        </div>
                                                        <textarea
                                                            className="w-full rounded-lg border hover:border-gray-400   bg-gray-100 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
                                                            placeholder=""
                                                            value={user.convictionDetails || ""}
                                                            onChange={e => setUser(prev => ({ ...prev, convictionDetails: e.target.value }))}
                                                            required
                                                        />
                                                    </div>
                                                )}
                                                <Input name="line1" label="Line 1" value={user.line1 || ""} onChange={e => setUser({ ...user, line1: e.target.value })} />
                                                <Input name="line2" label="Line 2" value={user.line2 || ""} required={false} onChange={e => setUser({ ...user, line2: e.target.value })} />
                                                <Input name="line3" label="Line 3" value={user.line3 || ""} required={false} onChange={e => setUser({ ...user, line3: e.target.value })} />
                                                <Input name="city" label="City" value={user.city || ""} onChange={e => setUser({ ...user, city: e.target.value })} />
                                                <Input name="county" label="County" value={user.county || ""} required={false} onChange={e => setUser({ ...user, county: e.target.value })} />
                                                <Input name="postcode" label="Postcode" value={user.postcode || ""} onChange={e => setUser({ ...user, postcode: e.target.value })} />
                                                <div>
                                                    <OptionSelect label="Country" value={user.country} onChange={val => setUser({ ...user, country: val })} options={countryOptions} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="w-full z-50">
                                            <button
                                                type="button"
                                                className={`px-8 py-2 rounded-lg font-semibold text-base ${isUserDetailsValid() ? 'bg-blue-100 text-blue-500' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                                                onClick={() => {
                                                    if (isUserDetailsValid()) {
                                                        setUserList(prev => {
                                                            const updated = [...prev, user];
                                                            setAnswers(a => ({ ...a, userList: updated }));
                                                            return updated;
                                                        });
                                                        setIsSheetOpen(false);
                                                        setUser(initialUserState);
                                                    }
                                                }}
                                                disabled={!isUserDetailsValid()}
                                            >
                                                Submit
                                            </button>
                                        </div>
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                        <div className="mt-6">
                            {userList.length > 0 && (
                                <div className="divide-y">
                                    {userList.map((ref, idx) => (
                                        <div key={idx} className="flex flex-col md:flex-row md:items-center justify-between py-4 gap-2 md:gap-0 bg-blue-50 rounded-lg px-4 my-2">
                                            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full">
                                                <div className="font-semibold text-lg text-blue-900 flex items-center gap-2">
                                                    {ref.title && <span>{ref.title}</span>} {ref.firstname} {ref.lastname}
                                                </div>
                                                <div className="text-gray-700 text-base">{ref.role}</div>
                                                <div className="text-gray-700 text-base">{ref.email}</div>
                                                <div className="text-gray-700 text-base">{ref.nationality}</div>
                                            </div>
                                            <button
                                                type="button"
                                                className="ml-auto flex items-center gap-1 text-red-500 hover:text-red-700 px-2 py-1 rounded transition-colors"
                                                onClick={() => {
                                                    setUserList(prev => prev.filter((_, i) => i !== idx));
                                                    setAnswers(a => ({ ...a, userList: userList.filter((_, i) => i !== idx) }));
                                                }}
                                            >
                                                <X size={18} /> Remove
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )
            }

            <div className="flex flex-col sm:flex-row gap-4 justify-start sm:justify-end mt-16 border-t pt-8">
                <button
                    type="submit"
                    className={`px-8 py-3 rounded-full bg-blue-50 font-semibold text-base shadow-none border-none ${isFormValid() && !submitting ? 'text-blue-700 cursor-pointer hover:bg-blue-100' : 'text-blue-300 cursor-not-allowed select-none'}`}
                    disabled={!isFormValid() || submitting}
                    onClick={handleSubmit}
                >
                    {submitting ? (
                        <span className="flex items-center gap-2">
                            <span className="loader border-2 border-blue-300 border-t-blue-700 rounded-full w-4 h-4 animate-spin"></span>
                            Submitting...
                        </span>
                    ) : 'Submit'}
                </button>
                <button
                    type="button"
                    className="px-8 py-3 rounded-full bg-blue-50 text-gray-700 font-semibold text-base hover:bg-blue-100 transition-colors"
                    onClick={() => navigate("/sponsorship-license-application")}
                >
                    Cancel
                </button>
            </div>
        </form >
    )
}

export default SystemAccess