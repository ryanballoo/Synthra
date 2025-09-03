import React from "react";

export default function PublishPanel() {
  return (
    <div className="border border-gray-300 rounded p-4 bg-white">
      <h3 className="font-bold text-lg mb-2">Publish Panel</h3>
      <p className="text-gray-500 text-sm">
        Publish content directly to your social media accounts.
      </p>
      <div className="mt-2 flex flex-col gap-2">
        <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
          Publish to Twitter
        </button>
        <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
          Publish to Instagram
        </button>
        <button className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700">
          Publish to Facebook
        </button>
      </div>
    </div>
  );
}