import TextEditor from '@/components/miniComponents/TextEditor';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import React, { useState, useEffect, useRef } from 'react';
import MultiAddInput from '@/components/miniComponents/MultiAddInput';
import AutocompleteSelect from '@/components/miniComponents/AutocompleteSelect';
import { locations } from '@/constants/locations';
import { timeZoneOptions, positions, currencyOptions, roles, experienceOptions, skillOptions, companySizeOptions } from '@/constants/postJobOptions';
import { toast } from 'react-toastify';
import { Trash2 } from 'lucide-react';
import { createJob, deleteJob, updateJob } from '@/Api/JobServices';
import { useNavigate } from 'react-router-dom';
import useJob from '@/Context/JobContext/useJob';
import { useSelector, useDispatch } from 'react-redux';
import useGetAllJobs from '@/hooks/useGetAllJobs';
import { setSelectedJob } from '@/redux/jobSlice';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

const Label = ({ htmlFor, children, className = "" }) => (
    <label htmlFor={htmlFor} className={className}>{children}</label>
);

// Controlled Input component
const ControlledInput = ({ value, onChange, ...props }) => (
    <Input value={value || ""} onChange={e => onChange(e.target.value)} {...props} />
);

// Controlled MultiAddInput
const ControlledMultiAddInput = ({ value = [], onChange, ...props }) => (
    <MultiAddInput
        value={value || []}
        onChange={onChange}
        {...props}
    />
);

// Controlled AutocompleteSelect
const ControlledAutocompleteSelect = ({ value = '', onChange, ...props }) => (
    <AutocompleteSelect
        value={value || ""}
        onSelect={onChange}
        {...props}
    />
);

