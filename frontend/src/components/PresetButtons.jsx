import React from 'react';

const presets = [
  { text: "Create the latest trendy Bigfoot AI video", type: "Video" },
  { text: "Feeling like a chef? Generate a cooking recipe video", type: "Text" },
  { text: "Generate a motivational blog post", type: "Text" },
  { text: "Create a stunning AI landscape image", type: "Image" },
];

export default function PresetButtons({ handlePresetClick }) {
  return (
    <div className="flex gap-4 overflow-x-auto mb-6">
      {presets.map((preset, idx) => (
        <button
          key={idx}
          className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 flex-shrink-0"
          onClick={() => handlePresetClick(preset)}
        >
          {preset.text}
        </button>
      ))}
    </div>
  );
}
