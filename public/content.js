// Listener to handle messages sent by the popup or background script
console.log("Content script is running.");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "getOriginalText") {
    console.log("Received request for original text from popup.");

    // Locate the ChatGPT input field
    const targetElement = document.querySelector('div#prompt-textarea > p');

    if (targetElement) {
      const textContent = targetElement.textContent; // Extract the text
      console.log("Original text retrieved:", textContent);
      sendResponse({ text: textContent }); // Send the text back to the popup
    } else {
      console.error("ChatGPT input field not found.");
      sendResponse({ text: "" }); // Respond with an empty string if not found
    }
  }
  return true; // Keeps the message channel open for asynchronous responses
});

// Wait for the DOM to fully load before injecting the button
const observer = new MutationObserver((mutations) => {
  const composerBackground = document.querySelector('div#composer-background');
  const existingButtonsContainer = composerBackground ? composerBackground.querySelector('.flex.h-\\[44px\\].items-center.justify-between') : null;

  if (existingButtonsContainer) {
    observer.disconnect();

    const externalContainer = document.createElement('div');
    externalContainer.style.position = 'relative';
    externalContainer.style.zIndex = '9999';
    externalContainer.style.order = '2';

    const refineButton = document.createElement("button");
    refineButton.textContent = "Refine";
    refineButton.style.padding = "10px 15px";
    refineButton.style.backgroundColor = "#4CAF50";
    refineButton.style.color = "white";
    refineButton.style.border = "none";
    refineButton.style.borderRadius = "5px";
    refineButton.style.cursor = "pointer";
    refineButton.addEventListener("click", () => {
      const targetElement = document.querySelector('div#prompt-textarea > p');
      if (targetElement) {
        const textContent = targetElement.textContent;
        if (!textContent.trim()) {
          alert("No text to refine!");
          return;
        }
        chrome.runtime.sendMessage({ action: "refineText", text: textContent }, (response) => {
          if (chrome.runtime.lastError) {
            console.error("Error sending message:", chrome.runtime.lastError.message);
          } else if (response && response.refinedText) {
            console.log("Refined text received:", response.refinedText);
            targetElement.textContent = response.refinedText;
          }
        });
      } else {
        console.error("Input field not found when Refine button clicked.");
      }
    });
    externalContainer.appendChild(refineButton);
    existingButtonsContainer.appendChild(externalContainer);
  }
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
});

if (chrome && chrome.runtime) {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "getOriginalText") {
      console.log("Received request for original text from popup.");
      const targetElement = document.querySelector('div#prompt-textarea > p');
      if (targetElement) {
        const textContent = targetElement.textContent;
        console.log("Original text retrieved:", textContent);
        sendResponse({ text: textContent });
      } else {
        console.error("ChatGPT input field not found.");
        sendResponse({ text: "" });
      }
    }
    return true;
  });
}
