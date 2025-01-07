import React, { useState, useEffect } from "react";
import RefinementList from "./RefinementList";
import FullTextView from "./FullTextView";
import "./styles/App.css";

const App = () => {
  // State variables to manage the app's data and views
  const [originalText, setOriginalText] = useState(""); // Stores the text fetched from ChatGPT
  const [refinements, setRefinements] = useState([]); // Stores the refined options
  const [viewingFullText, setViewingFullText] = useState(null); // Tracks which refinement is being viewed

  // Fetch the real text dynamically when the app loads
  useEffect(() => {
    fetchOriginalText(); // Fetch the text from ChatGPT
  }, []);

  /**
   * Fetches the current text from ChatGPT's input field using `content.js`.
   */
  const fetchOriginalText = async () => {
    try {
      console.log("Fetching original text...");
  
      // Query the active tab to get its ID
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs.length > 0) {
          const activeTabId = tabs[0].id;
  
          // Send a message directly to the content script
          chrome.tabs.sendMessage(activeTabId, { action: "getOriginalText" }, (response) => {
            if (response && response.text) {
              setOriginalText(response.text); // Update state with the fetched text
              fetchRefinements(response.text); // Fetch refinements for the text
            } else {
              console.log("No text found in ChatGPT input field:", response);
            }
          });
        } else {
          console.error("No active tab found.");
        }
      });
    } catch (error) {
      console.error("Error fetching original text:", error);
    }
  };
  

  /**
   * Calls the backend API to fetch refinement options for the given text.
   * @param {string} text - The text to refine.
   */
  const fetchRefinements = async (text) => {
    try {
      const response = await fetch("http://localhost:3000/refine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });
      const data = await response.json();
      setRefinements(data.refinements); // Update state with the refinements
    } catch (error) {
      console.error("Error fetching refinements:", error);
    }
  };

  /**
   * Handles the action when the user clicks "View Full Text".
   * @param {number} index - The index of the refinement to view.
   */
  const handleViewFullText = (index) => {
    setViewingFullText(refinements[index]); // Set the selected refinement for viewing
  };

  /**
   * Handles the action when the user selects a refinement.
   * @param {number} index - The index of the refinement to select.
   */
  const handleSelectText = (index) => {
    const selectedText = refinements[index];
    // Send the selected refinement back to `content.js` to inject into ChatGPT
    chrome.runtime.sendMessage({ action: "selectText", text: selectedText });
    window.close(); // Close the popup after selecting the refinement
  };

  /**
   * Handles the action to return to the refinement list from the full-text view.
   */
  const handleBack = () => {
    setViewingFullText(null); // Clear the full-text view state
  };

  return (
    <div className="container">
      <h1>Refine Your Text</h1>
      {viewingFullText ? (
        // If a refinement is being viewed, show the FullTextView component
        <FullTextView text={viewingFullText} onBack={handleBack} onSelect={handleSelectText} />
      ) : (
        // Otherwise, show the list of refinements
        <RefinementList refinements={refinements} onView={handleViewFullText} onSelect={handleSelectText} />
      )}
      <div id="ads">
        <p>Ad Space</p>
      </div>
    </div>
  );
};

export default App;
