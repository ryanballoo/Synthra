import React, { useState } from "react";
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

  // Marketing state
  const [trends, setTrends] = useState([]);
  const [schedule, setSchedule] = useState([]);

  // --- Handlers ---
  const handleSurveyChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setSurveyData((prev) => ({ ...prev, [name]: files[0] }));
    else setSurveyData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSurveySubmit = (e) => {
    e.preventDefault();
    setShowSurvey(false);
    console.log("Survey submitted:", surveyData);
  };

  // ML content generation
  const handleGenerate = async (promptText, contentType) => {
    if (!promptText) return;
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/ml/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: promptText, type: contentType }),
      });
      const data = await res.json();
      setPreview(data.generated);
      setHistory([{ type: contentType, content: data.generated }, ...history]);
      setModalOpen(true);
    } catch (err) {
      console.error("ML API error:", err);
    } finally {
      setLoading(false);
    }
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

  // Marketing analysis
  const handleMarketingAnalysis = async () => {
    if (isGuest) return; // Guests cannot access marketing features
    setLoading(true);
    try {
      const { logo, ...surveyPayload } = surveyData;

      // Fetch trends
      const trendsRes = await fetch("http://127.0.0.1:8000/api/marketing/trends", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ surveyData: surveyPayload }),
      });
      const trendsData = await trendsRes.json();
      setTrends(trendsData.trends || []);

      // Fetch schedule
      const scheduleRes = await fetch("http://127.0.0.1:8000/api/marketing/schedule", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ trends: trendsData.trends || [] }),
      });
      const scheduleData = await scheduleRes.json();
      setSchedule(scheduleData.schedule || []);
    } catch (err) {
      console.error("Marketing API error:", err);
      setTrends([]);
      setSchedule([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (item) => {
    if (isGuest) return; // Guests cannot publish
    try {
      const cleanItem = Object.fromEntries(
        Object.entries(item).filter(([_, v]) => v !== null && v !== undefined)
      );

      const res = await fetch("http://127.0.0.1:8000/api/marketing/publish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanItem),
      });
      const data = await res.json();
      alert(data.message);
    } catch (err) {
      console.error("Publish API error:", err);
    }
  };

  // --- Render ---
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
        isGuest={isGuest}
      />
      <PresetButtons handlePresetClick={handlePresetClick} />

      <div className="flex gap-6 flex-1 mt-6">
        {/* Editor / main content area */}
        <div className="flex-1 border border-gray-300 rounded p-6 bg-white">
          {history.length === 0 ? (
            <p className="text-gray-500">Your generated content will appear here.</p>
          ) : (
            <p className="text-gray-700">Click on items in history to preview them.</p>
          )}

          {/* Marketing Analysis Button */}
          <button
            onClick={handleMarketingAnalysis}
            disabled={isGuest || loading}
            className={`mt-4 px-4 py-2 rounded text-white ${
              isGuest
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            Analyze Marketing Trends & Schedule
          </button>

          {/* Trends */}
          {trends && trends.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Trending Topics</h3>
              <ul className="list-disc list-inside">
                {trends.map((trend, idx) => (
                  <li key={idx}>{trend}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Schedule */}
          {schedule && schedule.length > 0 && (
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">
                Recommended Posting Schedule
              </h3>
              <table className="w-full table-auto border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1">Day</th>
                    <th className="border px-2 py-1">Time</th>
                    <th className="border px-2 py-1">Content Type</th>
                    <th className="border px-2 py-1">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {schedule.map((item, idx) => (
                    <tr key={idx}>
                      <td className="border px-2 py-1">{item.day}</td>
                      <td className="border px-2 py-1">{item.time}</td>
                      <td className="border px-2 py-1">{item.type}</td>
                      <td className="border px-2 py-1">
                        <button
                          className={`px-2 py-1 rounded text-white ${
                            isGuest
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                          onClick={() => handlePublish(item)}
                          disabled={isGuest}
                        >
                          Publish
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* History Panel */}
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