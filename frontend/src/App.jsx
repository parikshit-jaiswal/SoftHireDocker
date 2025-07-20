import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Pricing from "./pages/Pricing.jsx";
import Resources1 from "./pages/Blogs.jsx";
import About from "./pages/About.jsx";
import Contact from "./pages/Contact.jsx";
import Demo from "./pages/Demo.jsx";
import Resources2 from "./pages/Tools.jsx";
import Forgot from "./pages/Forgot.jsx";
import Otp from "./pages/Otp.jsx";
import Reset from "./pages/Reset.jsx";
import Dashboard from "./pages/Dashboard/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import LicenseAssessment from "./pages/LicenseAssessment.jsx";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import ScrollToTop from "./components/ScrollToTop.jsx";
import LicenseAssessmentPage from "./pages/LicenseAssessmentPage.jsx";
import SalaryCalculator from "./pages/SalaryCalculator.jsx";
import ImigrationSkillChargeCalculator from "./pages/ImigrationSkillChargeCalculatorPage.jsx";
import AssessmentResult from "./pages/AssessmentResult.jsx";
import SLCostEstimatorPage from "./pages/SLCostEstimatorPage.jsx";
import SLCostEstimator from "./pages/SLCostEstimator.jsx";
import SalaryCalculatorPage from "./pages/SalaryCalculatorPage.jsx";
import ImmigrationCalculator from "./pages/ImmigrationCalculator.jsx";
import DashboardLayout from "./components/Dashboard/DashboardLayout.jsx";
import Applied from "./pages/Dashboard/Applied.jsx";
import Messages from "./pages/Dashboard/Messages.jsx";
import Profile from "./pages/Dashboard/Profile.jsx";
import JobDetailsPage from "./pages/Dashboard/JobDetails.jsx";
import JobSearch from "./pages/Dashboard/JobSearch.jsx";
import UKBlogPage from "./pages/BlogPage.jsx";
import WhyWeBuiltSoftHire from "./pages/WhySofthire.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ResetOTP from "./pages/ResetOTP.jsx";
import RecruiterDashboardLayout from "./pages/Recruiter/RecruiterDashboardLayout.jsx";
import RecruiterHome from "./pages/Recruiter/RecruiterHome.jsx";
import RecruiterJobs from "./pages/Recruiter/RecruiterJobsLayout.jsx";
import RecruiterApplicants from "./pages/Recruiter/RecruiterApplicants.jsx";
import RecruiterDiscover from "./pages/Recruiter/RecruiterDiscover.jsx";
import RecruiterChatPage from "./pages/Recruiter/RecruiterChatPage.jsx";
import LoginPage from "./pages/Auth/LoginPage.jsx";
import CandidateSignUpPage from "./pages/Auth/CandidateSignUpPage.jsx";
import RecruiterSignUpPage from "./pages/Auth/RecruiterSignUpPage.jsx";
import RecruiterInfoPage from "./pages/Auth/RecruiterInfoPage.jsx";
import PostJob from "./components/Recruiter/Jobs/PostJob.jsx";
import RecruiterJobsLayout from "./pages/Recruiter/RecruiterJobsLayout.jsx";
import EditJob from "./components/Recruiter/Jobs/EditJob.jsx";
import JobDrafts from "./components/Recruiter/Jobs/DraftJobs.jsx";
import ActiveJobs from "./components/Recruiter/Jobs/ActiveJobs.jsx";
import ApplicantsPage from "./components/Recruiter/Applicants/ApplicantsPageLayout.jsx";
import ApplicantsPageLayout from "./components/Recruiter/Applicants/ApplicantsPageLayout.jsx";
import NeedReview from "./components/Recruiter/Applicants/NeedReview.jsx";
import SavedForLater from "./components/Recruiter/Applicants/SavedForLater.jsx";
import Rejected from "./components/Recruiter/Applicants/Rejected.jsx";
import Chat from "./unused/chat.jsx";
import ApplicantsProfile from "./components/Recruiter/Applicants/ApplicantsProfile.jsx";
import AcceptedApplicants from "./components/Recruiter/Applicants/AcceptedApplicants.jsx";
import RecruiterProtectedRoute from "./pages/RecruiterProtectedRoute.jsx";
import NotFound from "./pages/NotFound.jsx";
import SponsorshipLicenseApplicationPage from "./pages/Recruiter/SponsorshipLicenseApplicationPage.jsx";
import GettingStartedForm from "./components/Recruiter/Sponsorship/StepsForm/GettingStartedForm.jsx";
import AboutYourCompany from "./components/Recruiter/Sponsorship/StepsForm/AboutYourCompany.jsx";
import CompanyStructure from "./components/Recruiter/Sponsorship/StepsForm/CompanyStructure.jsx";
import ActivityNeeds from "./components/Recruiter/Sponsorship/StepsForm/ActivityNeeds.jsx";
import AboutYou from "./components/Recruiter/Sponsorship/StepsForm/AboutYou.jsx";
import SystemAccess from "./components/Recruiter/Sponsorship/StepsForm/SystemAccess.jsx";
import SupportingDoc from "./components/Recruiter/Sponsorship/StepsForm/SupportingDoc.jsx";
import OrganisationSize from "./components/Recruiter/Sponsorship/StepsForm/OrganisationSize.jsx";
import Declaration from "./components/Recruiter/Sponsorship/StepsForm/Declaration.jsx";
import RecruiterSponcerLicenseLayout from "./pages/Recruiter/RecruiterSponcerLicenseLayout.jsx";
import Sponsorship from "./pages/Dashboard/Service.jsx";
import Service from "./pages/Dashboard/Service.jsx";
import AboutSponcerCompliance from "./pages/AboutSponcerCompliance.jsx";
import PaymentSuccessPage from "./pages/payment/PaymentSuccessPage.jsx";
import PaymentFailedPage from "./pages/payment/PaymentFailedPage.jsx";
import RecruiterProfile from "./pages/Recruiter/RecruiterProfile.jsx";

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <>
        <Router>
          <ScrollToTop>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              hideProgressBar
            />

            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<CandidateSignUpPage />} />
              <Route path="/recruiter/signup" element={<RecruiterSignUpPage />} />
              <Route path="/recruiter/info" element={<RecruiterInfoPage />} />
              <Route path="/" element={<Home />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="/blogs" element={<Resources1 />} />
              <Route path="/tools" element={<Resources2 />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/about-sponsorship-compliance" element={<AboutSponcerCompliance />} />
              <Route path="/demo" element={<Demo />} />
              <Route path="/about" element={<About />} />
              <Route path="/forgot" element={<Forgot />} />
              <Route path="/otp" element={<Otp />} />
              <Route path="/reset" element={<Reset />} />
              <Route path="/reset-otp-verify" element={<ResetOTP />} />
              <Route path="/assessment" element={<LicenseAssessment />} />
              <Route path="/assessment/result" element={<AssessmentResult />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route
                path="/sponsor-license-assessment"
                element={<LicenseAssessmentPage />}
              />
              <Route
                path="/salary-calculator"
                element={<SalaryCalculatorPage />}
              />
              <Route
                path="/salary-calculator/calculate"
                element={<SalaryCalculator />}
              />
              <Route path="/cost-estimator" element={<SLCostEstimatorPage />} />
              <Route
                path="/cost-estimator/calculate"
                element={<SLCostEstimator />}
              />
              <Route
                path="/imigration-skill-charge-calculator"
                element={<ImigrationSkillChargeCalculator />}
              />
              <Route
                path="/immigration-skill-charge-calculator/calculate"
                element={<ImmigrationCalculator />}
              />
              <Route path="/uk-license-blog" element={<UKBlogPage />} />
              <Route
                path="/why-softhire-blog"
                element={<WhyWeBuiltSoftHire />}
              />
              <Route element={<ProtectedRoute />}>
                <Route element={<DashboardLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard/profile" element={<Profile />} />
                  <Route path="/dashboard/jobs" element={<JobSearch />} />
                  <Route path="/dashboard/messages" element={<Messages />} />
                  <Route path="/dashboard/applied" element={<Applied />} />
                  <Route path="/dashboard/home" element={<Dashboard />} />
                  <Route path="/dashboard/service" element={<Service />} />
                  <Route
                    path="/dashboard/job-details/:jobId"
                    element={<JobDetailsPage />}
                  />
                </Route>
                <Route path="/candidate/payment/:applicationId/success" element={<PaymentSuccessPage />} />
                <Route path="/candidate/payment/:applicationId/failed" element={<PaymentFailedPage />} />
              </Route>
              <Route element={<RecruiterProtectedRoute />}>
                <Route path="/recruiter" element={<RecruiterDashboardLayout />}>
                  <Route path="/recruiter" element={<RecruiterHome />} />
                  <Route path="/recruiter/jobs/new" element={<PostJob />} />
                  <Route path="/recruiter/jobs" element={<RecruiterJobsLayout />}>
                    <Route path="/recruiter/jobs" element={<ActiveJobs />} />
                    <Route path="/recruiter/jobs/drafts" element={<JobDrafts />} />
                  </Route>
                  <Route path="/recruiter/applicants" element={<RecruiterApplicants />}>
                    <Route path="/recruiter/applicants" element={<ApplicantsPageLayout />}>
                      <Route path="/recruiter/applicants/" element={<NeedReview />} />
                      <Route path="/recruiter/applicants/saved-for-later" element={<SavedForLater />} />
                      <Route path="/recruiter/applicants/rejected" element={<Rejected />} />
                      <Route path="/recruiter/applicants/accepted" element={<AcceptedApplicants />} />
                    </Route>
                  </Route>
                  <Route path="/recruiter/applicants/profile/:id" element={<ApplicantsProfile />} />
                  <Route path="/recruiter/discover" element={<RecruiterDiscover />} />
                  <Route path="/recruiter/messages" element={<RecruiterChatPage />} />
                  <Route path="/recruiter/chat" element={<RecruiterChatPage />} />
                  <Route path="/recruiter/profile" element={<RecruiterProfile />} />
                </Route>

                <Route path="/sponsorship-license-application" element={<RecruiterSponcerLicenseLayout />} >
                  <Route path="/sponsorship-license-application" element={<SponsorshipLicenseApplicationPage />} />
                  <Route path="/sponsorship-license-application/getting-started" element={<GettingStartedForm />} />
                  <Route path="/sponsorship-license-application/about-your-company" element={<AboutYourCompany />} />
                  <Route path="/sponsorship-license-application/company-structure" element={<CompanyStructure />} />
                  <Route path="/sponsorship-license-application/activity-needs" element={<ActivityNeeds />} />
                  <Route path="/sponsorship-license-application/about-you" element={<AboutYou />} />
                  <Route path="/sponsorship-license-application/system-access" element={<SystemAccess />} />
                  <Route path="/sponsorship-license-application/supporting-documents" element={<SupportingDoc />} />
                  <Route path="/sponsorship-license-application/organisation-size" element={<OrganisationSize />} />
                  <Route path="/sponsorship-license-application/declaration" element={<Declaration />} />
                </Route>

                <Route path="payment/:applicationId/success" element={<PaymentSuccessPage />} />
                <Route path="payment/:applicationId/failed" element={<PaymentFailedPage />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ScrollToTop>
        </Router>
      </>
    </GoogleOAuthProvider >
  );
}

export default App;
