import React from "react";

export default function HistoryPanel({ history, handlePreviewClick }) {
  return (
    <div className="w-64 border border-gray-300 rounded p-4 bg-gray-50 flex-shrink-0 overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">History</h3>
      {history.length === 0 ? (
        <p className="text-gray-500">No history yet.</p>
      ) : (
        <ul className="space-y-2">
          {history.map((item, idx) => (
            <li
              key={idx}
              onClick={() => handlePreviewClick(item)}
              className={`p-2 rounded cursor-pointer border ${
                item.guest
                  ? "bg-yellow-100 border-yellow-300 hover:bg-yellow-200"
                  : "bg-white border-gray-200 hover:bg-gray-100"
              }`}
            >
              <span className="font-medium">{item.type}</span>
              {item.guest && (
                <span className="ml-2 text-xs text-yellow-700 italic">(Guest)</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}