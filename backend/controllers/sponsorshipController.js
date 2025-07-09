const SponsorshipApplication = require("../models/SponsorshipApplication");
const GettingStarted = require("../models/GettingStarted");
const AboutYourCompany = require("../models/AboutYourCompany");
const CompanyStructure = require("../models/CompanyStructure");
const Recruiter = require("../models/Recruiter"); // Ensure this is imported

const ActivityAndNeeds = require("../models/ActivityAndNeeds");
// const SponsorshipApplication = require("../models/SponsorshipApplication");

// 🔍 Validation logic
// 🔍 Validation logic
const AuthorisingOfficer = require("../models/AuthorisingOfficer");
// const SponsorshipApplication = require("../models/SponsorshipApplication");
// const SystemAccess = require("../models/SystemAccess");
const Level1AccessUser = require("../models/SystemAccess");
// const SponsorshipApplication = require("../models/SponsorshipApplication");
const SupportingDocuments = require("../models/SupportingDocuments");
// const SponsorshipApplication = require("../models/SponsorshipApplication");
const OrganizationSize = require("../models/OrganizationSize");
// const SponsorshipApplication = require("../models/SponsorshipApplication");
const Declarations = require("../models/Declarations");
// const SponsorshipApplication = require("../models/SponsorshipApplication");
// exports.submitApplication = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const application = await SponsorshipApplication.findById(id);

//     if (!application) {
//       return res.status(404).json({ error: "Application not found." });
//     }

//     if (application.user.toString() !== req.user.id) {
//       return res.status(403).json({ error: "Unauthorized." });
//     }

//     if (application.isSubmitted) {
//       return res.status(400).json({ error: "Application has already been submitted." });
//     }

//     // ✅ Optional: Validate all required sections exist
//     const requiredSections = [
//       "gettingStarted",
//       "aboutYourCompany",
//       "companyStructure",
//       "activityAndNeeds",
//       "authorisingOfficer",
//       "systemAccess",
//       "supportingDocuments",
//       "organizationSize",
//       "declarations"
//     ];

//     const missing = requiredSections.filter(section => !application[section]);
//     if (missing.length > 0) {
//       return res.status(400).json({
//         error: "Please complete all sections before submission.",
//         missingSections: missing
//       });
//     }

//     application.isSubmitted = true;
//     await application.save();

//     res.status(200).json({ message: "Application submitted successfully." });
//   } catch (err) {
//     console.error("Submit Error:", err);
//     res.status(500).json({ error: "Internal server error." });
//   }
// };


