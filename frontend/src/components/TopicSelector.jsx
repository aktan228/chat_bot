import React from "react";

const topics = ["Mathematic", "History", "Programming", "Economic"];

const TopicSelector = ({ selectedTopic, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center mt-4">
      {topics.map((topic) => (
        <button
          key={topic}
          className={`px-4 py-2 rounded-lg border transition ${
            selectedTopic === topic
              ? "bg-blue-600 text-white"
              : "bg-white text-gray-800 hover:bg-blue-100"
          }`}
          onClick={() => onSelect(topic)}
        >
          {topic}
        </button>
      ))}
    </div>
  );
};

export default TopicSelector;
