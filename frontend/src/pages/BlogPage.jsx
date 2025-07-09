import React from "react";

const UKBlogPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 text-gray-800">
      <h1 className="text-4xl font-bold mb-4">What Is a UK Sponsorship License?</h1>
      <h2 className="text-xl font-semibold mb-6 text-gray-600">
        A Guide for Employers and International Candidates
      </h2>

      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <p className="mb-4">
          Hiring international talent is an essential option for UK businesses in certain industries. But at the heart of that process is one critical piece of the puzzle: the UK Sponsorship License.
        </p>
        <p>
          In this guide, we break down what a sponsorship license is, why it matters, and what both employers and candidates need to know to navigate the system confidently.
        </p>
      </div>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-2">🔍 What Is a Sponsorship License?</h3>
        <p className="mb-4">
          A Sponsorship License is official permission from the UK Home Office that allows a company to legally employ non-UK residents under certain visa categories — most commonly, the Skilled Worker visa.
        </p>
        <p className="mb-4">
          Once approved, the employer becomes a “licensed sponsor” and can issue Certificates of Sponsorship (CoS) to eligible foreign workers, enabling them to apply for a work visa.
        </p>
        <div className="bg-gray-100 p-4 rounded border font-semibold">
          Key Fact: Without a sponsor license, a UK company cannot legally sponsor most foreign nationals for a work visa.
        </div>
      </section>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-2">✅ Why It Matters for Employers</h3>
        <p className="mb-4">
          For UK companies looking to access global talent, a sponsorship license is essential. But it also comes with responsibilities.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Apply with supporting documents and pay a license fee</li>
          <li>Understand and follow strict immigration compliance duties</li>
          <li>Maintain records, track employee absences, and report changes to the Home Office</li>
          <li>Prepare for potential Home Office audits</li>
        </ul>
        <p className="mt-4">
          Failure to comply with Immigration Law can have serious consequences.
        </p>
        <p>
          At <strong>SoftHire</strong>, we help businesses through every step — from applying for a license to managing day-to-day compliance.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-2">🌍 Why It Matters for Candidates</h3>
        <p className="mb-4">
          If you're an international candidate seeking to work in the UK, your path depends on finding a licensed sponsor.
        </p>
        <ul className="list-disc pl-6 space-y-2">
          <li>You must receive a Certificate of Sponsorship (CoS) before applying for a Skilled Worker visa</li>
          <li>Not all UK employers are eligible to sponsor — check the official list of licensed sponsors</li>
          <li>Your visa will be tied to that specific employer and role</li>
          <li>Changing jobs often requires switching sponsors and reapplying</li>
        </ul>
        <p className="mt-4">
          Always confirm that the company offering you a role is a licensed sponsor — and be cautious of anyone promising sponsorship without official status.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-2">🛠️ How SoftHire Supports Both Sides</h3>
        <p className="mb-4 font-semibold">For Employers:</p>
        <p>
          SoftHire makes it easy to apply for a sponsorship license, manage ongoing compliance, and recruit international candidates — all in one platform. Our AI tools handle reminders, document storage, and compliance workflows.
        </p>
        <p className="mt-4 font-semibold">For Candidates:</p>
        <p>
          We only work with verified, licensed sponsors — ensuring the roles we connect you with are legitimate, sponsored, and visa-ready. We also help you understand your visa eligibility and streamline the process.
        </p>
      </section>

      <section className="mb-8">
        <h3 className="text-2xl font-semibold mb-2">🚀 Final Thoughts</h3>
        <p className="mb-4">
          The UK’s immigration system can be complex — but it shouldn’t be a barrier to hiring great people or accessing exciting career opportunities.
        </p>
        <p className="mb-4">
          Whether you’re an employer looking to grow your team or a candidate pursuing new horizons, SoftHire is here to guide you through the process with confidence and clarity.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <a href="#employers" className="bg-blue-600 text-white px-5 py-3 rounded-xl shadow hover:bg-blue-700 text-center">
            ➡️ Employers: Start your sponsor license application
          </a>
          <a href="#candidates" className="bg-green-600 text-white px-5 py-3 rounded-xl shadow hover:bg-green-700 text-center">
            ➡️ Candidates: Explore sponsored jobs
          </a>
        </div>
      </section>
    </div>
  );
};

export default UKBlogPage;
