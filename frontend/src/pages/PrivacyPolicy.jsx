import React, { useState } from 'react';

const PrivacyPolicy = () => {
    const [expanded, setExpanded] = useState({});

    const toggleSection = (section) => {
        setExpanded(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const Section = ({ title, children, id }) => {
        return (
            <div className="mb-8">
                <div
                    className="flex justify-between items-center cursor-pointer bg-gray-50 p-4 rounded-lg hover:bg-gray-100"
                    onClick={() => toggleSection(id)}
                >
                    <h2 className="text-xl font-bold text-[#011627]">{title}</h2>
                    <span className="text-[#011627]">
                        {expanded[id] ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="12" x2="6" y2="12"></line></svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                        )}
                    </span>
                </div>
                <div className={`mt-2 px-4 transition-all duration-300 ${expanded[id] ? 'block' : 'hidden'}`}>
                    {children}
                </div>
            </div>
        );
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-8 bg-white">
            <div className="text-center mb-12">
                <h1 className="text-3xl font-bold text-[#011627] mb-4">Privacy Policy</h1>
                <p className="text-gray-600">Last Updated on 31 March 2025</p>
            </div>

            <div className="mb-8 text-gray-700">
                <p className="mb-4">Our Privacy Policy outlines how we collect, use, and protect your personal information. Your privacy and security are our priorities.</p>

                <p className="mb-4">Welcome to SoftHire's privacy notice. Our intention is to create a community where knowledge sharing can be both transparent while respecting your privacy to the maximum extent. If you have any questions about this policy, including requests to exercise your legal rights, please contact us at <a href="mailto:Divyank@softhire.co.uk" className="text-blue-500 hover:underline">Divyank@softhire.co.uk</a>.</p>

                <p>We appreciate that not everyone is obsessed with privacy like us and therefore may not enjoy reading a privacy notice. For this reason, we have tried to make this short and simple. However, there is also a lot of information we are required by law to provide you with.</p>
            </div>

            <Section title="Who are we?" id="who">
                <p className="py-2">We are SoftHire LTD a limited company (with company number <strong>16321995</strong>) registered at Flat 83, 27 East Parkside, SE10 0PP, London, United Kingdom ("we", "our", "us" or "SoftHire").</p>
            </Section>

            <Section title="What data do we collect about you and when do we collect it?" id="data-collection">
                <p className="py-2">We collect personal data about you either when you use our website or products, receive any services from us, contact us, attend any events (virtually or in person), or otherwise interact with us online or in person. Unless we specify otherwise in this Privacy Policy, we collect this information from you on the basis of our legitimate interests.</p>
            </Section>

            <Section title="How Long We Keep Your Information" id="retention">
                <p className="py-2">We will retain personal data only for as long as necessary to fulfill the purposes for which it was collected, including to comply with legal, regulatory, or operational requirements. Specifically:</p>

                <ul className="list-disc pl-8 py-2">
                    <li className="mb-2"><b>Chat Logs</b>: Retained for up to 2 years. This duration allows us to process customer inquiries effectively, analyze service performance, and use anonymized data for improving our AI-powered legal tools (e.g., training large language models).</li>
                    <li><b>Documents and Related Data</b>: Retained for up to 5 years. This retention period ensures compliance with legal and regulatory requirements (e.g., audit or tax purposes) and supports anonymized training of large language models to improve the accuracy and reliability of our services.</li>
                </ul>

                <p className="py-2">After these periods, data will be securely deleted unless further retention is required by law.</p>
            </Section>

            <Section title="Use of Data for AI Model Training" id="ai-training">
                <p className="py-2">We may use anonymized or pseudonymized customer data (e.g., queries and legal documents) to improve and train our large language models (LLMs). This ensures our AI-powered tools provide accurate and effective legal assistance.</p>

                <ul className="list-disc pl-8 py-2">
                    <li className="mb-2"><b>Data Minimization</b>: Only the data necessary for training is used, and all identifiable personal information is removed where feasible.</li>
                    <li className="mb-2"><b>Purpose Limitation</b>: Data will be used solely for enhancing the functionality and accuracy of our services and not for any unrelated purposes.</li>
                    <li><b>Transparency</b>: By using our services, you acknowledge and agree that anonymized or pseudonymized data may be used for model training as outlined in this policy. You may opt out by contacting us at <a href="mailto:Divyank@SoftHire.co.uk" className="text-blue-500 hover:underline">Divyank@SoftHire.co.uk</a>.
                        <p>When you enter your details via our website, interact with us via social media, or sign up to receive our communications, we may collect information which includes your first name, maiden name, last name, username or similar identifier, marital status, title, date of birth and gender (otherwise known as "Identity Data").  We may also collect your email address, telephone number, social media handle, or address (otherwise known as "Contact Data").  We collect this information because it is in our legitimate interest to respond to your queries.</p>
                        <p>When you create an account with us and navigate our website, we may collect data which includes your username and password, your interests, preferences, feedback and survey responses (otherwise known as "Profile Data").</p>
                        <p>When you make a purchase or subscribe to paid services, we may collect your bank account details, billing address, and payment card details (otherwise known as "Financial Data") so that we can take payment from you and provide you with our Services.  We may also collect details about payments to and from you, purchases and orders made by you, and other details of products and services you have purchased from us (otherwise known as "Transaction Data").  We collect this information in order to take steps to enter into a contract with you.</p>
                        <p>So that we can provide you with marketing and communications information. Where you have previously expressed an interest in our products or services (and not opted out of marketing), we may use your Contact Data and Identity Data to provide you with information pertaining to our products as it is in our legitimate interest to promote our products and services.</p>
                        <p>Any preferences you have provided us with as to how and when we can contact you, such as your communication preferences and responses to our 'opt-ins' for data sharing with our third parties (as applicable) and your communication preferences ("Marketing Data") will also be collected by us.  We will also use this information to promote products of third parties which may be of interest to you.  You can withdraw your consent to marketing or change your preferences at any time by contacting us at <a href="mailto:Divyank@SoftHire.co.uk" className="text-blue-500 hover:underline">Divyank@SoftHire.co.uk</a>.  </p>
                        <p>When you enquire about or apply for a job with SoftHire, we may collect information about you, your career history (such as your CV), your education history, exam and assessment results and references in addition to Sensitive Data, Contact Data and Identity Data. We collect this to respond to your application, assess your suitability for the role and, if we offer you employment with us, to confirm references and complete background checks.</p>
                        <p>When you attend one of our events or a third-party event we also attend, and you have agreed for your Contact Data and Identity Data to be shared with us or it is otherwise intended for us to keep in touch (e.g. you have given one of our team your business card or contact details), we will keep you on our mailing list (unless you tell us you no longer wish to).</p>
                        <p>If we sell our business, we may use all of the above types of personal data to ensure that our business can be continued by the buyer. If you object to our use of your personal data in this way, the buyer may not be able to continue providing you with access to our products or services.</p>
                    </li>
                </ul>
            </Section>

            <Section title="What about sensitive data?" id="sensitive-data">
                <p className="py-2">Sensitive data includes things like health information, details of your ethnic origin, political views, medical information, details of your sexual orientation or identity, or religion ("Sensitive Data"). We do not need to collect this information from you, but may collect it when you apply for a job with us.</p>

                <p className="py-2">If we ever need to collect Sensitive Data from you for recruitment purposes, we will notify you first, and make sure you know why we need this from you.</p>
            </Section>

            <Section title="What about 'aggregated' data?" id="aggregated-data">
                <p className="py-2">We collect, use and share information which is statistical or demographic data which is derived from but does not include your personal data. This is often called "Aggregated Data". We may use this Aggregated Data for any purpose. If we combine or connect your Aggregated Data with other data which can be used to identify you, we use the combined Aggregated Data in accordance with this Privacy Policy.</p>
            </Section>

            <Section title="Who do we share your personal data with?" id="sharing">
                <p className="py-2">We may share your personal data with third parties where:</p>

                <ul className="list-disc pl-8 py-2">
                    <li className="mb-2">You have provided explicit consent.</li>
                    <li className="mb-2">We have a legal or regulatory obligation to do so.</li>
                    <li>It is necessary to perform our contractual obligations (e.g., sharing payment details with Stripe for processing).</li>
                </ul>

                <p className="py-2">Third-Party Tools:</p>

                <ul className="list-disc pl-8 py-2">
                    <li className="mb-2"><b>WhatsApp Business</b>: To manage customer communications.</li>
                    <li className="mb-2"><b>Stripe</b>: To process payments. Stripe's privacy policy can be accessed at their website.</li>
                    <li><b>ChatGPT</b>: For drafting and reviewing contracts. Data shared is limited to what is necessary for the service (no personal or identifiable data).</li>
                </ul>
            </Section>

            <Section title="Where we store your personal data" id="storage">
                <p className="py-2">It is sometimes necessary for us to transfer your personal data to countries outside the UK and European Economic Area ("EEA"). This may include countries which do not provide the same level of protection of personal data as the UK or EEA.</p>

                <p className="py-2">We will transfer your personal data outside the UK and EEA only where:</p>

                <ul className="list-disc pl-8 py-2">
                    <li className="mb-2">the UK government or European Commission, as applicable, has decided the recipient country ensures an adequate level of protection of personal data (known as an adequacy decision); or</li>
                    <li className="mb-2">there are appropriate safeguards in place (such as standard contractual data protection clauses published or approved by the relevant data protection regulator), together with enforceable rights and effective legal remedies for you; or</li>
                    <li>a specific exception applies under data protection law.</li>
                </ul>
                <p className="py-2">We will take all steps reasonably necessary to ensure that your data is treated securely and in accordance with this privacy notice.</p>

            </Section>

            <Section title="Security of your personal data" id="security">
                <p className="py-2">We use strict controls and security features to protect your personal data from unauthorized access. This includes:</p>

                <ul className="list-disc pl-8 py-2">
                    <li className="mb-2">Encrypting messages via WhatsApp (end-to-end encryption by default).</li>
                    <li className="mb-2">Securely storing documents shared via WhatsApp or other platforms.</li>
                    <li>Regularly reviewing and updating our data security measures.</li>
                </ul>

                <p className="py-2">While we take reasonable steps to protect your data, we cannot guarantee 100% security for all transmitted data.</p>
            </Section>

            <Section title="What about third parties referred to on our website?" id="third-parties">
                <p className="py-2">Our website may, from time to time, contain links to and from the websites of our member and associated member organisations, advertisers and affiliates. If you follow a link to any of these websites, please note that these websites have their own privacy policies and that we do not accept any responsibility or liability for these policies. Please check these policies before you submit any personal data to these websites.</p>
            </Section>

            <Section title="Use of AI Tools" id="ai-tools">
                <p className="py-2">To fulfill your requests (e.g., creating or reviewing contracts), we may use AI tools like ChatGPT. These tools are used to:</p>

                <ul className="list-disc pl-8 py-2">
                    <li className="mb-2">Draft new legal agreements based on your input.</li>
                    <li className="mb-2">Review and improve existing contracts.</li>
                    <li>Provide legally binding checklists for agreements.</li>
                </ul>

                <p className="py-2">Data Sharing with AI Tools: We minimize the data shared with AI tools and ensure it is relevant only to the service you request. Identifiable customer details are excluded unless strictly necessary. AI-generated content is always reviewed by legal experts before being provided to you.</p>
            </Section>

            <Section title="Your rights" id="rights">
                <p className="py-2">Rights to personal data can vary from country to country and you are always welcome to ask us. These may include the following:</p>

                <ul className="list-disc pl-8 py-2">
                    <li className="mb-2"><strong>Access:</strong> You have the right to request access to information we hold about you.</li>
                    <li className="mb-2"><strong>Object:</strong> You may object to our use of your personal data for any purposes which is based upon our legitimate interest as its legal basis.</li>
                    <li className="mb-2"><strong>Restrict:</strong> You can ask us to restrict our handling of your personal data.</li>
                    <li className="mb-2"><strong>Withdraw:</strong> You may withdraw your consent to any processing of your personal data at any time. Reply "STOP" on WhatsApp to stop receiving communications.</li>
                    <li className="mb-2"><strong>Rectify:</strong> You have the right to ask us to rectify any personal data held about you that is inaccurate.</li>
                    <li className="mb-2"><strong>Erase:</strong> You (but not always) have the right to request the erasure of your personal data we hold, including WhatsApp chat logs.</li>
                    <li className="mb-2"><strong>Transfer:</strong> You can ask us to transfer your personal data to a third party.</li>
                    <li><strong>Complain:</strong> In the event that you wish to make a complaint about how we process your personal data, please contact us in the first instance and we will endeavour to deal with your request as soon as possible.</li>
                </ul>

                <p className="py-2">We hope that we can resolve any query or concern you raise about our use of your personal data. You have the right to make a complaint at any time to the supervisory authority in the United Kingdom for data protection issues, the Information Commissioner's Office (ICO), whose website is at <a href="http://www.ico.org.uk/" className="text-[#011627] hover:underline">http://www.ico.org.uk/</a>. We would, however, appreciate the opportunity to deal directly with your concerns beforehand and respond to any these as your first-priority contact. Should you wish to exercise any of these rights, please contact us at <a href="mailto:Divyank@SoftHire.co.uk" className="text-[#011627] hover:underline">Divyank@SoftHire.co.uk</a>.</p>
            </Section>

            <Section title="Changes to our privacy notice" id="changes">
                <p className="py-2">Any changes we may make to the privacy notice in the future will be posted on this page. Please check this page frequently to see any updates or changes to this privacy notice.</p>
            </Section>

            <div className="mt-12 border-t pt-8 text-center text-gray-500">
                <p>© {new Date().getFullYear()} SoftHire LTD. All rights reserved.</p>
                <p className="mt-2">
                    <a href="mailto:Divyank@SoftHire.co.uk" className="text-[#011627] hover:underline">Contact Us</a>
                </p>
            </div>
        </div>
    );
};

export default PrivacyPolicy;