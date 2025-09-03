import React from 'react';

export default function HistoryPanel({ history, handlePreviewClick }) {
  return (
    <div className="w-64 border border-gray-300 rounded p-4 bg-gray-50 overflow-y-auto">
      <h3 className="font-bold text-lg mb-4">Generated Content History</h3>
      {history.length === 0 && <p className="text-gray-500">No content yet</p>}
      <ul className="space-y-2">
        {history.map((item, index) => (
          <li
            key={index}
            className="border p-2 rounded cursor-pointer hover:bg-gray-100 truncate"
            onClick={() => handlePreviewClick(item)}
          >
            <span className="font-semibold">{item.type}: </span>
            <span className="truncate block">{item.content}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}