import React, { useState } from "react";

export default function OnboardingSurvey({ onSubmit }) {
  const [companyName, setCompanyName] = useState("");
  const [companyDesc, setCompanyDesc] = useState("");
  const [country, setCountry] = useState("");
  const [logo, setLogo] = useState(null);
  const [brandColors, setBrandColors] = useState("");
  const [tone, setTone] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const surveyData = {
      companyName,
      companyDesc,
      country,
      logo,
      brandColors,
      tone,
    };
    onSubmit(surveyData); // Pass data up to parent component
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-8 rounded shadow-lg w-full max-w-xl">
        <h2 className="text-2xl font-bold mb-4">Tell us about your company</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="What does your company do?"
            value={companyDesc}
            onChange={(e) => setCompanyDesc(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setLogo(e.target.files[0])}
            className="w-full"
          />
          <input
            type="text"
            placeholder="Brand colors / style guide"
            value={brandColors}
            onChange={(e) => setBrandColors(e.target.value)}
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            placeholder="Preferred tone / voice"
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full border p-2 rounded"
          />

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            Save & Continue
          </button>
        </form>
      </div>
    </div>
  );
}