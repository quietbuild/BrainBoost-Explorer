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

    document.getElementById("summary").innerText = data.extract;

    document.getElementById("keyPoints").innerHTML = `
      <li>Article Title: ${data.title}</li>
      <li>Length: ${data.extract.length} characters</li>
    `;

    document.getElementById("flashcards").innerHTML = `
      <div class="flashcard">
        <strong>Key Fact:</strong><br>
        ${data.extract.split(". ")[0]}
      </div>
    `;

    document.getElementById("source").innerHTML =
      `Source: <a href="${data.content_urls.desktop.page}" target="_blank">Wikipedia</a>`;

  } catch (error) {
    alert("Error loading topic.");
    console.error(error);
  }
}
