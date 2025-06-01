import React from "react";

const topics = ["Mathematics", "History", "Programming", "Economics"];

const TopicSelector = ({ selectedTopic, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-3 justify-center mt-4">
      {topics.map((topic) => (
        <button
          key={topic}
          className={`px-4 py-2 rounded-lg border transition ${
            selectedTopic === topic
              ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white"
              : "bg-white text-black border-gray-300 hover:bg-gray-100 dark:bg-black dark:text-white dark:border-gray-700 dark:hover:bg-gray-800"
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
