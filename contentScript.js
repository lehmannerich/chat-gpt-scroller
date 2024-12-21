(function () {
  console.log("[Scroller Extension V0.7] Content script loaded.");

  // 1. Create the buttons
  const prevMessageButton = document.createElement("button");
  const nextMessageButton = document.createElement("button");

  // Give them some visible text
  prevMessageButton.textContent = "Prev Chat Message";
  nextMessageButton.textContent = "Next Chat Message";

  // Give them IDs for styling
  prevMessageButton.id = "chat-scroll-prev-message";
  nextMessageButton.id = "chat-scroll-next-message";

  // 2. Identify your chat messages by 'article[data-testid^="conversation-turn-"]'
  // (the caret '^=' means "starts with")
  console.log(
    "[Scroller Extension V0.7] Searching for articles with data-testid^='conversation-turn-'..."
  );
  const chatMessages = document.querySelectorAll(
    'article[data-testid^="conversation-turn-"]'
  );
  console.log("[Scroller Extension V0.7] Found", chatMessages.length, "articles.");

  // If you need to also match the class substring, you could do:
  // const chatMessages = document.querySelectorAll('article[data-testid^="conversation-turn-"].w-full.scroll-mb-[var(--thread-trailing-height,150px)]');

  let currentIndex = 0;

  // 3. Add event listeners
  prevMessageButton.addEventListener("click", () => {
    console.log("[Scroller Extension V0.7] Prev button clicked.");

    if (!chatMessages.length) {
      console.log("[Scroller Extension V0.7] No articles found, cannot scroll.");
      return;
    }

    currentIndex = Math.max(0, currentIndex - 1);
    console.log("[Scroller Extension V0.7] currentIndex (after prev):", currentIndex);

    chatMessages[currentIndex].scrollIntoView({
      behavior: "auto",
      block: "start",
    });
    console.log("[Scroller Extension V0.7] Scrolled to message index:", currentIndex);
  });

  nextMessageButton.addEventListener("click", () => {
    console.log("[Scroller Extension V0.7] Next button clicked.");

    if (!chatMessages.length) {
      console.log("[Scroller Extension V0.7] No articles found, cannot scroll.");
      return;
    }

    currentIndex = Math.min(chatMessages.length - 1, currentIndex + 1);
    console.log("[Scroller Extension V0.7] currentIndex (after next):", currentIndex);

    chatMessages[currentIndex].scrollIntoView({
      behavior: "auto",
      block: "start",
    });
    console.log("[Scroller Extension V0.7] Scrolled to message index:", currentIndex);
  });

  // 4. Append the buttons to the document body
  document.body.appendChild(prevMessageButton);
  document.body.appendChild(nextMessageButton);

  console.log("[Scroller Extension V0.7] Buttons appended. Setup complete.");
})();

setTimeout(() => {
  const chatMessages = document.querySelectorAll(
    'article[data-testid^="conversation-turn-"]'
  );
  console.log("Found after delay:", chatMessages.length);
}, 3000);
