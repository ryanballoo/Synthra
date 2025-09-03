import React from 'react';

export default function PreviewModal({ isOpen, onClose, preview, type }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-3xl w-full relative">
        <button
          className="absolute top-2 right-2 text-gray-700 hover:text-black"
          onClick={onClose}
        >
          ✖
        </button>

        <h3 className="text-xl font-bold mb-4">Preview</h3>

        {type === 'Text' && <p>{preview}</p>}
        {type === 'Image' && <img src={preview} alt="Generated" className="max-h-96 mx-auto" />}
        {type === 'Audio' && <audio controls src={preview} className="w-full" />}
        {type === 'Video' && <video controls src={preview} className="w-full max-h-96" />}
      </div>
    </div>
  );
}
