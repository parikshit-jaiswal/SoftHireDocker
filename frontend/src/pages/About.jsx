import EvidenceOfExcellence from "@/components/About/banner";
import FeatureSection from "@/components/About/Features";
import Header from "@/components/About/Header";
import TeamSection from "@/components/About/Team";
import Footer from "@/components/Footer";
import FeedbackSection from "@/components/Home/FeedbackSection";
import Navbar from "@/components/Navbar";
import React from "react";

const About = () => {
  return (
    <div>
      <Navbar />
      <Header />
      <EvidenceOfExcellence />
      <FeatureSection />
      {/* <TeamSection /> */}
      {/* <FeedbackSection /> */}
      <Footer />
    </div>
  );
};

export default About;
