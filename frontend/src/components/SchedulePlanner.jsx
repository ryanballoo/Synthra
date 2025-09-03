import React from "react";

export default function SchedulePlanner() {
  return (
    <div className="border border-gray-300 rounded p-4 bg-white">
      <h3 className="font-bold text-lg mb-2">Schedule Planner</h3>
      <p className="text-gray-500 text-sm">
        Plan your content posting schedule.
      </p>
      <ul className="mt-2 text-gray-700 text-sm list-disc list-inside">
        <li>Monday 10:00 AM – AI Video</li>
        <li>Wednesday 2:00 PM – Recipe Post</li>
        <li>Friday 6:00 PM – Meme Content</li>
      </ul>
    </div>
  );
}