exports.submitOrUpdateDeclarations = async (req, res) => {
  const { id } = req.params;
  const {
    serviceType,
    canMeetSponsorDuties,
    agreesToTerms,
  } = req.body;

  console.log("Received body:", req.body);
  console.log("User:", req.user);

  if (!serviceType || !canMeetSponsorDuties || !agreesToTerms) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const application = await SponsorshipApplication.findById(id);
    if (!application) {
      return res.status(404).json({ error: "Application not found." });
    }

    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    } if (application.isSubmitted)
      return res.status(400).json({ error: "Application has already been submitted." });


    const declarationData = {
      serviceType,
      canMeetSponsorDuties,
      agreesToTerms, // ✅ fixed
      application: application._id
    };

    let declarations;
    if (application.declarations) {
      declarations = await Declarations.findByIdAndUpdate(
        application.declarations,
        declarationData,
        { new: true }
      );
    } else {
      declarations = new Declarations(declarationData);
      await declarations.save();
      application.declarations = declarations._id;
    }

    await application.save();

    res.status(200).json({ message: "Declarations submitted successfully", declarations });
  } catch (err) {
    console.error("Declarations Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};




exports.updateOrganizationSize = async (req, res) => {
  const { id } = req.params;
  const data = req.body.data;
  // console.log(data)

  // const validTurnover = ["below_15m", "15m_or_more"];
  // const validAssets = ["below_7_5m", "7_5m_or_more"];
  // const validEmployees = ["below_50", "50_or_more"];

  // if (
  //   !validTurnover.includes(data.turnover) ||
  //   !validAssets.includes(data.assets) ||
  //   !validEmployees.includes(data.employees)
  // ) {
  //   return res.status(400).json({ error: "Invalid value provided for one or more fields." });
  // }

  try {
    const application = await SponsorshipApplication.findById(id);
    if (!application) return res.status(404).json({ error: "Application not found" });

    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // if (application.isSubmitted) {
    //   return res.status(400).json({ error: "Application has already been submitted." });
    // }

    let sizeDoc;
    if (application.organizationSize) {
      sizeDoc = await OrganizationSize.findByIdAndUpdate(application.organizationSize, data, { new: true });
    } else {
      sizeDoc = new OrganizationSize(data);
      await sizeDoc.save();
      application.organizationSize = sizeDoc._id;
    }

    await application.save();
    res.status(200).json({ message: "Organization Size section updated", organizationSize: sizeDoc });
  } catch (err) {
    console.error("Organization Size Update Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.uploadSingleSupportingDocument = async (req, res) => {
  const { id } = req.params;
  const { fieldName, name } = req.body;
  const file = req.file;

  if (!fieldName || !file) {
    return res.status(400).json({ error: "fieldName and file are required" });
  }

  try {
    const application = await SponsorshipApplication.findById(id);
    if (!application) return res.status(404).json({ error: "Application not found." });

    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // ✅ Always get one record
    let documentRecord = await SupportingDocuments.findOne({ application: id });

    if (!documentRecord) {
      documentRecord = new SupportingDocuments({
        application: application._id
      });
    }

    if (fieldName === "rightToWorkChecks") {
      let data = req.body.data;
      if (typeof data === "string") {
        try {
          data = JSON.parse(data);
        } catch (e) {
          return res.status(400).json({ error: "Invalid JSON in data field" });
        }
      }
      if (!data || !data.employeeName || !data.startDate || !data.rightToWorkDate || !data.isBritishNational) {
        return res.status(400).json({ error: "Missing required fields for right to work checks" });
      }

      documentRecord.set(fieldName, {
        isBritishNational: data.isBritishNational,
        startDate: new Date(data.startDate),
        rightToWorkDate: new Date(data.rightToWorkDate),
        employeeName: data.employeeName,
        file: {
          name: file.originalname,
          url: file.path
        }
      });
      documentRecord.markModified(fieldName);
    } else {
      documentRecord[fieldName] = {
        name: name || file.originalname,
        url: file.path
      };
    }

    await documentRecord.save();

    res.status(200).json({
      message: "Document uploaded successfully.",
      field: fieldName,
      document: documentRecord[fieldName]
    });

  } catch (err) {
    console.error("Document Upload Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.submitSupportingDocument = async (req, res) => {
  const { id } = req.params;

  try {
    const application = await SponsorshipApplication.findById(id);
    if (!application) return res.status(404).json({ error: "Application not found." });
    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const supportingDocuments = await SupportingDocuments.findOne({ application: id });
    if (!supportingDocuments) {
      return res.status(404).json({ error: "Supporting Documents not found." });
    }

    const combined = { ...supportingDocuments.toObject() };

    const hasRightToWork = combined.rightToWorkChecks && combined.rightToWorkChecks.file;
    const hasCertificate = !!combined.certificateOfIncorporation;
    const hasBank = !!combined.businessBankStatement;
    const hasInsurance = !!combined.employersLiabilityInsurance;

    if (!hasRightToWork || !hasCertificate || !hasBank || !hasInsurance) {
      return res.status(400).json({ error: "Required documents are missing." });
    }

    application.supportingDocuments = supportingDocuments._id;
    await application.save();

    res.status(200).json({
      message: "Supporting Documents Submitted successfully.",
      combinedSupportingDocuments: combined,
      supportingDocuments: supportingDocuments
    });
  } catch (err) {
    console.error("Supporting Documents Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};





exports.uploadSupportingDocuments = async (req, res) => {
  const { id } = req.params;
  const body = req.body;
  const files = req.files || {};

  try {
    const application = await SponsorshipApplication.findById(id);
    if (!application) return res.status(404).json({ error: "Application not found." });
    if (application.user.toString() !== req.user.id)
      return res.status(403).json({ error: "Unauthorized" });

    let docs = await SupportingDocuments.findById(application.supportingDocuments);

    // If no docs exist, create a new one
    if (!docs) {
      docs = new SupportingDocuments({ application: id });
    }

    // 🔁 Update only the specific field that came in
    for (const [field, fileArr] of Object.entries(files)) {
      docs[field] = {
        name: body?.[`${field}Name`] || "", // optional name input
        url: fileArr[0].path
      };
    }

    await docs.save();

    if (!application.supportingDocuments) {
      application.supportingDocuments = docs._id;
      await application.save();
    }

    res.status(200).json({ message: "Document uploaded", updated: files });

  } catch (err) {
    console.error("Document Upload Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.updateSingleLevel1AccessEntry = async (req, res) => {
  const { id, accessId } = req.params;
  const updateData = req.body;

  try {
    const application = await SponsorshipApplication.findById(id);
    if (!application) return res.status(404).json({ error: "Application not found" });

    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    if (!application.level1AccessUsers.includes(accessId)) {
      return res.status(400).json({ error: "Access entry does not belong to this application" });
    }

    const updatedAccess = await Level1AccessUser.findByIdAndUpdate(accessId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedAccess) {
      return res.status(404).json({ error: "Access entry not found" });
    }

    res.status(200).json({
      message: "Level 1 Access entry updated successfully",
      level1AccessUser: updatedAccess,
    });

  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};
exports.updateSystemAccess = async (req, res) => {
  const { id } = req.params;
  const entry = req.body.data; // single access entry

  try {
    const application = await SponsorshipApplication.findById(id);
    if (!application) return res.status(404).json({ error: "Application not found." });

    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // 🛡️ Validate the entry
    if (entry.needsLevel1Access && !entry.level1User) {
      return res.status(400).json({ error: "Level 1 user details are required when Level 1 access is needed." });
    }

    const user = entry.level1User;
    // if (user) {
    //   if (user.hasNINumber && !user.nationalInsuranceNumber) {
    //     return res.status(400).json({ error: "NI Number is required if marked as available." });
    //   }
    //   if (user.hasNINumber === false && !user.niExemptReason) {
    //     return res.status(400).json({ error: "NI exemption reason is required." });
    //   }
    //   if (user.hasConvictions && !user.convictionDetails) {
    //     return res.status(400).json({ error: "Conviction details are required." });
    //   }
    //   if (!user.isSettledWorker) {
    //     if (
    //       !user.immigrationStatus ||
    //       !user.passportNumber ||
    //       !user.homeOfficeReference ||
    //       !user.permissionExpiryDate
    //     ) {
    //       return res.status(400).json({ error: "Complete immigration details are required for non-settled workers." });
    //     }
    //   }
    // }

    // ✅ Create and save new access entry document
    const level1AccessDoc = new Level1AccessUser(entry);
    await level1AccessDoc.save();

    // ✅ Link the new entry to the application
    if (!Array.isArray(application.level1AccessUsers)) {
      application.level1AccessUsers = [];
    }

    application.level1AccessUsers.push(level1AccessDoc._id);
    await application.save();

    res.status(200).json({
      message: "System Access entry added",
      level1AccessUserId: level1AccessDoc._id
    });

  } catch (err) {
    console.error("System Access Update Error:", err.message);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};


exports.updateAuthorisingOfficers = async (req, res) => {
  const { id } = req.params;
  const { authorisingOfficers } = req.body.data;
  console.log(authorisingOfficers);

  if (!Array.isArray(authorisingOfficers) || authorisingOfficers.length === 0) {
    return res.status(400).json({ error: "At least one authorising officer is required." });
  }

  try {
    const application = await SponsorshipApplication.findById(id);
    if (!application) return res.status(404).json({ error: "Application not found." });

    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Delete old officers if updating
    if (application.authorisingOfficer && Array.isArray(application.authorisingOfficer)) {
      await AuthorisingOfficer.deleteMany({ _id: { $in: application.authorisingOfficer } });
    }

    // Insert new ones
    const inserted = await AuthorisingOfficer.insertMany(authorisingOfficers);
    const ids = inserted.map(officer => officer._id);

    application.authorisingOfficers = ids;
    await application.save();

    res.status(200).json({
      message: "Authorising Officers updated",
      authorisingOfficers: inserted
    });

  } catch (err) {
    console.error("Authorising Officers Update Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


function validateActivityAndNeeds(data) {
  if (data.employsMigrantWorkers && typeof data.migrantWorkerCount !== "number") {
    return "Please specify how many migrant workers you employ.";
  }

  if (
    data.hasIdentifiedCandidates &&
    (!Array.isArray(data.prospectiveEmployees) || data.prospectiveEmployees.length === 0)
  ) {
    return "Please provide at least one prospective employee.";
  }

  if (!Array.isArray(data.reasonsForSponsorship) || data.reasonsForSponsorship.length === 0) {
    return "Please specify at least one reason for sponsorship.";
  }

  if (data.hasHRPlatform) {
    if (!data.hrPlatformName) {
      return "Please specify the HR platform name.";
    }

    if (typeof data.hrPlatformCoversAll !== "boolean") {
      return "Please specify whether the HR platform covers Payslip, Rotas, Annual & Sick Leave.";
    }

    if (data.hrPlatformCoversAll) {
      if (typeof data.wantsBorderlessApp !== "boolean") {
        return "Please specify if you want to use the Borderless compliance app.";
      }

      if (data.wantsBorderlessApp === false && !data.compliancePlan) {
        return "Please describe how you plan to maintain Home Office compliance.";
      }

      if (data.wantsBorderlessApp === true && data.compliancePlan) {
        return "Compliance plan should not be provided when using Borderless compliance app.";
      }
    }
  }

  return null;
}



// ✅ PATCH: Update Activity & Needs Section
exports.updateActivityAndNeeds = async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  // ✅ Handle passport file (if any) via Cloudinary
  if (req.file?.path) {
    if (!data.prospectiveEmployees || !Array.isArray(data.prospectiveEmployees)) {
      return res.status(400).json({ error: "No prospective employee data provided for passport upload." });
    }

    // Attach the file URL to the first prospective employee
    data.prospectiveEmployees[0].passport = req.file.path;
  }

  // ✅ Validation
  const validationError = validateActivityAndNeeds(data);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const application = await SponsorshipApplication.findById(id);
    if (!application) {
      return res.status(404).json({ error: "Application not found." });
    }

    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    if (application.isSubmitted)
      return res.status(400).json({ error: "Application has already been submitted." });

    let activityDoc;

    if (application.activityAndNeeds) {
      activityDoc = await ActivityAndNeeds.findByIdAndUpdate(application.activityAndNeeds, data, {
        new: true,
      });
    } else {
      activityDoc = new ActivityAndNeeds(data);
      await activityDoc.save();
      application.activityAndNeeds = activityDoc._id;
    }

    await application.save();

    res.status(200).json({
      message: "Activity & Needs section updated",
      activityAndNeeds: activityDoc,
    });
  } catch (err) {
    console.error("Activity & Needs Update Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ PATCH: Update Activity & Needs Section

// 🔍 Validation for Company Structure
function validateCompanyStructure(data) {
  if (data.operatesInCareSector && typeof data.operatesInDomiciliaryCare !== "boolean") {
    return "Please specify if you operate in the domiciliary care sector.";
  }

  if (data.tradedUnderOtherNames && (!data.previousTradingNames || data.previousTradingNames.length === 0)) {
    return "Please provide previous trading name(s).";
  }

  if (data.vatRegistered && !data.vatNumber) {
    return "VAT registration number is required.";
  }

  if (data.requiresGoverningBodyRegistration) {
    if (!data.governingBodyDetails?.name || !data.governingBodyDetails?.registrationNumber) {
      return "Governing body name and registration number are required.";
    }
  }

  return null;
}

// ✅ PATCH: Update Company Structure section
exports.updateCompanyStructure = async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  const validationError = validateCompanyStructure(data);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const application = await SponsorshipApplication.findById(id);
    if (!application) return res.status(404).json({ error: "Application not found." });

    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    if (application.isSubmitted)
      return res.status(400).json({ error: "Application has already been submitted." });

    let structureDoc;
    if (application.companyStructure) {
      structureDoc = await CompanyStructure.findByIdAndUpdate(application.companyStructure, data, { new: true });
    } else {
      structureDoc = new CompanyStructure(data);
      await structureDoc.save();
      application.companyStructure = structureDoc._id;
    }

    await application.save();
    res.status(200).json({ message: "Company Structure section updated", companyStructure: structureDoc });
  } catch (err) {
    console.error("Company Structure Update Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
// 🔍 Validation for Getting Started
function validateGettingStarted(data) {
  if (data.hasSponsorLicense?.value === true && !data.hasSponsorLicense.licenseNumber) {
    return "Sponsor Licence number is required when license is true.";
  }

  // ❌ Prevent both current and previous licenses being true
  if (data.hasSponsorLicense?.value === true && data.hadSponsorLicenseBefore?.value === true) {
    return "You cannot currently hold a sponsor license *and* have previously held one.";
  }

  if (data.rejectedBefore?.value === true && !data.rejectedBefore.reason) {
    return "Please provide a reason for rejection.";
  }

  if (data.rejectedBefore?.value === false && data.rejectedBefore.reason?.trim()) {
    return "Reason should not be provided if not rejected before.";
  }

  // ✅ Validate recruitment agency logic
  if (data.isRecruitmentAgency?.value === true) {
    if (typeof data.isRecruitmentAgency.contractsOutToOthers !== "boolean") {
      return "Please specify whether workers are contracted out.";
    }
  } else if (data.isRecruitmentAgency) {
    if ("contractsOutToOthers" in data.isRecruitmentAgency) {
      return "contractsOutToOthers should not be set if not a recruitment agency.";
    }
  }
  return null;
}



// 🔍 Validation for About Your Company
function validateAboutYourCompany(data) {
  if (data.hasPayeReference) {
    if (!Array.isArray(data.payeReferences) || data.payeReferences.length === 0) {
      return "At least one PAYE reference is required.";
    }
  } else {
    if (!data.payeExemptReason) {
      return "PAYE exempt reason is required.";
    }
  }

  if (data.hasOtherLocations) {
    if (!Array.isArray(data.otherWorkLocations) || data.otherWorkLocations.length === 0) {
      return "Other work locations must be provided.";
    }
  }

  if (!data.sameAsRegistered && !data.tradingAddress) {
    return "Trading address is required if it's not the same as registered.";
  }

  return null;
}

exports.createSponsorshipApplication = async (req, res) => {
  try {
    const userId = req.user.id;

    // ✅ Find recruiter using correct field name
    const recruiter = await Recruiter.findOne({ userId });
    if (!recruiter) {
      return res.status(404).json({ error: "Recruiter not found" });
    }

    const existing = await SponsorshipApplication.findOne({ user: userId });
    if (existing) {
      return res.status(200).json({
        message: "Application already exists",
        application: existing,
        companyName: recruiter.companyName
      });
    }

    const application = new SponsorshipApplication({ user: userId });
    await application.save();

    res.status(201).json({
      message: "Application created",
      application,
      companyName: recruiter.companyName
    });

  } catch (err) {
    console.error("Create Sponsorship Application Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.updateGettingStarted = async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;
  console.log(data);

  const validationError = validateGettingStarted(data);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const application = await SponsorshipApplication.findById(id);

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    let section;

    // ✅ Log existing gettingStarted value for debug
    console.log("Existing gettingStarted ID:", application.gettingStarted);

    if (application.gettingStarted) {
      section = await GettingStarted.findByIdAndUpdate(
        application.gettingStarted,
        data,
        { new: true }
      );

      // ⚠️ If the ID is invalid or the doc was deleted
      if (!section) {
        console.warn("Previous GettingStarted section not found. Creating new.");
        section = new GettingStarted(data);
        await section.save();
        application.gettingStarted = section._id;
      }
    } else {
      section = new GettingStarted(data);
      await section.save();
      application.gettingStarted = section._id;
    }

    await application.save();
    res.status(200).json({ message: "Getting Started section updated", section });
  } catch (err) {
    console.error("Update Getting Started Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


// ✅ PATCH /api/sponsorship/:id/about-your-company
exports.updateAboutYourCompany = async (req, res) => {
  const { id } = req.params;
  const { data } = req.body;

  const validationError = validateAboutYourCompany(data);
  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const application = await SponsorshipApplication.findById(id);
    if (!application) return res.status(404).json({ error: "Application not found" });

    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    } if (application.isSubmitted)
      return res.status(400).json({ error: "Application has already been submitted." });


    let section;
    if (application.aboutYourCompany) {
      section = await AboutYourCompany.findByIdAndUpdate(application.aboutYourCompany, data, { new: true });
    } else {
      section = new AboutYourCompany(data);
      await section.save();
      application.aboutYourCompany = section._id;
    }

    await application.save();
    res.status(200).json({ message: "About Your Company section updated", section });
  } catch (err) {
    console.error("Update About Your Company Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ GET /api/sponsorship/:id — View whole application with sections
exports.getSponsorshipApplicationById = async (req, res) => {
  try {
    const application = await SponsorshipApplication.findById(req.params.id)
      .populate("gettingStarted")
      .populate("aboutYourCompany");

    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized access" });
    }

    res.status(200).json(application);
  } catch (err) {
    console.error("Get Sponsorship Application Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
exports.getGettingStarted = async (req, res) => {
  try {
    const application = await SponsorshipApplication.findById(req.params.id).populate("gettingStarted");

    // Step 1: Check if application exists
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }

    // Step 2: Authorization check
    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Step 3: Section check
    if (!application.gettingStarted) {
      return res.status(200).json({ message: "Getting Started section not filled yet", data: {} });
    }

    // Step 4: Return section
    return res.status(200).json(application.gettingStarted);
  } catch (err) {
    console.error("Get GettingStarted Error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


exports.getAboutYourCompany = async (req, res) => {
  const application = await SponsorshipApplication.findById(req.params.id).populate("aboutYourCompany");
  if (!application || !application.aboutYourCompany) return res.status(404).json({ error: "Not found" });
  if (application.user.toString() !== req.user.id) return res.status(403).json({ error: "Unauthorized" });
  res.json(application.aboutYourCompany);
};

exports.getCompanyStructure = async (req, res) => {
  const application = await SponsorshipApplication.findById(req.params.id).populate("companyStructure");
  if (!application || !application.companyStructure) return res.status(404).json({ error: "Not found" });
  if (application.user.toString() !== req.user.id) return res.status(403).json({ error: "Unauthorized" });
  res.json(application.companyStructure);
};

exports.getActivityAndNeeds = async (req, res) => {
  const application = await SponsorshipApplication.findById(req.params.id).populate("activityAndNeeds");
  if (!application || !application.activityAndNeeds) return res.status(404).json({ error: "Not found" });
  if (application.user.toString() !== req.user.id) return res.status(403).json({ error: "Unauthorized" });
  res.json(application.activityAndNeeds);
};

exports.getAuthorisingOfficer = async (req, res) => {
  const application = await SponsorshipApplication.findById(req.params.id).populate("authorisingOfficers");
  if (!application || !application.authorisingOfficers) return res.status(404).json({ error: "Not found" });
  if (application.user.toString() !== req.user.id) return res.status(403).json({ error: "Unauthorized" });
  res.json(application.authorisingOfficers);
};
exports.getSystemAccess = async (req, res) => {
  const { id } = req.params;

  try {
    const application = await SponsorshipApplication.findById(id).populate("level1AccessUsers");
    if (!application) return res.status(404).json({ error: "Application not found" });

    if (application.user.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    res.status(200).json({
      message: "Level 1 Access entries fetched successfully",
      level1AccessUsers: application.level1AccessUsers
    });

  } catch (err) {
    console.error("Fetch Error:", err.message);
    res.status(500).json({ error: err.message || "Internal server error" });
  }
};

exports.getSupportingDocuments = async (req, res) => {
  try {
    const supportingDocuments = await SupportingDocuments.find({ application: req.params.id });

    if (!supportingDocuments || supportingDocuments.length === 0) {
      return res.status(404).json({ error: "Not found" });
    }

    const fields = {};

    supportingDocuments.forEach(doc => {
      const docObj = doc.toObject();

      for (const key in docObj) {
        if (
          key !== "__v" &&
          key !== "_id" &&
          key !== "createdAt" &&
          key !== "updatedAt" &&
          key !== "application" &&
          docObj[key] !== null &&
          docObj[key] !== undefined &&
          !(typeof docObj[key] === "object" && Object.keys(docObj[key]).length === 0)
        ) {
          fields[key] = docObj[key];
        }
      }
    });

    res.json({
      application: req.params.id,
      fields
    });
  } catch (error) {
    console.error("Error fetching supporting documents:", error);
    res.status(500).json({ error: "Server error" });
  }
};




exports.getOrganizationSize = async (req, res) => {
  const application = await SponsorshipApplication.findById(req.params.id).populate("organizationSize");
  if (!application || !application.organizationSize) return res.status(404).json({ error: "Not found" });
  if (application.user.toString() !== req.user.id) return res.status(403).json({ error: "Unauthorized" });
  res.json(application.organizationSize);
};

exports.getDeclarations = async (req, res) => {
  const application = await SponsorshipApplication.findById(req.params.id).populate("declarations");
  if (!application || !application.declarations) return res.status(404).json({ error: "Not found" });
  if (application.user.toString() !== req.user.id) return res.status(403).json({ error: "Unauthorized" });
  res.json(application.declarations);
};
exports.getApplicationProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const application = await SponsorshipApplication.findById(id).lean();

    if (!application) return res.status(404).json({ error: "Application not found." });
    if (application.user.toString() !== req.user.id) return res.status(403).json({ error: "Unauthorized" });

    const sections = [
      "gettingStarted",
      "aboutYourCompany",
      "companyStructure",
      "activityAndNeeds",
      "organizationSize",
      "authorisingOfficers",
      "systemAccess",
      "supportingDocuments",
      "declarations"
    ];

    const completedSections = sections.filter(section => {
      if (section === "authorisingOfficers") {
        return application.authorisingOfficers?.length > 0;
      }
      return !!application[section];
    });

    const pendingSections = sections.filter(s => !completedSections.includes(s));
    const progress = Math.round((completedSections.length / sections.length) * 100);

    return res.json({
      completedSections,
      pendingSections,
      progress
    });
  } catch (err) {
    console.error("Get Progress Error:", err.message);
    return res.status(500).json({ error: "Internal server error" });
  }
};

