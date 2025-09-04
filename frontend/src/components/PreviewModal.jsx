import React from 'react';

export default function PreviewModal({ isOpen, onClose, preview, type }) {
  if (!isOpen) return null;

  const renderContent = () => {
    if (type === 'Image') {
      return <img src={preview} alt="Generated content" className="max-h-[60vh] mx-auto rounded shadow-lg" />;
    }

    // For all other content types, check if it's HTML content
    if (typeof preview === 'string' && preview.includes('<img')) {
      return <div dangerouslySetInnerHTML={{ __html: preview }} />;
    }

    // Text content with formatting
    return (
      <div className="prose max-w-none">
        {preview.split('\n').map((line, i) => (
          <p key={i} className="mb-2">{line}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
        <button
          className="absolute top-3 right-3 text-gray-600 hover:text-black bg-white rounded-full w-8 h-8 flex items-center justify-center shadow-md"
          onClick={onClose}
          aria-label="Close"
        >
          ✖
        </button>

        <div className="mb-4 flex items-center gap-2">
          <h3 className="text-xl font-bold">Generated {type}</h3>
          {type === 'Image' && (
            <button 
              className="text-blue-600 text-sm hover:underline"
              onClick={() => window.open(preview, '_blank')}
            >
              Open in new tab
            </button>
          )}
        </div>

        <div className="mt-4">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
