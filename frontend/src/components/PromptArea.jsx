import React from 'react';

export default function PromptArea({ prompt, setPrompt, type, setType, handleGenerate, loading }) {
  return (
    <div className="flex flex-col gap-4 mb-6">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Enter your prompt here..."
        className="border p-3 rounded h-32 resize-none"
      />

      <div className="flex gap-4 items-center">
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border rounded p-2"
        >
          <option value="Text">Text</option>
          <option value="Image">Image</option>
          <option value="Audio">Audio</option>
          <option value="Video">Video</option>
        </select>

        <button
          onClick={() => handleGenerate(prompt, type)}
          disabled={loading || !prompt}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Generating...' : 'Generate'}
        </button>
      </div>
    </div>
  );
}
