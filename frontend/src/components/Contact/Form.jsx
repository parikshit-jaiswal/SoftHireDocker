import React, { useState } from "react";
import { ContactFormSubmit } from "@/Api/contact";


const ContactForm = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+44",
    phoneNumber: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    // console.log("Form submitted:", formData);

    const requestBody = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      countryCode: formData.countryCode,
      phoneNumber: formData.phoneNumber,
      message: formData.message,
    };

    try {
      const data = await ContactFormSubmit(requestBody);
      setMessage("Message sent successfully! 🎉");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        countryCode: "+44",
        phoneNumber: "",
        message: "",
      });
    } catch (error) {
      setMessage(
        `Error: ${error.response?.data?.message || "Something went wrong"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-2 grid-cols-1 gap-8">
        {/* Left Column - Contact Information */}
        <div className="align-middle md:space-y-10">
          {/* <div className="mb-6 ">
            <h3 className="font-bold text-3xl mb-2">Call Us</h3>
            <p className="text-gray-800 mb-2">
              Call our team Mon-Fri from 8am to 5pm
            </p>
            <p className="font-bold text-xl flex items-center gap-2">
              <img src="Contact/Frame.svg" alt="phone icon" />
              +123-456-7890
            </p>
          </div> */}

          <div className="mb-6 ">
            <h3 className="font-bold text-3xl mb-2">Info</h3>
            <p className=" text-xl flex-col items-center space-y-2">
              <p>Company Name: <b>Softhire</b></p>
              <p>Domain: <b>softhire.co.uk</b></p>
              {/* <img src="Contact/Frame.svg" alt="phone icon" />
              +123-456-7890 */}
            </p>
          </div>

          <div className="mb-6 ">
            <h3 className="font-bold text-3xl mb-2">Email us</h3>
            <p className="text-gray-800 mb-2">Speak to our friendly team</p>
            <p className="font-bold text-xl flex items-center gap-2">
              <img src="Contact/frame1.svg" alt="email icon" />
              Divyank@softhire.co.uk
            </p>
          </div>

          <div className="">
            <h3 className="font-bold text-3xl mb-2">Visit us</h3>
            <p className="text-gray-800 mb-2">Speak to our friendly team</p>
            <p className="font-bold text-xl flex items-center gap-2">
              <img src="Contact/frame2.svg" alt="location icon" />
              27 East Parkside SE100 PP London
            </p>
          </div>
        </div>

        {/* Right Column - Form */}
        <div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="firstName" className="font-bold text-2xl">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label htmlFor="lastName" className="font-bold text-2xl">
                  Last Name
                </label>
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="font-bold text-2xl">
                  Your Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="mb-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="phoneNumber" className="font-bold text-2xl">
                  Phone Number
                </label>
                <div className="flex">
                  <select
                    className="p-2 border rounded-l bg-white text-gray-700"
                    value={formData.countryCode || "+91"}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        countryCode: e.target.value,
                      }))
                    }
                  >
                    <option value="+61">+61 (AU)</option>
                    <option value="+43">+43 (AT)</option>
                    <option value="+32">+32 (BE)</option>
                    <option value="+55">+55 (BR)</option>
                    <option value="+1">+1 (CA)</option>
                    <option value="+86">+86 (CN)</option>
                    <option value="+385">+385 (HR)</option>
                    <option value="+357">+357 (CY)</option>
                    <option value="+420">+420 (CZ)</option>
                    <option value="+45">+45 (DK)</option>
                    <option value="+20">+20 (EG)</option>
                    <option value="+372">+372 (EE)</option>
                    <option value="+358">+358 (FI)</option>
                    <option value="+33">+33 (FR)</option>
                    <option value="+49">+49 (DE)</option>
                    <option value="+30">+30 (GR)</option>
                    <option value="+852">+852 (HK)</option>
                    <option value="+36">+36 (HU)</option>
                    <option value="+91">+91 (IN)</option>
                    <option value="+62">+62 (ID)</option>
                    <option value="+353">+353 (IE)</option>
                    <option value="+972">+972 (IL)</option>
                    <option value="+39">+39 (IT)</option>
                    <option value="+81">+81 (JP)</option>
                    <option value="+82">+82 (KR)</option>
                    <option value="+371">+371 (LV)</option>
                    <option value="+370">+370 (LT)</option>
                    <option value="+352">+352 (LU)</option>
                    <option value="+60">+60 (MY)</option>
                    <option value="+52">+52 (MX)</option>
                    <option value="+31">+31 (NL)</option>
                    <option value="+64">+64 (NZ)</option>
                    <option value="+234">+234 (NG)</option>
                    <option value="+47">+47 (NO)</option>
                    <option value="+92">+92 (PK)</option>
                    <option value="+507">+507 (PA)</option>
                    <option value="+51">+51 (PE)</option>
                    <option value="+63">+63 (PH)</option>
                    <option value="+48">+48 (PL)</option>
                    <option value="+351">+351 (PT)</option>
                    <option value="+40">+40 (RO)</option>
                    <option value="+7">+7 (RU)</option>
                    <option value="+966">+966 (SA)</option>
                    <option value="+65">+65 (SG)</option>
                    <option value="+27">+27 (ZA)</option>
                    <option value="+34">+34 (ES)</option>
                    <option value="+94">+94 (LK)</option>
                    <option value="+46">+46 (SE)</option>
                    <option value="+41">+41 (CH)</option>
                    <option value="+90">+90 (TR)</option>
                    <option value="+44">+44 (UK)</option>
                    <option value="+1">+1 (US)</option>
                    <option value="+380">+380 (UA)</option>
                    <option value="+84">+84 (VN)</option>

                    {/* Add more as needed */}
                  </select>
                  <input
                    id="phoneNumber"
                    type="tel"
                    name="phoneNumber"
                    placeholder="1234567890"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    className="w-full p-2 border border-l-0 rounded-r"
                  />
                </div>
              </div>
            </div>

            <div className="mb-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="font-bold text-2xl">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Leave us a message"
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-2 h-24 border rounded"
                />
              </div>
            </div>

            {message && (
              <p
                className={`mt-4 text-center font-semibold ${message.toLowerCase().includes("error")
                  ? "text-red-600"
                  : "text-green-600"
                  }`}
              >
                {message}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`${loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-[#e97368] hover:bg-[#d06258]"
                } text-white w-full font-bold py-2 px-4 rounded transition duration-200`}
            >
              {loading ? "Sending..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactForm;
