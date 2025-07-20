import React, { useState, useRef, useEffect } from "react";
import { Search, Plus, Check, AlertCircle } from "lucide-react";
import { jobRoles } from "@/constants/dashboard";
// import userService from "@/api/userService"; // Fixed path
import profileService from "@/Api/profileService"; // Add profileService
import { profileImageUpload } from "@/Api/profile";
import { toast } from "react-toastify";

function EditProfile() {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    primaryRole: "",
    yearsOfExperience: "",
    openToRoles: [],
    bio: "",
    socialProfiles: {
      website: "",
      linkedIn: "",
      github: "",
      twitter: "",
    },
    workExperience: [
      {
        company: "",
        title: "",
        startDate: "",
        endDate: "",
        current: false,
        description: "",
      },
    ],
    education: {
      college: "",
      graduationYear: "",
      degree: "",
      major: "",
      gpa: "",
    },
    skills: [],
    achievements: "",
    identity: {
      pronouns: "",
      genderIdentity: "",
      raceEthnicity: [],
      displayPronouns: false,
    },
  });

  // UI state
  const [currentlyWorking, setCurrentlyWorking] = useState(false);
  const [displayPronouns, setDisplayPronouns] = useState(false);
  const [raceEthnicity, setRaceEthnicity] = useState([]);
  const [skillInput, setSkillInput] = useState("");
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileUrl, setProfileUrl] = useState("/api/placeholder/56/56");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false); // Add this state

  const fileInputRef = useRef(null);

  // Load existing profile data on component mount
  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setIsLoading(true);
    try {
      // Use profileService to get current user profile
      const result = await profileService.getCurrentUserProfile();
      
      if (result.success && result.data) {
        const profile = result.data;
        
        // Populate form with existing data
        setFormData({
          name: profile.name || profile.user?.fullName || "",
          location: profile.location || "",
          primaryRole: profile.primaryRole || "",
          yearsOfExperience: profile.yearsOfExperience || "",
          openToRoles: profile.openToRoles || [],
          bio: profile.bio || "",
          socialProfiles: {
            website: profile.socialProfiles?.website || "",
            linkedIn: profile.socialProfiles?.linkedIn || "",
            github: profile.socialProfiles?.github || "",
            twitter: profile.socialProfiles?.twitter || "",
          },
          workExperience: profile.workExperience?.length > 0 ? profile.workExperience : [
            {
              company: "",
              title: "",
              startDate: "",
              endDate: "",
              current: false,
              description: "",
            },
          ],
          education: {
            college: profile.education?.college || "",
            graduationYear: profile.education?.graduationYear || "",
            degree: profile.education?.degree || "",
            major: profile.education?.major || "",
            gpa: profile.education?.gpa || "",
          },
          skills: profile.skills || [],
          achievements: profile.achievements || "",
          identity: {
            pronouns: profile.identity?.pronouns || "",
            genderIdentity: profile.identity?.genderIdentity || "",
            raceEthnicity: profile.identity?.raceEthnicity || [],
            displayPronouns: profile.identity?.displayPronouns || false,
          },
        });
        
        // Set profile image
        if (profile.profileImage) {
          setProfileUrl(profile.profileImage);
        } else if (profile.user?.avatar) {
          setProfileUrl(profile.user.avatar);
        }

        // Set UI state based on loaded data
        if (profile.workExperience?.[0]?.current) {
          setCurrentlyWorking(true);
        }
        
        if (profile.identity?.displayPronouns) {
          setDisplayPronouns(true);
        }
        
        if (profile.identity?.raceEthnicity) {
          setRaceEthnicity(profile.identity.raceEthnicity);
        }
      }
    } catch (error) {
      console.error("Failed to load profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData({
        ...formData,
        [parent]: {
          ...formData[parent],
          [child]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle work experience changes
  const handleWorkExperienceChange = (e) => {
    const { name, value } = e.target;
    const updatedWorkExperience = [...formData.workExperience];

    // Since we're only managing one work experience entry in this form
    updatedWorkExperience[0] = {
      ...updatedWorkExperience[0],
      [name]: value,
    };

    setFormData({
      ...formData,
      workExperience: updatedWorkExperience,
    });
  };

  // Handle currently working checkbox
  const handleCurrentlyWorkingChange = () => {
    const newValue = !currentlyWorking;
    setCurrentlyWorking(newValue);

    const updatedWorkExperience = [...formData.workExperience];
    updatedWorkExperience[0] = {
      ...updatedWorkExperience[0],
      current: newValue,
      endDate: newValue ? "" : updatedWorkExperience[0].endDate,
    };

    setFormData({
      ...formData,
      workExperience: updatedWorkExperience,
    });
  };

  // Handle social profiles changes
  const handleSocialProfileChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      socialProfiles: {
        ...formData.socialProfiles,
        [name]: value,
      },
    });
  };

  // Handle race/ethnicity changes
  const handleRaceEthnicityChange = (value) => {
    let updatedRaceEthnicity;

    if (raceEthnicity.includes(value)) {
      updatedRaceEthnicity = raceEthnicity.filter((item) => item !== value);
    } else {
      updatedRaceEthnicity = [...raceEthnicity, value];
    }

    setRaceEthnicity(updatedRaceEthnicity);

    setFormData({
      ...formData,
      identity: {
        ...formData.identity,
        raceEthnicity: updatedRaceEthnicity,
      },
    });
  };

  // Handle pronouns display toggle
  const handleDisplayPronounsChange = () => {
    const newValue = !displayPronouns;
    setDisplayPronouns(newValue);

    setFormData({
      ...formData,
      identity: {
        ...formData.identity,
        displayPronouns: newValue,
      },
    });
  };

  // Handle skills input
  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, skillInput.trim()],
      });
      setSkillInput("");
    }
  };

  // Handle skill input on enter key
  const handleSkillInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  // Remove a skill
  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter((skill) => skill !== skillToRemove),
    });
  };

  // Handle open to roles selection
  const handleOpenToRolesChange = (e) => {
    const role = e.target.value;
    if (role && !formData.openToRoles.includes(role)) {
      setFormData({
        ...formData,
        openToRoles: [...formData.openToRoles, role],
      });
    }
  };

  // Education field changes
  const handleEducationChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      education: {
        ...formData.education,
        [name]: value,
      },
    });
  };

  const handleProfileImage = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";

    input.onchange = async (event) => {
      const file = event.target.files[0];
      if (!file) {
        return;
      }

      // Check for webp file type
      if (file.type === "image/webp" || file.name.toLowerCase().endsWith(".webp")) {
        toast.error("WebP images are not supported. Please upload a JPG or PNG image.");
        return;
      }

      setIsUploadingImage(true); // Start loader
      try {
        // Use profileService for upload
        const result = await profileService.uploadProfileImage(file);
        if (result.success && result.data?.image?.imageUrl) {
          setProfileUrl(result.data.image.imageUrl);
        } else {
          toast.error(result.message || "Failed to upload image.");
          console.error("Upload failed:", result.message || result.error);
        }
      } catch (error) {
        toast.error("Failed to upload image.");
        console.error("Upload failed:", error);
      } finally {
        setIsUploadingImage(false); // End loader
      }
    };

    input.click();
  };

  // Submit the form to the API
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setIsSubmitting(true);

      // Prepare form data for API submission
      const profileData = {
        name: formData.name,
        location: formData.location,
        primaryRole: formData.primaryRole,
        yearsOfExperience: formData.yearsOfExperience,
        openToRoles: formData.openToRoles,
        bio: formData.bio,
        socialProfiles: formData.socialProfiles,
        workExperience: formData.workExperience,
        education: formData.education,
        skills: formData.skills,
        achievements: formData.achievements,
        identity: formData.identity,
      };

      // Use profileService to update
      const result = await profileService.updateCurrentUserProfile(profileData);

      if (result.success) {
        setFormStatus({
          submitted: true,
          error: false,
          message: result.message || "Profile successfully updated!",
        });
      } else {
        throw new Error(result.message || "Failed to update profile");
      }

      // Scroll to top to show message
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error("Edit Profile Error:", error);

      setFormStatus({
        submitted: false,
        error: true,
        message: error.message || "Failed to update profile. Please try again.",
      });

      // Scroll to top to show error
      window.scrollTo({ top: 0, behavior: "smooth" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white px-4 py-8 border border-gray-300 rounded-lg shadow-md">
      <div className="max-w-5xl mx-auto w-full">
        {formStatus.submitted && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center text-green-700">
            <Check className="mr-2" size={18} />
            {formStatus.message}
          </div>
        )}

        {formStatus.error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
            <AlertCircle className="mr-2" size={18} />
            {formStatus.message}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-3">About</h2>
              <p className="text-sm text-gray-600">
                Tell us about yourself so that companies know about who you are
              </p>
            </div>
            <div className="flex-1 space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Your Name<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="e.g. Jenna Doe"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {isUploadingImage ? (
                    <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <img
                      src={profileUrl}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                <button
                  type="button"
                  className="border rounded-lg px-4 py-2 text-sm hover:bg-gray-100"
                  onClick={handleProfileImage}
                  disabled={isUploadingImage}
                >
                  {isUploadingImage ? "Uploading..." : "Upload a new photo"}
                </button>

                {/* Hidden file input */}
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const imageUrl = URL.createObjectURL(file);
                      setFormData((prev) => ({
                        ...prev,
                        profilePhoto: imageUrl,
                      }));
                    }
                  }}
                />
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Where are you based<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search size={16} />
                  </div>
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., Manchester"
                    className="w-full border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block mb-2 text-sm font-medium">
                    Select your primary role
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="primaryRole"
                    value={formData.primaryRole}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select role</option>
                    {jobRoles.map((role, index) => (
                      <option key={index} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block mb-2 text-sm font-medium">
                    Years of experience<span className="text-red-500">*</span>
                  </label>
                  <select
                    name="yearsOfExperience"
                    value={formData.yearsOfExperience}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select years</option>
                    <option value="0-1 year">0-1 year</option>
                    <option value="1-2 years">1-2 years</option>
                    <option value="2-3 years">2-3 years</option>
                    <option value="3-5 years">3-5 years</option>
                    <option value="5-10 years">5-10 years</option>
                    <option value="10+ years">10+ years</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Open to the following roles
                  <span className="text-red-500">*</span>
                </label>
                <select
                  onChange={handleOpenToRolesChange}
                  className="w-full border rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select roles you're open to</option>
                  {jobRoles
                    .filter((role) => !formData.openToRoles.includes(role))
                    .map((role, index) => (
                      <option key={index} value={role}>
                        {role}
                      </option>
                    ))}
                </select>

                {formData.openToRoles.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.openToRoles.map((role, index) => (
                      <div
                        key={index}
                        className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded flex items-center"
                      >
                        {role}
                        <button
                          type="button"
                          className="ml-1 text-blue-600 hover:text-blue-800"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              openToRoles: formData.openToRoles.filter(
                                (r) => r !== role
                              ),
                            });
                          }}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Your Bio<span className="text-red-500">*</span>
                </label>
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Write a short intro about yourself and your work"
                  className="w-full border rounded-lg px-3 py-2 text-sm h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <hr className="my-12 border-gray-300" />

          {/* Social Profiles */}
          <div className="flex flex-col md:flex-row gap-8 mb-12">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-3">Social Profiles</h2>
              <p className="text-sm text-gray-600">
                Where can people find you online?
              </p>
            </div>
            <div className="flex-1 space-y-6">
              {["website", "linkedIn", "github", "twitter"].map((field) => (
                <div key={field}>
                  <label className="block mb-2 text-sm font-medium">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type="text"
                    name={field}
                    value={formData.socialProfiles[field]}
                    onChange={handleSocialProfileChange}
                    placeholder={`https://${field.toLowerCase()}.com/`}
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <hr className="my-12 border-gray-300" />

          {/* Work Experience */}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <h2 className="text-xl font-semibold mb-3">
                Your work experience
              </h2>
              <p className="text-sm text-gray-600">
                What other positions have you held?
              </p>
            </div>
            <div className="flex-1 space-y-6">
              <div>
                <label className="block mb-2 text-sm font-medium">
                  Company<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Search size={16} />
                  </div>
                  <input
                    type="text"
                    name="company"
                    value={formData.workExperience[0].company}
                    onChange={handleWorkExperienceChange}
                    placeholder="Type to Search"
                    className="w-full border rounded-lg pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Title<span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.workExperience[0].title}
                  onChange={handleWorkExperienceChange}
                  placeholder="e.g., Junior Frontend Developer"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block mb-2 text-sm font-medium">
                    Start date<span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="startDate"
                    value={formData.workExperience[0].startDate}
                    onChange={handleWorkExperienceChange}
                    placeholder="MM/YYYY"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block mb-2 text-sm font-medium">
                    End date
                    {!currentlyWorking && (
                      <span className="text-red-500">*</span>
                    )}
                  </label>
                  <input
                    type="text"
                    name="endDate"
                    value={formData.workExperience[0].endDate}
                    onChange={handleWorkExperienceChange}
                    placeholder="MM/YYYY"
                    className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    disabled={currentlyWorking}
                  />
                </div>
              </div>

              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  id="currently-working"
                  checked={currentlyWorking}
                  onChange={handleCurrentlyWorkingChange}
                  className="mr-2 accent-blue-500"
                />
                <label htmlFor="currently-working" className="text-sm">
                  I currently work here
                </label>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.workExperience[0].description}
                  onChange={handleWorkExperienceChange}
                  placeholder="Briefly describe your responsibilities and achievements"
                  className="w-full border rounded-lg px-3 py-2 text-sm h-24 focus:outline-none focus:ring-2 focus:ring-blue-500"
                ></textarea>
              </div>
            </div>
          </div>

          <hr className="my-12 border-gray-300" />

          {/* Education Section */}
          <div className="flex gap-8 mb-8">
            <div className="flex-1">
              <h2 className="font-semibold mb-2">Education</h2>
              <p className="text-sm text-gray-500">
                What schools have you studied at?
              </p>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Education<span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                    <Search size={16} />
                  </div>
                  <input
                    type="text"
                    name="college"
                    value={formData.education.college}
                    onChange={handleEducationChange}
                    placeholder="College/University"
                    className="w-full border rounded p-2 pl-8 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">
                  Graduation
                </label>
                <input
                  type="text"
                  name="graduationYear"
                  value={formData.education.graduationYear}
                  onChange={handleEducationChange}
                  placeholder="e.g., 2026"
                  className="w-full border rounded p-2 text-sm"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">Degree</label>
                <select
                  name="degree"
                  value={formData.education.degree}
                  onChange={handleEducationChange}
                  className="w-full border rounded p-2 text-sm bg-white"
                >
                  <option value="">Degree type</option>
                  <option value="B.Tech">B.Tech</option>
                  <option value="B.Sc">B.Sc</option>
                  <option value="B.A">B.A</option>
                  <option value="M.Tech">M.Tech</option>
                  <option value="M.Sc">M.Sc</option>
                  <option value="MBA">MBA</option>
                  <option value="Ph.D">Ph.D</option>
                </select>
              </div>

              <div>
                <input
                  type="text"
                  name="major"
                  value={formData.education.major}
                  onChange={handleEducationChange}
                  placeholder="Major/Field of Study"
                  className="w-full border rounded p-2 text-sm"
                />
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">GPA</label>
                <input
                  type="text"
                  name="gpa"
                  value={formData.education.gpa}
                  onChange={handleEducationChange}
                  placeholder="Enter your GPA"
                  className="w-full border rounded p-2 text-sm"
                />
              </div>
            </div>
          </div>

          <hr className="my-12 border-gray-300" />

          {/* Skills Section */}
          <div className="flex gap-8 mb-8">
            <div className="flex-1">
              <h2 className="font-semibold mb-2">Your Skills</h2>
              <p className="text-sm text-gray-500">
                This will help startups hone in on your strengths.
              </p>
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">
                Add your Skills
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-2 pointer-events-none">
                  <Search size={16} />
                </div>
                <input
                  type="text"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillInputKeyDown}
                  placeholder="e.g., Python, Figma, SQL"
                  className="w-full border rounded p-2 pl-8 text-sm"
                />
              </div>
              <div className="mt-2">
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="text-sm text-blue-600 hover:text-blue-800"
                >
                  + Add Skill
                </button>
              </div>

              {formData.skills.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {formData.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded flex items-center"
                    >
                      {skill}
                      <button
                        type="button"
                        className="ml-1 text-blue-600 hover:text-blue-800"
                        onClick={() => handleRemoveSkill(skill)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <hr className="my-12 border-gray-300" />

          {/* Achievements Section */}
          <div className="flex gap-8 mb-8">
            <div className="flex-1">
              <h2 className="font-semibold mb-2">Achievements</h2>
              <p className="text-sm text-gray-500">
                Sharing more details about yourself will help you stand out
                more.
              </p>
            </div>
            <div className="flex-1">
              <label className="block mb-1 text-sm font-medium">
                Add your Achievements
              </label>
              <textarea
                name="achievements"
                value={formData.achievements}
                onChange={handleChange}
                placeholder="Mention any awards, scholarships, or key recognitions"
                className="w-full border rounded p-2 text-sm h-24"
              ></textarea>
            </div>
          </div>

          <hr className="my-12 border-gray-300" />

          {/* Identity Section */}
          <div className="flex gap-8 mb-8">
            <div className="flex-1">
              <h2 className="font-semibold mb-2">Identity</h2>
              <p className="text-sm text-gray-500">
                At SoftHire, we're committed to fostering inclusive hiring. You
                can choose to share demographic info to help companies build
                diverse teams — it's completely optional and kept confidential.
                Your gender and ethnicity won't influence job matching and are
                only shown if you opt in.
              </p>
            </div>
            <div className="flex-1 space-y-4">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Pronouns
                </label>
                <select
                  name="pronouns"
                  value={formData.identity.pronouns}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      identity: {
                        ...formData.identity,
                        pronouns: e.target.value,
                      },
                    });
                  }}
                  className="w-full border rounded p-2 text-sm bg-white"
                >
                  <option value="">Select pronouns</option>
                  <option value="he/him">He/Him</option>
                  <option value="she/her">She/Her</option>
                  <option value="they/them">They/Them</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="display-pronouns"
                  checked={displayPronouns}
                  onChange={handleDisplayPronounsChange}
                  className="mr-2"
                />
                <label htmlFor="display-pronouns" className="text-sm">
                  Display pronouns on my profile
                </label>
              </div>

              <div>
                <label className="block mb-1 text-sm font-medium">
                  Gender Identity
                </label>
                <select
                  name="genderIdentity"
                  value={formData.identity.genderIdentity}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      identity: {
                        ...formData.identity,
                        genderIdentity: e.target.value,
                      },
                    });
                  }}
                  className="w-full border rounded p-2 text-sm bg-white"
                >
                  <option value="">Select gender identity</option>
                  <option value="Man">Man</option>
                  <option value="Woman">Woman</option>
                  <option value="Non-binary">Non-binary</option>
                  <option value="Prefer not to say">Prefer not to say</option>
                  <option value="Self-describe">Self-describe</option>
                </select>
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">
                  Race Ethnicity
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="black-african-american"
                      checked={raceEthnicity.includes("Black/African-American")}
                      onChange={() =>
                        handleRaceEthnicityChange("Black/African-American")
                      }
                      className="mr-2"
                    />
                    <label htmlFor="black-african-american" className="text-sm">
                      Black/African-American
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="east-asian"
                      checked={raceEthnicity.includes("East Asian")}
                      onChange={() => handleRaceEthnicityChange("East Asian")}
                      className="mr-2"
                    />
                    <label htmlFor="east-asian" className="text-sm">
                      East Asian (including Chinese, Japanese, Korean, and
                      Mongolian)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="hispanic-latino"
                      checked={raceEthnicity.includes("Hispanic or Latino/a/x")}
                      onChange={() =>
                        handleRaceEthnicityChange("Hispanic or Latino/a/x")
                      }
                      className="mr-2"
                    />
                    <label htmlFor="hispanic-latino" className="text-sm">
                      Hispanic or Latino/a/x
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="middle-eastern"
                      checked={raceEthnicity.includes("Middle Eastern")}
                      onChange={() =>
                        handleRaceEthnicityChange("Middle Eastern")
                      }
                      className="mr-2"
                    />
                    <label htmlFor="middle-eastern" className="text-sm">
                      Middle Eastern
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="native-american"
                      checked={raceEthnicity.includes(
                        "Native American or Alaskan Native"
                      )}
                      onChange={() =>
                        handleRaceEthnicityChange(
                          "Native American or Alaskan Native"
                        )
                      }
                      className="mr-2"
                    />
                    <label htmlFor="native-american" className="text-sm">
                      Native American or Alaskan Native
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="pacific-islander"
                      checked={raceEthnicity.includes("Pacific Islander")}
                      onChange={() =>
                        handleRaceEthnicityChange("Pacific Islander")
                      }
                      className="mr-2"
                    />
                    <label htmlFor="pacific-islander" className="text-sm">
                      Pacific Islander
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="south-asian"
                      checked={raceEthnicity.includes("South Asian")}
                      onChange={() => handleRaceEthnicityChange("South Asian")}
                      className="mr-2"
                    />
                    <label htmlFor="south-asian" className="text-sm">
                      South Asian (including Bangladeshi, Bhutanese, Indian,
                      Nepali, Pakistani, and Sri Lankan)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="southeast-asian"
                      checked={raceEthnicity.includes("Southeast Asian")}
                      onChange={() =>
                        handleRaceEthnicityChange("Southeast Asian")
                      }
                      className="mr-2"
                    />
                    <label htmlFor="southeast-asian" className="text-sm">
                      Southeast Asian (including Burmese, Cambodian, Filipino,
                      Hmong, Indonesian, Laotian, Malaysian, Mien, Singaporean,
                      Thai, and Vietnamese)
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="white"
                      checked={raceEthnicity.includes("White")}
                      onChange={() => handleRaceEthnicityChange("White")}
                      className="mr-2"
                    />
                    <label htmlFor="white" className="text-sm">
                      White
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="prefer-not-to-say"
                      checked={raceEthnicity.includes("Prefer not to say")}
                      onChange={() =>
                        handleRaceEthnicityChange("Prefer not to say")
                      }
                      className="mr-2"
                    />
                    <label htmlFor="prefer-not-to-say" className="text-sm">
                      Prefer not to say
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="self-describe"
                      checked={raceEthnicity.includes("Self-describe")}
                      onChange={() =>
                        handleRaceEthnicityChange("Self-describe")
                      }
                      className="mr-2"
                    />
                    <label htmlFor="self-describe" className="text-sm">
                      Self-describe
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 flex justify-end">
            <div className="flex gap-4">
              <button
                type="button"
                className="px-6 py-3 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className={`px-6 py-3 rounded-lg bg-blue-600 text-white font-medium ${
                  isSubmitting
                    ? "opacity-70 cursor-not-allowed"
                    : "hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProfile;
