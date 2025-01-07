import React from "react";

const FullTextView = ({ text, onBack, onSelect }) => {
  return (
    <div>
      <button onClick={onBack}>← Back</button>
      <div className="full-text">
        <p>{text}</p>
      </div>
      <button onClick={onSelect}>Select</button>
    </div>
  );
};

export default FullTextView;
