import React from "react";

export default function PublishModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const handlePublish = (platform) => {
    alert(`Simulated publishing to ${platform}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
        <h3 className="text-lg font-bold mb-4">🚀 Publish Content</h3>
        <p className="mb-4">Choose a platform to publish your content:</p>
        <div className="flex gap-3">
          {["Twitter", "Instagram", "LinkedIn", "Facebook"].map((platform) => (
            <button
              key={platform}
              onClick={() => handlePublish(platform)}
              className="flex-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700"
            >
              {platform}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-4 bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
