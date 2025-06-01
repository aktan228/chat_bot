import React from "react";
import katex from "katex";
import "katex/dist/katex.min.css";

const MathText = ({ content }) => {
  const renderFormula = (text) => {
    // Преобразует $$...$$ или \[...\] блоки и \(..\) inline
    return text.replace(/\$\$(.*?)\$\$/g, (_, expr) => {
      return katex.renderToString(expr, { displayMode: true, throwOnError: false });
    }).replace(/\\\[(.*?)\\\]/g, (_, expr) => {
      return katex.renderToString(expr, { displayMode: true, throwOnError: false });
    }).replace(/\\\((.*?)\\\)/g, (_, expr) => {
      return katex.renderToString(expr, { displayMode: false, throwOnError: false });
    });
  };

  return (
    <div
      className="prose prose-sm dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: renderFormula(content) }}
    />
  );
};

export default MathText;