function EditDraft({ activeTab, setActiveTab }) {

    // Remove localStorage logic, use default initial values
    const navigate = useNavigate();
    const [title, setTitle] = useState('');
    const [companyName, setCompanyName] = useState('');
    const [companySize, setCompanySize] = useState('');
    const [jobDescription, setJobDescription] = useState('');
    const [jobType, setJobType] = useState('');
    const [primaryRole, setPrimaryRole] = useState('');
    const [additionalRoles, setAdditionalRoles] = useState([]);
    const [workExperience, setWorkExperience] = useState('');
    const [skills, setSkills] = useState([]);
    const [location, setLocation] = useState([]);
    const [relocationRequired, setRelocationRequired] = useState(false);
    const [relocationAssistance, setRelocationAssistance] = useState(false);
    const [remotePolicy, setRemotePolicy] = useState('');
    const [remoteCulture, setRemoteCulture] = useState('');
    const [hiresIn, setHiresIn] = useState([]);
    const [acceptWorldwide, setAcceptWorldwide] = useState(false);
    const [collaborationHours, setCollaborationHours] = useState({ start: '', end: '', timeZone: '' });
    const [salary, setSalary] = useState({ min: '', max: '' });
    const [currency, setCurrency] = useState('');
    const [equity, setEquity] = useState({ min: '', max: '' });
    const [visaSponsorship, setVisaSponsorship] = useState(false);
    const [autoSkipVisaCandidates, setAutoSkipVisaCandidates] = useState(false);
    const [autoSkipRelocationCandidates, setAutoSkipRelocationCandidates] = useState(false);
    const [contactPerson, setContactPerson] = useState({ name: '', position: '', location: '', experience: '' });
    const [isDraft, setIsDraft] = useState(false);
    const [value, setValue] = useState('');

    const [relocateOption, setRelocateOption] = useState('');
    const [visaOption, setVisaOption] = useState('');
    const [isRemoteAnywhere, setIsRemoteAnywhere] = useState(false);
    const [noEquity, setNoEquity] = useState(false);

    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [timezones, setTimezones] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const { jobEdit, setJobEdit, jobOption, setJobOption } = useJob();

    const { selectedJob } = useSelector((state) => state.job || {});

    const dispatch = useDispatch();
    const { fetchJobs } = useGetAllJobs();

    useEffect(() => {
        if (selectedJob) {
            setTitle(selectedJob.title || '');
            setCompanyName(selectedJob.companyName || '');
            setCompanySize(selectedJob.companySize || '');
            setJobDescription(selectedJob.jobDescription || '');
            setJobType(selectedJob.jobType || '');
            setPrimaryRole(selectedJob.primaryRole || '');
            setAdditionalRoles(Array.isArray(selectedJob.additionalRoles) ? selectedJob.additionalRoles : []);
            setWorkExperience(selectedJob.workExperience || '');
            setSkills(Array.isArray(selectedJob.skills) ? selectedJob.skills : []);
            setLocation(Array.isArray(selectedJob.location) ? selectedJob.location : []);
            setRelocationRequired(!!selectedJob.relocationRequired);
            setRelocationAssistance(!!selectedJob.relocationAssistance);
            setRemotePolicy(selectedJob.remotePolicy || '');
            setRemoteCulture(selectedJob.remoteCulture || '');
            setHiresIn(Array.isArray(selectedJob.hiresIn) ? selectedJob.hiresIn : []);
            setAcceptWorldwide(!!selectedJob.acceptWorldwide);
            setTimezones(Array.isArray(selectedJob.timeZones) ? selectedJob.timeZones : []);
            setCollaborationHours(
                selectedJob.collaborationHours && typeof selectedJob.collaborationHours === 'object'
                    ? {
                        start: selectedJob.collaborationHours.start || '',
                        end: selectedJob.collaborationHours.end || '',
                        timeZone: selectedJob.collaborationHours.timeZone || ''
                    }
                    : { start: '', end: '', timeZone: '' }
            );
            setSalary(selectedJob.salary && typeof selectedJob.salary === 'object' ? {
                min: selectedJob.salary.min || '',
                max: selectedJob.salary.max || ''
            } : { min: '', max: '' });
            setCurrency(selectedJob.currency || '');
            setEquity(selectedJob.equity && typeof selectedJob.equity === 'object' ? {
                min: selectedJob.equity.min || '',
                max: selectedJob.equity.max || ''
            } : { min: '', max: '' });
            setVisaSponsorship(!!selectedJob.visaSponsorship);
            setAutoSkipVisaCandidates(!!selectedJob.autoSkipVisaCandidates);
            setAutoSkipRelocationCandidates(!!selectedJob.autoSkipRelocationCandidates);
            setContactPerson(selectedJob.contactPerson && typeof selectedJob.contactPerson === 'object' ? {
                name: selectedJob.contactPerson.name || '',
                position: selectedJob.contactPerson.position || '',
                location: selectedJob.contactPerson.location || '',
                experience: selectedJob.contactPerson.experience || ''
            } : { name: '', position: '', location: '', experience: '' });
            setIsDraft(!!selectedJob.isDraft);
            setValue(selectedJob.jobDescription || '');
            setNoEquity(!!selectedJob.noEquity);
        }
    }, [selectedJob]);

    // Add console logs to track state changes
    const handleTitleChange = (newValue) => {
        setTitle(newValue);
        if (newValue && newValue.trim() !== '') {
            setErrors(prev => ({ ...prev, title: undefined }));
        }
    };

    const handleJobTypeChange = (newValue) => {
        setJobType(newValue);
        if (newValue && newValue.trim() !== '') {
            setErrors(prev => ({ ...prev, jobType: undefined }));
        }
    };

    const handlePrimaryRoleChange = (newValue) => {
        setPrimaryRole(newValue);
        if (newValue && newValue.trim() !== '') {
            setErrors(prev => ({ ...prev, primaryRole: undefined }));
        }
    };

    const handleAdditionalRolesChange = (newValue) => {
        setAdditionalRoles(newValue);
    };

    const handleWorkExperienceChange = (newValue) => {
        setWorkExperience(newValue);
        if (newValue && newValue.trim() !== '') {
            setErrors(prev => ({ ...prev, workExperience: undefined }));
        }
    };

    const handleSkillsChange = (newValue) => {
        setSkills(newValue);
        if (Array.isArray(newValue) && newValue.length > 0) {
            setErrors(prev => ({ ...prev, skills: undefined }));
        }
    };

    const handleLocationChange = (newValue) => {
        setLocation(newValue);
        if (Array.isArray(newValue) && newValue.length > 0) {
            setErrors(prev => ({ ...prev, locations: undefined }));
        }
    };

    const handleHiresInChange = (newValue) => {
        setHiresIn(newValue);
        if (Array.isArray(newValue) && newValue.length > 0) {
            setErrors(prev => ({ ...prev, hiresIn: undefined }));
        }
    };

    const handleCurrencyChange = (newValue) => {
        setCurrency(newValue);
    };

    const handleCompanySizeChange = (newValue) => {
        setCompanySize(newValue);
        if (newValue && newValue.trim() !== '') {
            setErrors(prev => ({ ...prev, companySize: undefined }));
        }
    };

    const handleRemotePolicyChange = (e) => {
        const value = e?.target ? e.target.value : e;
        setRemotePolicy(value);
        if (value && value.trim() !== '') {
            setErrors(prev => ({ ...prev, remotePolicy: undefined }));
        }
    };

    // Validation function
    const validate = () => {
        const newErrors = {};

        // Title validation
        if (!title || !title.trim()) {
            newErrors.title = 'Title is required.';
        }

        // Job Description validation
        if (!value || !value.trim()) {
            newErrors.jobDescription = 'Job Description is required.';
        }

        // Job Type validation
        if (!jobType || jobType.trim() === '') {
            newErrors.jobType = 'Type of Position is required.';
        }

        // Primary Role validation
        if (!primaryRole || primaryRole.trim() === '') {
            newErrors.primaryRole = 'Primary Role is required.';
        }

        // Work Experience validation
        if (!workExperience || workExperience.trim() === '') {
            newErrors.workExperience = 'Work Experience is required.';
        }

        // Skills validation
        if (!skills || !Array.isArray(skills) || skills.length === 0) {
            newErrors.skills = 'At least one skill is required.';
        }

        // Location validation
        if (!location || !Array.isArray(location) || location.length === 0) {
            newErrors.locations = 'Location is required.';
        }

        // Remote Policy validation
        if (!remotePolicy || remotePolicy.trim() === '') {
            newErrors.remotePolicy = 'Remote policy is required.';
        }

        // Company Size validation
        if (!companySize || companySize.trim() === '') {
            newErrors.companySize = 'Company Size is required.';
        }

        // Remote work specific validations
        if (remotePolicy !== 'In Office') {
            if (!acceptWorldwide && (!hiresIn || !Array.isArray(hiresIn) || hiresIn.length === 0)) {
                newErrors.hiresIn = 'Please specify hiring regions or select "Accept remote workers from anywhere"';
            }
        }

        return newErrors;
    };

    // Modified handleSubmit to accept a draft flag
    const handleSubmit = async (e, isDraft) => {
        if (e && e.preventDefault) e.preventDefault();
        const formData = {
            title,
            companyName,
            companySize,
            jobDescription: value,
            jobType,
            primaryRole,
            additionalRoles,
            workExperience,
            skills,
            location,
            timeZones: timezones,
            relocationRequired,
            relocationAssistance,
            remotePolicy,
            remoteCulture,
            hiresIn,
            acceptWorldwide,
            collaborationHours,
            salary,
            currency,
            equity,
            visaSponsorship,
            autoSkipVisaCandidates,
            autoSkipRelocationCandidates,
            contactPerson,
            isDraft: isDraft
        };
        if (validate()) {
            try {
                setIsLoading(true);
                // // console.log(formData);
                const response = await updateJob(formData, selectedJob._id);
                if (response) {
                    toast.success("Job updated successfully");

                    // Refetch jobs and update selectedJob in Redux
                    const jobsList = await fetchJobs();
                    const updatedJob = jobsList.find(job => job._id === selectedJob._id);
                    if (updatedJob) {
                        dispatch(setSelectedJob(updatedJob));
                        // Re-initialize local state with updatedJob
                        setTitle(updatedJob.title || '');
                        setCompanyName(updatedJob.companyName || '');
                        setCompanySize(updatedJob.companySize || '');
                        setJobDescription(updatedJob.jobDescription || '');
                        setJobType(updatedJob.jobType || '');
                        setPrimaryRole(updatedJob.primaryRole || '');
                        setAdditionalRoles(Array.isArray(updatedJob.additionalRoles) ? updatedJob.additionalRoles : []);
                        setWorkExperience(updatedJob.workExperience || '');
                        setSkills(Array.isArray(updatedJob.skills) ? updatedJob.skills : []);
                        setLocation(Array.isArray(updatedJob.location) ? updatedJob.location : []);
                        setRelocationRequired(!!updatedJob.relocationRequired);
                        setRelocationAssistance(!!updatedJob.relocationAssistance);
                        setRemotePolicy(updatedJob.remotePolicy || '');
                        setRemoteCulture(updatedJob.remoteCulture || '');
                        setHiresIn(Array.isArray(updatedJob.hiresIn) ? updatedJob.hiresIn : []);
                        setAcceptWorldwide(!!updatedJob.acceptWorldwide);
                        setTimezones(Array.isArray(updatedJob.timeZones) ? updatedJob.timeZones : []);
                        setCollaborationHours(
                            updatedJob.collaborationHours && typeof updatedJob.collaborationHours === 'object'
                                ? {
                                    start: updatedJob.collaborationHours.start || '',
                                    end: updatedJob.collaborationHours.end || '',
                                    timeZone: updatedJob.collaborationHours.timeZone || ''
                                }
                                : { start: '', end: '', timeZone: '' }
                        );
                        setSalary(updatedJob.salary && typeof updatedJob.salary === 'object' ? {
                            min: updatedJob.salary.min || '',
                            max: updatedJob.salary.max || ''
                        } : { min: '', max: '' });
                        setCurrency(updatedJob.currency || '');
                        setEquity(updatedJob.equity && typeof updatedJob.equity === 'object' ? {
                            min: updatedJob.equity.min || '',
                            max: updatedJob.equity.max || ''
                        } : { min: '', max: '' });
                        setVisaSponsorship(!!updatedJob.visaSponsorship);
                        setAutoSkipVisaCandidates(!!updatedJob.autoSkipVisaCandidates);
                        setAutoSkipRelocationCandidates(!!updatedJob.autoSkipRelocationCandidates);
                        setContactPerson(updatedJob.contactPerson && typeof updatedJob.contactPerson === 'object' ? {
                            name: updatedJob.contactPerson.name || '',
                            position: updatedJob.contactPerson.position || '',
                            location: updatedJob.contactPerson.location || '',
                            experience: updatedJob.contactPerson.experience || ''
                        } : { name: '', position: '', location: '', experience: '' });
                        setIsDraft(!!updatedJob.isDraft);
                        setValue(updatedJob.jobDescription || '');
                        setNoEquity(!!updatedJob.noEquity);
                    }
                }
            } catch (error) {
                // console.log(error);
                toast.error(error.response?.data?.message || "Failed to update job");
            }
            finally {
                setIsLoading(false);
            }
        }
    };

    // Add a handler to clear all form fields
    const handleDelete = async () => {
        try {
            setIsLoading(true);
            // Call the delete job API
            const response = await deleteJob(selectedJob._id);
            if (response) {
                // console.log(response)
                toast.success("Job deleted successfully");
                // Optionally, you can navigate back or reset the form
                // remove the selected job from redux and jobs also
                fetchJobs();
                dispatch(setSelectedJob(null));
            }
        } catch (error) {
            // console.log(error);
            toast.error(error.response?.data?.message || "Failed to delete job");
        } finally {
            setIsLoading(false);
        }
    };

    // Section title component for both mobile and desktop
    const SectionTitle = ({ number, title }) => (
        <div className="mb-4 md:mb-0">
            <p className="font-bold text-xl">
                {number}. {title}
            </p>
        </div>
    );

    function JobHeader({ activeTab, setActiveTab }) {
        const { jobOption } = useJob();
        const { selectedJob } = useSelector((state) => state.job || {});

        return (
            <div className="w-full">
                {/* Header Section */}
                <div className="flex flex-wrap space-y-4 justify-between items-start  w-full">
                    <div>
                        <div className="flex items-center gap-3 mt-3">
                            <h1 className="text-2xl font-bold text-gray-900">{selectedJob?.title}</h1>
                            {<span className={`text-sm ${selectedJob?.isDraft ? "text-gray-500 bg-gray-100" : "text-red-500 border border-red-500"} px-2 py-0 rounded`}>{selectedJob?.isDraft ? "Draft" : "Live"}</span>}
                        </div>
                    </div>

                    <div className="flex gap-3 items-center mb-5">
                        {/* add a button for save chanegs make this similar to save draft button*/}
                        <button
                            type="button"
                            disabled={isLoading}
                            onClick={() => handleSubmit(undefined, true)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            {isLoading ? "Saving..." : "Save Changes"}
                        </button>
                        <button
                            type="button"
                            disabled={isLoading}
                            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                            <AlertDialog>
                                <AlertDialogTrigger>Publish</AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure you want to publish this job?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            After publishing, this job will be visible to all users. You can unpublish it later if needed.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction className="bg-red-500" onClick={() => handleSubmit(undefined, false)}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </button>
                        <button
                            // onClick={() => handleDelete()}
                            disabled={isLoading}
                            className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <AlertDialog>
                                <AlertDialogTrigger><Trash2 className="h-5 w-5" /></AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Are you sure you want to delete this job?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            This action cannot be undone, use Unpublish if you want to hide this job from the public and save it as draft.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                                        <AlertDialogAction className="bg-red-500" onClick={() => handleDelete()}>Continue</AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>

                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-400 mb-5">
                    <nav className="flex space-x-8">
                        <button
                            onClick={() => setActiveTab("preview")}
                            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "preview"
                                ? "border-red-500 text-red-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            {jobOption === 'active' ? "Overview" : "Preview"}
                        </button>
                        <button
                            onClick={() => setActiveTab("edit")}
                            className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${activeTab === "edit"
                                ? "border-red-500 text-red-600"
                                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                                }`}
                        >
                            Edit Job
                        </button>
                    </nav>
                </div>
            </div >
        );
    }

    if (!selectedJob || !selectedJob._id) {
        return (
            <div className="flex justify-center items-center h-full">
                <p className="text-gray-500">No job selected. Please select a job to edit.</p>
            </div>
        );
    }

    return (
        <>
            <JobHeader activeTab={activeTab} setActiveTab={setActiveTab} />
            <form onSubmit={(e) => handleSubmit(e, false)} noValidate>
                <div className="border border-black rounded-lg py-6 px-4 md:py-8 md:px-[3%] ">
                    {/* Section 1: Job Details */}
                    <div className="flex flex-col md:grid md:grid-cols-7 mb-8 md:mb-0">
                        <div className="md:col-span-2">
                            <SectionTitle number="1" title="Job Details" />
                        </div>
                        <div className="md:col-span-5 space-y-6">
                            <div className="space-y-1">
                                <p className="font-bold text-xl">Title*</p>
                                <ControlledInput
                                    placeholder="eg. Software Engineer, Backend Developer, etc."
                                    value={title || ""}
                                    onChange={handleTitleChange}
                                    required
                                />
                                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-xl">Description*</p>
                                <TextEditor setValue={setValue} value={value || ""} placeholder="Describe the responsibilities of the position. You can change this later" />
                                {errors.jobDescription && <p className="text-red-500 text-sm mt-1">{errors.jobDescription}</p>}
                            </div>
                            <div className="space-y-1 pt-10">
                                <p className="font-bold text-xl">Type of Position*</p>
                                <ControlledAutocompleteSelect
                                    options={positions}
                                    placeHolder="e.g., Full-time employee, Intern, etc"
                                    value={jobType || ""}
                                    onChange={handleJobTypeChange}
                                    required
                                />
                                {errors.jobType && <p className="text-red-500 text-sm mt-1">{errors.jobType}</p>}
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-xl">Primary Role*</p>
                                <ControlledAutocompleteSelect
                                    options={roles}
                                    placeHolder="Select Role"
                                    value={primaryRole || ""}
                                    onChange={handlePrimaryRoleChange}
                                />
                                {errors.primaryRole && <p className="text-red-500 text-sm mt-1">{errors.primaryRole}</p>}
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-xl">Additional roles</p>
                                <ControlledMultiAddInput
                                    suggestions={roles}
                                    placeholder="Select Role"
                                    value={additionalRoles || []}
                                    onChange={handleAdditionalRolesChange}
                                />
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-xl">Work Experience*</p>
                                <ControlledAutocompleteSelect
                                    options={experienceOptions}
                                    placeHolder="Select years of experience"
                                    value={workExperience || ""}
                                    onChange={handleWorkExperienceChange}
                                />
                                {errors.workExperience && <p className="text-red-500 text-sm mt-1">{errors.workExperience}</p>}
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-xl">Skills*</p>
                                <ControlledMultiAddInput
                                    placeholder="Add skills"
                                    suggestions={skillOptions}
                                    value={skills || []}
                                    onChange={handleSkillsChange}
                                    required
                                />
                                {errors.skills && <p className="text-red-500 text-sm mt-1">{errors.skills}</p>}
                            </div>
                        </div>
                    </div>

                    <div className="my-6 md:my-10"><Separator /></div>

                    {/* Section 2: Location */}
                    <div className="flex flex-col md:grid md:grid-cols-7 mb-8 md:mb-0">
                        <div className="md:col-span-2">
                            <SectionTitle number="2" title="Location" />
                        </div>
                        <div className="md:col-span-5 space-y-6 md:space-y-8">
                            <div className="space-y-1">
                                <div className="">
                                    <p className="font-bold text-xl">Enter the Location*</p>
                                    <p className='text-sm text-gray-500'>Where are you hiring for this role? If fully remote, put the city or state of your headquarters. You'll set the remote policy below.</p>
                                </div>
                                <ControlledMultiAddInput
                                    placeholder="Add location"
                                    suggestions={locations}
                                    value={location || []}
                                    onChange={handleLocationChange}
                                    required
                                />
                                {errors.locations && <p className="text-red-500 text-sm mt-1">{errors.locations}</p>}
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-xl">Willing to accept applicants who need to relocate?</p>
                                <div className="flex flex-wrap gap-5 md:gap-10">
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="radio"
                                            id="relocate-yes"
                                            name="relocate"
                                            value="yes"
                                            checked={relocationRequired}
                                            onChange={(e) => setRelocationRequired(e.target.value === 'yes')}
                                            className="accent-[#EA4C25] focus:ring-[#EA4C25] w-5 h-5"
                                        />
                                        <Label htmlFor="relocate-yes">Yes</Label>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="radio"
                                            id="relocate-no"
                                            name="relocate"
                                            value="no"
                                            checked={!relocationRequired}
                                            onChange={(e) => setRelocationRequired(e.target.value === 'yes')}
                                            className="accent-[#EA4C25] focus:ring-[#EA4C25] w-5 h-5"
                                        />
                                        <Label htmlFor="relocate-no">No</Label>
                                    </div>
                                </div>
                                {relocationRequired && (
                                    <div className="flex gap-2 items-center pt-1">
                                        <input
                                            type="checkbox"
                                            id="relocate-assistance"
                                            className="accent-[#EA4C25] focus:ring-[#EA4C25] w-5 h-5"
                                            checked={relocationAssistance}
                                            onChange={(e) => setRelocationAssistance(e.target.checked)}
                                        />
                                        <Label className="font-semibold" htmlFor="relocate-assistance">Willing to offer relocation assistance?</Label>
                                    </div>
                                )}
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-xl">Willing to offer Visa Sponsorship</p>
                                <div className="flex flex-wrap gap-5 md:gap-10">
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="radio"
                                            id="visa-yes"
                                            name="visa"
                                            value="yes"
                                            checked={visaSponsorship}
                                            onChange={(e) => setVisaSponsorship(e.target.value === 'yes')}
                                            className="accent-[#EA4C25] focus:ring-[#EA4C25] w-5 h-5"
                                        />
                                        <Label htmlFor="visa-yes">Yes</Label>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="radio"
                                            id="visa-no"
                                            name="visa"
                                            value="no"
                                            checked={!visaSponsorship}
                                            onChange={(e) => setVisaSponsorship(e.target.value === 'yes')}
                                            className="accent-[#EA4C25] focus:ring-[#EA4C25] w-5 h-5"
                                        />
                                        <Label htmlFor="visa-no">No</Label>
                                    </div>
                                </div>
                                {!visaSponsorship && (
                                    <div className="flex gap-2 items-start pt-1">
                                        <input
                                            type="checkbox"
                                            id="visa-auto-skip"
                                            className="accent-[#EA4C25] focus:ring-[#EA4C25] w-5 h-5 mt-1"
                                            checked={autoSkipVisaCandidates}
                                            onChange={(e) => setAutoSkipVisaCandidates(e.target.checked)}
                                        />
                                        <Label className="font-semibold" htmlFor="visa-auto-skip">Auto-skip applicants who require sponsorship for an employment visa</Label>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="my-6 md:my-10"><Separator /></div>

                    {/* Section 3: Remote Work Details */}
                    <div className="flex flex-col md:grid md:grid-cols-7 mb-8 md:mb-0">
                        <div className="md:col-span-2">
                            <SectionTitle number="3" title="Remote Work Details" />
                        </div>
                        <div className="md:col-span-5 space-y-6 md:space-y-8">
                            <div className="space-y-1">
                                <p className="font-bold text-xl">What's your remote policy for this job?*</p>
                                <div className="flex flex-wrap gap-4 md:gap-10">
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="radio"
                                            id="in-office"
                                            name="remote-policy"
                                            value="In Office"
                                            checked={remotePolicy === 'In Office'}
                                            onChange={handleRemotePolicyChange}
                                            className="accent-[#EA4C25] focus:ring-[#EA4C25] w-5 h-5"
                                        />
                                        <Label htmlFor="in-office">In Office</Label>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="radio"
                                            id="onsite-or-remote"
                                            name="remote-policy"
                                            value="Onsite or Remote"
                                            checked={remotePolicy === 'Onsite or Remote'}
                                            onChange={handleRemotePolicyChange}
                                            className="accent-[#EA4C25] focus:ring-[#EA4C25] w-5 h-5"
                                        />
                                        <Label htmlFor="onsite-or-remote">Onsite or Remote</Label>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="radio"
                                            id="remote-only"
                                            name="remote-policy"
                                            value="Remote Only"
                                            checked={remotePolicy === 'Remote Only'}
                                            onChange={handleRemotePolicyChange}
                                            className="accent-[#EA4C25] focus:ring-[#EA4C25] w-5 h-5"
                                        />
                                        <Label htmlFor="remote-only">Remote Only</Label>
                                    </div>
                                </div>
                                {errors.remotePolicy && <p className="text-red-500 text-sm mt-1">{errors.remotePolicy}</p>}
                            </div>
                            <div className="space-y-1">
                                <p className={`font-bold text-xl ${remotePolicy === 'In Office' ? 'opacity-50' : ''}`}>Hiring regions for remote workers*</p>

                                <div className="flex gap-2 items-start pt-1">
                                    <input
                                        type="checkbox"
                                        id="remote-anywhere"
                                        className="accent-[#EA4C25] focus:ring-[#EA4C25] w-5 h-5 mt-1"
                                        disabled={remotePolicy === 'In Office'}
                                        checked={acceptWorldwide}
                                        onChange={(e) => setAcceptWorldwide(e.target.checked)}
                                    />
                                    <Label
                                        className={`font-semibold ${remotePolicy === 'In Office' ? 'opacity-50' : ''}`}
                                        htmlFor="remote-anywhere"
                                    >
                                        Accept remote workers from anywhere in the world
                                    </Label>
                                </div>
                                <ControlledMultiAddInput
                                    placeholder="e.g., India, United Kingdom, etc."
                                    suggestions={locations}
                                    disabled={remotePolicy === 'In Office' || acceptWorldwide}
                                    value={hiresIn || []}
                                    onChange={handleHiresInChange}
                                />
                            </div>
                            <div className="space-y-1">
                                <p className={`font-bold text-xl ${remotePolicy === 'In Office' ? 'opacity-50' : ''}`}>What is your remote culture?</p>
                                <div className="flex flex-col sm:flex-row gap-4 md:gap-10">
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="radio"
                                            id="in-person-setup"
                                            name="remote-structure"
                                            value="in-person"
                                            className="accent-[#EA4C25] focus:ring-[#EA4C25] w-5 h-5"
                                            disabled={remotePolicy === 'In Office'}
                                            checked={remoteCulture === 'in-person'}
                                            onChange={(e) => setRemoteCulture(e.target.value)}
                                        />
                                        <Label
                                            htmlFor="in-person-setup"
                                            className={remotePolicy === 'In Office' ? 'opacity-50' : ''}
                                        >
                                            We mostly have an in-person set-up
                                        </Label>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <input
                                            type="radio"
                                            id="mostly-remote"
                                            name="remote-structure"
                                            value="remote"
                                            className="accent-[#EA4C25] focus:ring-[#EA4C25] w-5 h-5"
                                            disabled={remotePolicy === 'In Office'}
                                            checked={remoteCulture === 'remote'}
                                            onChange={(e) => setRemoteCulture(e.target.value)}
                                        />
                                        <Label
                                            htmlFor="mostly-remote"
                                            className={remotePolicy === 'In Office' ? 'opacity-50' : ''}
                                        >
                                            We're mostly remote or distributed
                                        </Label>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className={`font-bold text-xl ${remotePolicy === 'In Office' ? 'opacity-50' : ''}`}>Timezones for remote workers</p>
                                <ControlledMultiAddInput
                                    suggestions={timeZoneOptions}
                                    placeholder="Select timezone"
                                    disabled={remotePolicy === 'In Office'}
                                    value={timezones || []}
                                    onChange={setTimezones}
                                />
                            </div>
                            <div className="space-y-1">
                                <p className={`font-bold text-xl ${remotePolicy === 'In Office' ? 'opacity-50' : ''}`}>Collaboration Hours</p>
                                <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">
                                    <div className="flex gap-2 items-center">
                                        <ControlledInput
                                            type="time"
                                            className={`h-10 border border-input rounded-md px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring ${remotePolicy === 'In Office' ? 'opacity-50' : ''}`}
                                            disabled={remotePolicy === 'In Office'}
                                            value={collaborationHours.start || ""}
                                            onChange={(val) => setCollaborationHours({ ...collaborationHours, start: val })}
                                        />
                                        <div className="mx-1">-</div>
                                        <ControlledInput
                                            type="time"
                                            className={`h-10 border border-input rounded-md px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring ${remotePolicy === 'In Office' ? 'opacity-50' : ''}`}
                                            disabled={remotePolicy === 'In Office'}
                                            value={collaborationHours.end || ""}
                                            onChange={(val) => setCollaborationHours({ ...collaborationHours, end: val })}
                                        />
                                    </div>
                                    <div className="w-full">
                                        <ControlledAutocompleteSelect
                                            options={timeZoneOptions}
                                            placeHolder="Select timezone"
                                            disabled={remotePolicy === 'In Office'}
                                            value={collaborationHours.timeZone || ""}
                                            onChange={(value) => setCollaborationHours({ ...collaborationHours, timeZone: value })}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="my-6 md:my-10"><Separator /></div>

                    {/* Section 4: Salary and Equity */}
                    <div className="flex flex-col md:grid md:grid-cols-7 mb-8 md:mb-0">
                        <div className="md:col-span-2">
                            <SectionTitle number="4" title="Salary and Equity" />
                        </div>
                        <div className="md:col-span-5 space-y-6 md:space-y-8">
                            <div className="space-y-1">
                                <p className="font-bold text-xl">Currency</p>
                                <ControlledAutocompleteSelect
                                    options={currencyOptions}
                                    placeHolder="Select currency"
                                    value={currency || ""}
                                    onChange={handleCurrencyChange}
                                />
                            </div>
                            <div className="space-y-1">
                                <p className="font-bold text-xl">Annual salary range</p>
                                <div className="flex flex-col sm:flex-row gap-3 items-center w-full">
                                    <div className="relative w-full sm:w-1/2">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                            {currency ? currency.match(/\(([^)]+)\)/)?.[1] || '$' : '$'}
                                        </span>
                                        <ControlledInput
                                            type="number"
                                            placeholder="Enter starting price"
                                            className="pl-14"
                                            value={salary.min || ""}
                                            onChange={val => setSalary({ ...salary, min: val })}
                                        />
                                    </div>
                                    <div className="hidden sm:block">-</div>
                                    <div className="relative w-full sm:w-1/2">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                                            {currency ? currency.match(/\(([^)]+)\)/)?.[1] || '$' : '$'}
                                        </span>
                                        <ControlledInput
                                            type="number"
                                            placeholder="Enter ending price"
                                            className="pl-14"
                                            value={salary.max || ""}
                                            onChange={val => setSalary({ ...salary, max: val })}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-1">
                                <p className={`font-bold text-xl ${noEquity ? 'opacity-50' : ''}`}>Equity range</p>
                                <div className="flex flex-col sm:flex-row gap-3 items-center w-full">
                                    <div className="relative w-full sm:w-1/2">
                                        <ControlledInput
                                            type="number"
                                            step="0.01"
                                            placeholder="0.0"
                                            className={`pr-7 ${noEquity ? 'opacity-50' : ''}`}
                                            disabled={noEquity}
                                            value={equity.min || ""}
                                            onChange={val => setEquity({ ...equity, min: val })}
                                        />
                                        <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm ${noEquity ? 'opacity-50' : ''}`}>%</span>
                                    </div>
                                    <div className="hidden sm:block">-</div>
                                    <div className="relative w-full sm:w-1/2">
                                        <ControlledInput
                                            type="number"
                                            step="0.01"
                                            placeholder="1.0"
                                            className={`pr-7 ${noEquity ? 'opacity-50' : ''}`}
                                            disabled={noEquity}
                                            value={equity.max || ""}
                                            onChange={val => setEquity({ ...equity, max: val })}
                                        />
                                        <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm ${noEquity ? 'opacity-50' : ''}`}>%</span>
                                    </div>
                                </div>
                                <div className="flex gap-2 items-center pt-1">
                                    <input
                                        type="checkbox"
                                        id="no-equity"
                                        className="accent-[#EA4C25] focus:ring-[#EA4C25] w-5 h-5"
                                        checked={noEquity}
                                        onChange={(e) => setNoEquity(e.target.checked)}
                                    />
                                    <Label className="font-semibold" htmlFor="no-equity">No Equity</Label>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="my-6 md:my-10"><Separator /></div>

                    {/* Section 7: Company Details */}
                    <div className="flex flex-col md:grid md:grid-cols-7">
                        <div className="md:col-span-2">
                            <SectionTitle number="5" title="Company Details" />
                        </div>
                        <div className="md:col-span-5 space-y-6 md:space-y-8">
                            <div className="space-y-1">
                                <p className="font-bold text-xl">Company Size*</p>
                                <ControlledAutocompleteSelect
                                    options={companySizeOptions}
                                    placeHolder="Enter Company Size"
                                    value={companySize || ""}
                                    onChange={handleCompanySizeChange}
                                    required
                                />
                                {errors.companySize && <p className="text-red-500 text-sm mt-1">{errors.companySize}</p>}
                            </div>
                        </div>
                    </div>
                    {errors.api && <p className="text-red-500 text-center mt-4">{errors.api}</p>}
                    {successMessage && <p className="text-green-600 text-center mt-4">{successMessage}</p>}
                    <div className="flex gap-3 justify-end mt-8">

                    </div>
                </div>
            </form>
        </>
    );
}

export default EditDraft;