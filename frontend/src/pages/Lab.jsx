import React, { useState } from "react";
import Header from "../components/Header";
import PromptArea from "../components/PromptArea";
import PresetButtons from "../components/PresetButtons";
import PreviewModal from "../components/PreviewModal";
import HistoryPanel from "../components/HistoryPanel";
import TrendDashboard from "../components/TrendDashboard";
import SchedulePlanner from "../components/SchedulePlanner";
import PublishPanel from "../components/PublishPanel";

export default function Lab() {
  const [prompt, setPrompt] = useState("");
  const [type, setType] = useState("Text");
  const [preview, setPreview] = useState("");
  const [history, setHistory] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleGenerate = (promptText, contentType) => {
    if (!promptText) return;

    setLoading(true);

    // Placeholder demo, replace with backend API call
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

  return (
    <div className="flex flex-col min-h-screen p-6 gap-6">
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

      <div className="flex gap-6">
        {/* Main Editor/Output area */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="border border-gray-300 rounded p-6 bg-white flex-1">
            <p className="text-gray-500">
              Your generated content will appear here.
            </p>
          </div>

          {/* Marketing Panels */}
          <div className="grid grid-cols-3 gap-6">
            <TrendDashboard />
            <SchedulePlanner />
            <PublishPanel />
          </div>
        </div>

        {/* History Panel */}
        <div className="w-64">
          <HistoryPanel history={history} handlePreviewClick={handlePreviewClick} />
        </div>
      </div>

      {/* Preview Modal */}
      <PreviewModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        preview={preview}
        type={type}
      />
    </div>
  );
}