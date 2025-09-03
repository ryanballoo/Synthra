import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import PromptArea from "../components/PromptArea";
import PresetButtons from "../components/PresetButtons";
import PreviewModal from "../components/PreviewModal";
import HistoryPanel from "../components/HistoryPanel";

export default function Lab() {
  const location = useLocation();
  const isGuest = location.state?.guest || false;

  // Survey state
  const [showSurvey, setShowSurvey] = useState(!isGuest);
  const [surveyData, setSurveyData] = useState({
    companyName: "",
    companyDescription: "",
    country: "",
    logo: null,
    brandColors: "",
    tone: "",
  });

  // Main editor state
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState("Text");
  const [preview, setPreview] = useState("");
  const [history, setHistory] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Handle survey input changes
  const handleSurveyChange = (e) => {
    const { name, value, files } = e.target;
    if (files) {
      setSurveyData((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setSurveyData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Submit survey
  const handleSurveySubmit = (e) => {
    e.preventDefault();
    setShowSurvey(false);
    console.log("Survey submitted:", surveyData);
    // TODO: send surveyData to backend / ML module
  };

  // Generate content
  const handleGenerate = (promptText, contentType) => {
    if (!promptText) return;
    setLoading(true);

    // Placeholder: replace with real API/ML call
    setTimeout(() => {
      const generated = `Generated ${contentType}: ${promptText}`;
      setPreview(generated);
      setHistory([{ type: contentType, content: generated }, ...history]);
      setModalOpen(true);
      setLoading(false);
    }, 1000);
  };

  const handlePresetClick = (preset) => {
    setPrompt(preset.text);
    setType(preset.type);
    handleGenerate(preset.text, preset.type);
  };

  const handlePreviewClick = (item) => {
    setPreview(item.content);
    setModalOpen(true);
  };

  // Show survey if needed
  if (showSurvey) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-6">
        <h2 className="text-3xl font-bold mb-4">Tell us about your company</h2>
        <form
          className="bg-white p-6 rounded shadow-md w-full max-w-lg space-y-4"
          onSubmit={handleSurveySubmit}
        >
          <input
            name="companyName"
            placeholder="Company Name"
            className="border p-2 rounded w-full"
            value={surveyData.companyName}
            onChange={handleSurveyChange}
            required
          />
          <input
            name="companyDescription"
            placeholder="What does your company do?"
            className="border p-2 rounded w-full"
            value={surveyData.companyDescription}
            onChange={handleSurveyChange}
            required
          />
          <input
            name="country"
            placeholder="Country"
            className="border p-2 rounded w-full"
            value={surveyData.country}
            onChange={handleSurveyChange}
            required
          />
          <input
            name="logo"
            type="file"
            accept="image/*"
            onChange={handleSurveyChange}
          />
          <input
            name="brandColors"
            placeholder="Brand colors / style guide"
            className="border p-2 rounded w-full"
            value={surveyData.brandColors}
            onChange={handleSurveyChange}
          />
          <input
            name="tone"
            placeholder="Preferred tone / voice"
            className="border p-2 rounded w-full"
            value={surveyData.tone}
            onChange={handleSurveyChange}
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
          >
            Submit Survey
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-6">
      <Header />

      <PromptArea
        prompt={prompt}
        setPrompt={setPrompt}
        type={type}
        setType={setType}
        handleGenerate={handleGenerate}
        loading={loading}
      />
      <PresetButtons handlePresetClick={handlePresetClick} />

      <div className="flex gap-6 flex-1 mt-6">
        {/* Main editor/content area */}
        <div className="flex-1 border border-gray-300 rounded p-6 bg-white">
          {history.length === 0 ? (
            <p className="text-gray-500">Your generated content will appear here.</p>
          ) : (
            <p className="text-gray-700">Click on items in history to preview them.</p>
          )}
        </div>

        {/* History panel */}
        <HistoryPanel history={history} handlePreviewClick={handlePreviewClick} />
      </div>

      <PreviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        preview={preview}
        type={type}
      />
    </div>
  );
}