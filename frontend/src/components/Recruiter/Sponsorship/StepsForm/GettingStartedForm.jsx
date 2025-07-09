import React, { use, useEffect, useState } from "react";
import { Input, Question } from "@/components/miniComponents/MiniInputComponents.jsx";
import { getGettingStarted, updateGettingStarted } from "@/Api/SpocershipApplicationServices";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import Loader from "@/components/miniComponents/Loader";
import { useNavigate } from "react-router-dom";


export default function GettingStartedForm() {
	const [answers, setAnswers] = useState({});
	const { applicationId, companyName } = useSelector((state) => state.sponcershipApplication);

	const [submitting, setSubmitting] = useState(false);
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	const fetchFormData = async () => {
		try {
			setLoading(true);
			const response = await getGettingStarted(applicationId);
			if (response) {
				setAnswers(mapBackendToAnswers(response));
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

	const mapBackendToAnswers = (data) => {
		console.log("data:", data);
		if (!data) return {};
		return {
			hasSponsorLicense: data.hasSponsorLicense?.value ? "Yes" : "No",
			sponsorLicenseNumber: data.hasSponsorLicense?.licenseNumber || "",
			previouslyHadSponsorLicense: data.hadSponsorLicenseBefore?.value ? "Yes" : "No",
			prevSponsorLicenseNumber: data.hadSponsorLicenseBefore?.licenseNumber || "",
			revokedOrSuspended: data.hadLicenseRevokedOrSuspended ? "Yes" : "No",
			everBeenRejected: data.rejectedBefore?.value ? "Yes" : "No",
			rejectionReason: data.rejectedBefore?.reason || "",
			lookingForSponsorSkilledWorkers: data.wantsToSponsorSkilledWorkers ? "Yes" : "No",
			isRecruitmentAgency: data.isRecruitmentAgency?.value ? "Yes" : "No",
			contractOutWorkers:
				data.isRecruitmentAgency?.contractsOutToOthers === true
					? "Yes"
					: data.isRecruitmentAgency?.contractsOutToOthers === false
						? "No"
						: undefined,
		};
	};

	const data = {
		hasSponsorLicense: {
			value: answers.hasSponsorLicense === "Yes",
			licenseNumber: answers.sponsorLicenseNumber || undefined,
		},
		hadSponsorLicenseBefore: {
			value: answers.previouslyHadSponsorLicense === "Yes",
			licenseNumber: answers.prevSponsorLicenseNumber || undefined,
		},
		hadLicenseRevokedOrSuspended: answers.revokedOrSuspended === "Yes",
		rejectedBefore: {
			value: answers.everBeenRejected === "Yes",
			reason: answers.rejectionReason || undefined,
		},
		wantsToSponsorSkilledWorkers: answers.lookingForSponsorSkilledWorkers === "Yes",
		isRecruitmentAgency: {
			value: answers.isRecruitmentAgency === "Yes",
			contractsOutToOthers:
				answers.contractOutWorkers === "Yes"
					? true
					: answers.contractOutWorkers === "No"
						? false
						: undefined,
		},
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		setSubmitting(true);
		try {
			const response = await updateGettingStarted(applicationId, data);
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
		if (answers["hasSponsorLicense"] === undefined) return false;
		if (answers["hasSponsorLicense"] === "Yes") {
			if (!answers.sponsorLicenseNumber) return false;
			if (answers["interestedInSubsidiaryLicense"] === undefined) return false;
			if (answers["interestedInSubsidiaryLicense"] === "No") return true;
		}
		if (answers["hasSponsorLicense"] === "No") {
			if (answers["previouslyHadSponsorLicense"] === undefined) return false;
			if (answers["previouslyHadSponsorLicense"] === "Yes" && !answers.prevSponsorLicenseNumber) return false;
			if (answers["revokedOrSuspended"] === undefined) return false;
			if (answers["revokedOrSuspended"] === "Yes" && !answers.suspensionReason) return false;
		}
		if (
			((answers["revokedOrSuspended"] === "No" && answers["previouslyHadSponsorLicense"] === "Yes") || answers["hasSponsorLicense"] === "Yes")
		) {
			if (answers["everBeenRejected"] === undefined) return false;
			if (answers["everBeenRejected"] === "Yes" && !answers.rejectionReason) return false;
		}
		if (answers["lookingForSponsorSkilledWorkers"] === undefined) return false;
		if (answers["lookingForSponsorSkilledWorkers"] === "Yes" && answers["isRecruitmentAgency"] === undefined) return false;
		return true;
	};


	if (loading) {
		return <div className="flex justify-center items-center h-screen"><Loader /></div>;
	}

	return (
		<form className="max-w-6xl md:px-8 lg:px-24 mx-auto py-12 px-2">
			<div className="space-y-10">
				<Question key={1} name={"hasSponsorLicense"} label={`Does ${companyName} Ltd already have a Sponsor License?`} answers={answers} handleSelect={handleSelect} />
				{answers["hasSponsorLicense"] === "Yes" && (
					<>
						<div className="mt-6">
							<div className="flex items-center justify-between mb-2">
								<label className="block font-medium text-gray-900 text-base">Enter your sponsor license number:</label>
								<span className="text-xs text-gray-400 ml-4 whitespace-nowrap">Required</span>
							</div>
							<input
								type="text"
								className="w-full rounded-lg border border-blue-300 bg-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
								value={answers.sponsorLicenseNumber || ""}
								onChange={e => setAnswers(prev => ({ ...prev, sponsorLicenseNumber: e.target.value }))}
								required
							/>
						</div>
						<Question key={244} name={"interestedInSubsidiaryLicense"} label={`Are you looking to apply for a new Sponsor License for a subsidiary of ${companyName} Ltd ?`} answers={answers} handleSelect={handleSelect} />
						{answers["interestedInSubsidiaryLicense"] === "No" && (
							<div className="w-full bg-[#efefef] p-2 rounded-xl text-sm font-medium px-4 ">Please email us at hello@softhire.co.uk with how we can help.</div>
						)}
						{/* <Question key={274} name={"interestedInSubsidiaryLicense"} label={"Have you ever been rejected for a Sponsor License Application?"} answers={answers} handleSelect={handleSelect} /> */}
					</>
				)}
				{answers["hasSponsorLicense"] === "No" && (
					<>
						<Question key={2} name={"previouslyHadSponsorLicense"} label={"Have you previously had a Sponsor License?"} answers={answers} handleSelect={handleSelect} />
						{answers["previouslyHadSponsorLicense"] === "Yes" && (
							<div className="mt-6">
								<div className="flex items-center justify-between mb-2">
									<label className="block font-medium text-gray-900 text-base">Enter your sponsor license number:</label>
									<span className="text-xs text-gray-400 ml-4 whitespace-nowrap">Required</span>
								</div>
								<input
									type="text"
									className="w-full rounded-lg border border-blue-300 bg-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
									value={answers.prevSponsorLicenseNumber || ""}
									onChange={e => setAnswers(prev => ({ ...prev, prevSponsorLicenseNumber: e.target.value }))}
									required
								/>
							</div>
						)}
					</>
				)}
				{
					answers["hasSponsorLicense"] === "No" && (
						<Question key={3} name={"revokedOrSuspended"} label={"Have you previously had a Sponsor License revoked or suspended?"} answers={answers} handleSelect={handleSelect} />
					)
				}
				{
					(answers["revokedOrSuspended"] === "Yes" && answers["previouslyHadSponsorLicense"] === "Yes") && (
						<div className="mt-8">
							<div className="flex items-center justify-between mb-2">
								<label className="block font-medium text-gray-900 text-base">Please explain why was your Sponsor License revoked or suspended?</label>
								<span className="text-xs text-gray-400 ml-4 whitespace-nowrap">Required</span>
							</div>
							<textarea
								className="w-full rounded-lg border border-blue-300 bg-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base min-h-[120px] resize-none"
								value={answers.suspensionReason || ""}
								onChange={e => setAnswers(prev => ({ ...prev, suspensionReason: e.target.value }))}
								required
							/>
							<div className="w-full bg-yellow-50 rounded-xl px-6 py-4 text-base text-yellow-700 flex items-center gap-2 mt-4">
								<svg width="22" height="22" fill="none" viewBox="0 0 24 24" className="flex-shrink-0"><path d="M12 17h.01M12 7v6" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="10" stroke="#D97706" strokeWidth="2" /></svg>
								You will be asked to upload a letter of suspension or revocation in the "Supporting Documents" section later in the form.
							</div>
						</div>
					)
				}
				{
					((answers["revokedOrSuspended"] === "No" && answers["previouslyHadSponsorLicense"] === "Yes") || answers["hasSponsorLicense"] === "Yes") && (
						<>
							<Question key={56} name={"everBeenRejected"} label={"Have you ever been rejected for a Sponsor License Application?"} answers={answers} handleSelect={handleSelect} />
							{answers["everBeenRejected"] === "Yes" && (
								<div className="mt-8">
									<div className="flex items-center justify-between mb-2">
										<label className="block font-medium text-gray-900 text-base">Please explain why was your Sponsor License Application rejected?</label>
										<span className="text-xs text-gray-400 ml-4 whitespace-nowrap">Required</span>
									</div>
									<textarea
										className="w-full rounded-lg border border-blue-300 bg-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base min-h-[120px] resize-none"
										value={answers.rejectionReason || ""}
										onChange={e => setAnswers(prev => ({ ...prev, rejectionReason: e.target.value }))}
										required
									/>
									<div className="w-full bg-yellow-50 rounded-xl px-6 py-4 text-base text-yellow-700 flex items-center gap-2 mt-4">
										<svg width="22" height="22" fill="none" viewBox="0 0 24 24" className="flex-shrink-0"><path d="M12 17h.01M12 7v6" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><circle cx="12" cy="12" r="10" stroke="#D97706" strokeWidth="2" /></svg>
										You will be asked to upload a letter of rejection from the Home Office in the "Supporting Documents" section later in the form.
									</div>
								</div>
							)}
						</>
					)
				}
				<Question key={4} name={"lookingForSponsorSkilledWorkers"} label={"Are you looking to sponsor Skilled Workers?"} answers={answers} handleSelect={handleSelect} />
				{answers["lookingForSponsorSkilledWorkers"] === "Yes" && (
					<Question key={5} name={"isRecruitmentAgency"} label={"Is your company a Recruitment Agency? (e.g a temporary staffing agency or outsourcing company)"} answers={answers} handleSelect={handleSelect} />
				)}
				{answers["lookingForSponsorSkilledWorkers"] === "No" && (
					<div className="w-full bg-[#efefef] p-2 rounded-xl text-sm font-medium px-4 ">We only process Skilled Worker sponsor licenses as of now. Please email us at hello@softhire.co.uk with how we can help.</div>
				)}
				{answers["isRecruitmentAgency"] === "Yes" && (
					<Question key={6} name={"contractOutWorkers"} label={"Are you looking to sponsor workers who will then be contracted out to work at different companies?"} answers={answers} handleSelect={handleSelect} />
				)}

			</div>
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
		</form>
	);
}