import React from "react";

export default function PromptArea({
  prompt,
  setPrompt,
  type,
  setType,
  handleGenerate,
  loading,
  isGuest,
}) {
  return (
    <div className="flex flex-col gap-4 border border-gray-300 rounded p-4 bg-white flex-1">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt here..."
        className="w-full border rounded p-2 min-h-[100px]"
      />

      <div className="flex items-center gap-4">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded p-2"
        >
          <option value="Text">Text</option>
          <option value="Email">Email</option>
          <option value="Social Media">Social Media</option>
          <option value="Blog">Blog</option>
        </select>

        <button
          onClick={() => handleGenerate(prompt, type)}
          className={`px-4 py-2 rounded text-white ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          disabled={loading || !prompt}
        >
          {loading ? "Generating..." : "Generate"}
        </button>

        {/* Guest-only warning for marketing features */}
        {isGuest && (
          <span className="ml-2 text-sm text-gray-500 italic">
            Log in for full marketing features
          </span>
        )}
      </div>
    </div>
  );
}