async function generateContent() {
  const topic = document.getElementById("topicInput").value.trim();
  if (!topic) {
    alert("Enter a topic.");
    return;
  }

  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`
    );

    const data = await response.json();

    if (!data.extract) {
      alert("Topic not found.");
      return;
    }

    document.getElementById("results").classList.remove("hidden");

    const cleanText = data.extract.replace(/\[[^\]]*\]/g, "");

    generateSummary(cleanText);
    generateKeyPoints(cleanText);
    generateFlashcards(cleanText, data.title);

    document.getElementById("source").innerHTML =
      `Source: <a href="${data.content_urls.desktop.page}" target="_blank">Wikipedia</a>`;

  } catch (error) {
    alert("Error loading topic.");
    console.error(error);
  }
}

/* ========================
   CLEAN SUMMARY
======================== */
function generateSummary(text) {
  const sentences = text.split(". ").slice(0,4);
  document.getElementById("summary").innerText = sentences.join(". ") + ".";
}

/* ========================
   BETTER KEY CONCEPTS
======================== */
function generateKeyPoints(text) {
  const stopwords = [
    "the","this","that","with","from","have","were","been","into",
    "about","which","their","there","almost","most","also","only",
    "earth","planet"
  ];

  const words = text.toLowerCase().match(/\b[a-z]{5,}\b/g) || [];
  const freq = {};

  words.forEach(word => {
    if (!stopwords.includes(word)) {
      freq[word] = (freq[word] || 0) + 1;
    }
  });

  const sorted = Object.entries(freq)
    .sort((a,b) => b[1] - a[1])
    .slice(0,8)
    .map(entry => entry[0]);

  const list = document.getElementById("keyPoints");
  list.innerHTML = "";

  sorted.forEach(word => {
    const li = document.createElement("li");
    li.textContent = word.charAt(0).toUpperCase() + word.slice(1);
    list.appendChild(li);
  });
}

/* ========================
   CLEAN STATEMENT FLASHCARDS
======================== */
function generateFlashcards(text, title) {
  const sentences = text
    .split(". ")
    .filter(s => s.length > 50)
    .slice(0,6);

  const container = document.getElementById("flashcards");
  container.innerHTML = "";

  sentences.forEach(sentence => {
    const card = document.createElement("div");
    card.className = "flashcard";

    card.innerHTML = `
      <strong>${title}:</strong><br>
      ${sentence.trim()}.
    `;

    container.appendChild(card);
  });
}
