async function searchTopic(topicOverride = null) {
  const topic = topicOverride || document.getElementById("topicInput").value.trim();
  if (!topic) {
    alert("Please enter a topic.");
    return;
  }

  document.getElementById("results").classList.remove("hidden");

  try {
    const response = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/mobile-sections/${encodeURIComponent(topic)}`
    );
    const data = await response.json();

    if (!data.lead) {
      alert("Topic not found.");
      return;
    }

    // Overview
    let introText = "";
    data.lead.sections.forEach(section => {
      introText += section.text + " ";
    });

    introText = introText
      .replace(/<[^>]+>/g, "")
      .replace(/\[[^\]]*\]/g, "")
      .trim();

    document.getElementById("overview").innerText =
      introText.split(". ").slice(0,4).join(". ") + ".";

    // Sections
    const sectionsDiv = document.getElementById("sections");
    sectionsDiv.innerHTML = "";
    (data.remaining?.sections || []).slice(0,8).forEach(section => {
      if (section.line) {
        const btn = document.createElement("button");
        btn.innerText = section.line;
        btn.onclick = () => {
          const content = section.text
            .replace(/<[^>]+>/g, "")
            .replace(/\[[^\]]*\]/g, "")
            .trim();
          document.getElementById("overview").innerText =
            content.split(". ").slice(0,5).join(". ") + ".";
        };
        sectionsDiv.appendChild(btn);
      }
    });

    // Related Topics
    const relatedDiv = document.getElementById("related");
    relatedDiv.innerHTML = "";
    (data.lead.sections[0].links || []).slice(0,10).forEach(link => {
      const btn = document.createElement("button");
      btn.innerText = link.text;
      btn.onclick = () => searchTopic(link.text);
      relatedDiv.appendChild(btn);
    });

  } catch (error) {
    alert("Error loading topic.");
    console.error(error);
  }
}
