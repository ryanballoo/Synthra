import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Header from "../components/Header";
import PromptArea from "../components/PromptArea";
import PresetButtons from "../components/PresetButtons";
import PreviewModal from "../components/PreviewModal";
import HistoryPanel from "../components/HistoryPanel";
import ProductScanner from "../components/ProductScanner";
import { api, getTrends, getSchedule, generateMLContent } from "../services/api";

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
  const [error, setError] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

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
    setError(null);
    
    try {
      console.log('Generating content with:', { promptText, contentType, context: surveyData });
      
      const data = await generateMLContent(promptText, contentType, surveyData);
      console.log('Generated content:', data);
      
      // Handle different content types
      let displayContent = data.generated;
      if (contentType === 'Image') {
        displayContent = `<img src="${data.generated}" alt="Generated content" style="max-width: 100%;" />`;
      }

      setPreview(displayContent);
      setHistory(prev => [{ 
        type: contentType, 
        content: displayContent,
        timestamp: new Date().toISOString()
      }, ...prev]);
      setModalOpen(true);
    } catch (err) {
      console.error("ML API error:", err);
      const errorMessage = err.message || 'Failed to generate content. Please try again.';
      setError(errorMessage);
      alert(errorMessage);
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
    if (isGuest) {
      alert("Please log in to access marketing features");
      return;
    }

    if (!surveyData.companyName) {
      alert("Please complete the company survey first");
      return;
    }

    setLoading(true);
    try {
      const surveyPayload = { ...surveyData };

      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        alert('Please log in first');
        return;
      }

      console.log('Sending request with survey data:', surveyPayload);
      
      // Fetch trends using API service
      const trendsData = await getTrends({ surveyData: surveyPayload });
      console.log('Received trends:', trendsData);
      setTrends(trendsData.trends || []);

      // Fetch schedule using API service
      const scheduleData = await getSchedule({ trends: trendsData.trends || [] });
      console.log('Received schedule:', scheduleData);
      setSchedule(scheduleData.schedule || []);
    } catch (err) {
      console.error("Marketing API error:", err);
      console.error("Response:", err.response?.data);
      setTrends([]);
      setSchedule([]);
      if (err.response?.status === 401) {
        alert("Please log in again to continue");
        // Optionally redirect to login
      } else {
        alert("Failed to fetch marketing data. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePublish = async (item) => {
    if (isGuest) return; // Guests cannot publish
    try {
      const cleanItem = Object.fromEntries(
        Object.entries(item).filter(([, value]) => value !== null && value !== undefined)
      );

      // Reuse API base and auth header
      const token = localStorage.getItem('token');
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/marketing/publish`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(cleanItem),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.detail || 'Publish failed');
      alert(data.message || 'Published');
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

      {/* Error Message */}
      {error && (
        <div className="mx-auto w-full max-w-7xl px-4 py-3 mb-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
            <button 
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError(null)}
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-6 w-6 text-red-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/>
              </svg>
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-4 items-start mb-4">
        <button
          onClick={() => setShowScanner(true)}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
        >
          📷 Scan Product
        </button>
      </div>

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

      {showScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-lg max-w-4xl w-full mx-auto relative overflow-hidden">
            <div className="absolute top-4 right-4 z-10">
              <button
                onClick={() => setShowScanner(false)}
                className="bg-white rounded-full p-2 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <h2 className="text-2xl font-bold mb-6">Scan Your Product</h2>
            
            <ProductScanner
              onProductScanned={(productData) => {
                setShowScanner(false);
                // Use product data to generate content
                handleGenerate(
                  `Create content for ${productData.name}: ${productData.features.join(', ')}`,
                  'Text'
                );
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}