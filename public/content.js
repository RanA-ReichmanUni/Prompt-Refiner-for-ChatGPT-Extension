// Listener to handle messages sent by the popup or background script
console.log("Content script is running.");


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
    refineButton.addEventListener("click", async () => {
      const targetElement = document.querySelector('div#prompt-textarea > p');
      if (targetElement) {
        const textContent = targetElement.textContent;
        if (!textContent.trim()) {
          alert("No text to refine!");
          return;
        }
        console.log("Sending text to backend:", textContent);

        // Call the backend API
        try {
          const response = await fetch("http://localhost:3000/refine", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: textContent }),
          });

          if (response.ok) {
            const data = await response.json();
            console.log("Refinements received:", data);

            // Example of handling the response
             // Send the refined data to the popup
             chrome.runtime.sendMessage({
              action: "refinedData",
              refinements: {
                message1: data.message1,
                message2: data.message2,
                message3: data.message3,
              },
            });
          } else {
            console.error("Failed to fetch refinements:", response.statusText);
            alert("Failed to fetch refinements from the backend.");
          }
        } catch (error) {
          console.error("Error connecting to the backend:", error);
          alert("Error connecting to the backend.");
        }
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
