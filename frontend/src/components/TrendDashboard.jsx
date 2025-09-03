import React from "react";

export default function TrendDashboard() {
  return (
    <div className="border border-gray-300 rounded p-4 bg-white">
      <h3 className="font-bold text-lg mb-2">Trend Dashboard</h3>
      <p className="text-gray-500 text-sm">
        Analyze current trends and popular content.
      </p>
      <ul className="mt-2 text-gray-700 text-sm list-disc list-inside">
        <li>AI-generated videos</li>
        <li>Cooking recipes</li>
        <li>Viral memes</li>
      </ul>
    </div>
  );
}