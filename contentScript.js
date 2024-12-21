(function () {
  console.log("[Scroller Extension V0.8] Content script loaded.");

  // We'll attempt to find article elements that match data-testid^="conversation-turn-"
  // Then we'll attach the Prev/Next logic once we find them.

  let chatMessages = [];
  let detectionDone = false;

  // ---- TIMEOUT in ms
  const TIMEOUT_MS = 10000; // e.g., 10 seconds

  // ---- Start a MutationObserver
  const observer = new MutationObserver(() => {
    if (detectionDone) return; // if we already found them, ignore further mutations
    checkForArticles();
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // Also do an initial immediate check
  checkForArticles();

  // ---- We'll set a timer to abort if not found in time
  const abortTimer = setTimeout(() => {
    if (!detectionDone) {
      console.log(
        "[Scroller Extension V0.8] USO] Button detection aborting due to timeout."
      );
      observer.disconnect();
      detectionDone = true;
    }
  }, TIMEOUT_MS);

  // This function tries to locate our articles:
  function checkForArticles() {
    chatMessages = document.querySelectorAll(
      'article[data-testid^="conversation-turn-"]'
    );
    if (chatMessages.length > 0) {
      console.log(
        "[Scroller Extension V0.8] Found",
        chatMessages.length,
        "articles. Stopping observer."
      );
      // We can proceed
      finishSetup();
    } else {
      console.log(
        "[Scroller Extension V0.8] Currently found:",
        chatMessages.length,
        "– still waiting..."
      );
    }
  }

  // This function is called once we have at least 1 article
  function finishSetup() {
    detectionDone = true;
    clearTimeout(abortTimer);
    observer.disconnect();

    // 1. Create buttons
    const prevMessageButton = document.createElement("button");
    const nextMessageButton = document.createElement("button");
    prevMessageButton.textContent = "Prev Chat";
    nextMessageButton.textContent = "Next Chat";

    prevMessageButton.id = "chat-scroll-prev-message";
    nextMessageButton.id = "chat-scroll-next-message";

    document.body.appendChild(prevMessageButton);
    document.body.appendChild(nextMessageButton);
    console.log("[Scroller Extension V0.8] Buttons appended.");

    let currentIndex = 0;

    prevMessageButton.addEventListener("click", () => {
      console.log("[Scroller Extension V0.8] Prev button clicked.");
      if (chatMessages.length === 0) {
        console.log("[Scroller Extension V0.8] No articles found, cannot scroll.");
        return;
      }
      currentIndex = Math.max(0, currentIndex - 1);
      console.log("[Scroller Extension V0.8] Scrolling to index:", currentIndex);
      chatMessages[currentIndex].scrollIntoView({ behavior: "auto", block: "start" });
    });

    nextMessageButton.addEventListener("click", () => {
      console.log("[Scroller Extension V0.8] Next button clicked.");
      if (chatMessages.length === 0) {
        console.log("[Scroller Extension V0.8] No articles found, cannot scroll.");
        return;
      }
      currentIndex = Math.min(chatMessages.length - 1, currentIndex + 1);
      console.log("[Scroller Extension V0.8] Scrolling to index:", currentIndex);
      chatMessages[currentIndex].scrollIntoView({ behavior: "auto", block: "start" });
    });

    console.log("[Scroller Extension V0.8] Setup complete. Ready to scroll articles.");
  }
})();
