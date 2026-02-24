async function generateContent() {
  const topic = document.getElementById("topicInput").value.trim();
  if (!topic) return alert("Enter a topic.");

  const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`);
  const data = await response.json();

  if (!data.extract) {
    alert("Topic not found.");
    return;
  }

  document.getElementById("results").classList.remove("hidden");

  const cleanText = data.extract.replace(/\[[^\]]*\]/g, "");

  generateSummary(cleanText);
  generateKeyPoints(cleanText);
  generateFlashcards(cleanText, topic);

  document.getElementById("source").innerHTML =
    `Source: <a href="${data.content_urls.desktop.page}" target="_blank">Wikipedia</a>`;
}

function generateSummary(text) {
  const sentences = text.split(". ");
  const wordFreq = {};

  text.toLowerCase().split(/\W+/).forEach(word => {
    if (word.length > 4) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  });

  const scored = sentences.map(sentence => {
    let score = 0;
    sentence.toLowerCase().split(/\W+/).forEach(word => {
      if (wordFreq[word]) score += wordFreq[word];
    });
    return { sentence, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const topSentences = scored.slice(0, 3).map(s => s.sentence).join(". ");

  document.getElementById("summary").innerText = topSentences;
}

function generateKeyPoints(text) {
  const words = text.match(/\b[A-Z][a-z]+\b/g) || [];
  const unique = [...new Set(words)].slice(0, 8);

  const list = document.getElementById("keyPoints");
  list.innerHTML = "";

  unique.forEach(word => {
    const li = document.createElement("li");
    li.textContent = word;
    list.appendChild(li);
  });
}

function generateFlashcards(text, topic) {
  const sentences = text.split(". ").slice(0, 5);

  const container = document.getElementById("flashcards");
  container.innerHTML = "";

  sentences.forEach(sentence => {
    const card = document.createElement("div");
    card.className = "flashcard";

    card.innerHTML = `
      <strong>Q:</strong> What is related to ${topic}?<br>
      <strong>A:</strong> ${sentence}
    `;

    container.appendChild(card);
  });
}
