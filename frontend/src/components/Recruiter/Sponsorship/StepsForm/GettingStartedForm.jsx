import React, { useState } from "react";

export default function GettingStartedForm() {
	const [answers, setAnswers] = useState({});

	const handleSelect = (name, value) => {
		setAnswers((prev) => ({ ...prev, [name]: value }));
	};

	React.useEffect(() => {
		console.log(answers); // This will log the updated state
	}, [answers]);

	// Change Question to a proper React component
	function Question({ name, label, answers, handleSelect }) {
		return (
			<div key={name} className="flex flex-col gap-2 sm:gap-0">
				<div className="flex items-center justify-between">
					<label className="block font-bold text-gray-900 text-base sm:text-md">
						{label}
					</label>
					<span className="text-xs text-gray-400 ml-4 whitespace-nowrap">
						Required
					</span>
				</div>
				<div className="flex gap-3 mt-2">
					<button
						type="button"
						className={`w-16 h-9 rounded-full border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 ${answers[name] === "Yes"
							? "bg-blue-50 border-blue-500 text-blue-600"
							: "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
							}`}
						onClick={() => handleSelect(name, "Yes")}
					>
						Yes
					</button>
					<button
						type="button"
						className={`w-16 h-9 rounded-full border text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-200 ${answers[name] === "No"
							? "bg-blue-50 border-blue-500 text-blue-600"
							: "bg-white border-gray-300 text-gray-700 hover:border-blue-400"
							}`}
						onClick={() => handleSelect(name, "No")}
					>
						No
					</button>
				</div>
			</div>
		);
	}

	return (
		<form className="max-w-6xl md:px-8 lg:px-24 mx-auto py-12 px-2">
			<div className="space-y-10">
				<Question key={1} name={"hasSponsorLicence"} label={"Does Softhire Ltd already have a Sponsor Licence?"} answers={answers} handleSelect={handleSelect} />
				{answers["hasSponsorLicence"] === "Yes" && (
					<>
						<div className="mt-6">
							<div className="flex items-center justify-between mb-2">
								<label className="block font-medium text-gray-900 text-base">Enter your sponsor licence number:</label>
								<span className="text-xs text-gray-400 ml-4 whitespace-nowrap">Required</span>
							</div>
							<input
								type="text"
								className="w-full rounded-lg border border-blue-300 bg-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
								value={answers.sponsorLicenceNumber || ""}
								onChange={e => setAnswers(prev => ({ ...prev, sponsorLicenceNumber: e.target.value }))}
								required
							/>
						</div>
						<Question key={244} name={"interestedInSubsidiaryLicence"} label={"Are you looking to apply for a new Sponsor Licence for a subsidiary of Softhire Ltd ?"} answers={answers} handleSelect={handleSelect} />
						{answers["interestedInSubsidiaryLicence"] === "No" && (
							<div className="w-full bg-[#efefef] p-2 rounded-xl text-sm font-medium px-4 ">Please email us at hello@getborderless.co.uk with how we can help.</div>
						)}
						{/* <Question key={274} name={"interestedInSubsidiaryLicence"} label={"Have you ever been rejected for a Sponsor Licence Application?"} answers={answers} handleSelect={handleSelect} /> */}
					</>
				)}
				{answers["hasSponsorLicence"] === "No" && (
					<>
						<Question key={2} name={"previouslyHadSponsorLicence"} label={"Have you previously had a Sponsor Licence?"} answers={answers} handleSelect={handleSelect} />
						{answers["previouslyHadSponsorLicence"] === "Yes" && (
							<div className="mt-6">
								<div className="flex items-center justify-between mb-2">
									<label className="block font-medium text-gray-900 text-base">Enter your sponsor licence number:</label>
									<span className="text-xs text-gray-400 ml-4 whitespace-nowrap">Required</span>
								</div>
								<input
									type="text"
									className="w-full rounded-lg border border-blue-300 bg-gray-100 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 text-base"
									value={answers.prevSponsorLicenceNumber || ""}
									onChange={e => setAnswers(prev => ({ ...prev, prevSponsorLicenceNumber: e.target.value }))}
									required
								/>
							</div>
						)}
					</>
				)}
				{
					answers["hasSponsorLicence"] === "No" && (
						<Question key={3} name={"revokedOrSuspended"} label={"Have you previously had a Sponsor Licence revoked or suspended?"} answers={answers} handleSelect={handleSelect} />
					)
				}
				{
					(answers["revokedOrSuspended"] === "Yes" && answers["previouslyHadSponsorLicence"] === "Yes") && (
						<div className="mt-8">
							<div className="flex items-center justify-between mb-2">
								<label className="block font-medium text-gray-900 text-base">Please explain why was your Sponsor Licence revoked or suspended?</label>
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
					((answers["revokedOrSuspended"] === "No" && answers["previouslyHadSponsorLicence"] === "Yes") || answers["hasSponsorLicence"] === "Yes") && (
						<>
							<Question key={56} name={"everBeenRejected"} label={"Have you ever been rejected for a Sponsor Licence Application?"} answers={answers} handleSelect={handleSelect} />
							{answers["everBeenRejected"] === "Yes" && (
								<div className="mt-8">
									<div className="flex items-center justify-between mb-2">
										<label className="block font-medium text-gray-900 text-base">Please explain why was your Sponsor Licence Application rejected?</label>
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
					<div className="w-full bg-[#efefef] p-2 rounded-xl text-sm font-medium px-4 ">We only process Skilled Worker sponsor licenses as of now. Please email us at hello@getborderless.co.uk with how we can help.</div>
				)}
				{answers["isRecruitmentAgency"] === "Yes" && (
					<Question key={6} name={"contractOutWorkers"} label={"Are you looking to sponsor workers who will then be contracted out to work at different companies?"} answers={answers} handleSelect={handleSelect} />
				)}





			</div>
			<div className="flex flex-col sm:flex-row gap-4 justify-start sm:justify-end mt-16 border-t pt-8">
				<button
					type="submit"
					className="px-8 py-3 rounded-full bg-blue-50 text-blue-300 font-semibold text-base cursor-not-allowed select-none shadow-none border-none"
					disabled
				>
					Submit
				</button>
				<button
					type="button"
					className="px-8 py-3 rounded-full bg-blue-50 text-gray-700 font-semibold text-base hover:bg-blue-100 transition-colors"
				>
					Cancel
				</button>
			</div>
		</form>
	);
}