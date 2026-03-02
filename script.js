function acceptPolicy() {
  document.getElementById("policyOverlay").style.display = "none";
}

function declinePolicy() {
  document.body.innerHTML = `
    <div style="
      height:100vh;
      display:flex;
      justify-content:center;
      align-items:center;
      background:#0f172a;
      color:white;
      text-align:center;
      font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      padding:20px;
    ">
      <div>
        <h1>Access Restricted</h1>
        <p>BrainBoost Explorer requires acceptance of its usage policy.</p>
        <p style="opacity:0.6;font-size:13px;">
          © 2026 Vrishab Varun. All rights reserved.
        </p>
      </div>
    </div>
  `;
}

async function searchTopic(topicOverride = null) {
  const topic = topicOverride || document.getElementById("topicInput").value.trim();
  if (!topic) return;

  document.getElementById("results").style.display = "block";

  try {

    // SAFE WIKIPEDIA API CALL
    const response = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&prop=extracts|pageimages&exintro=true&explaintext=true&pithumbsize=600&titles=${encodeURIComponent(topic)}`
    );

    const data = await response.json();
    const pages = data.query.pages;
    const page = pages[Object.keys(pages)[0]];

    if (!page.extract) {
      alert("Topic not found.");
      return;
    }

    document.getElementById("title").innerText = page.title;
    document.getElementById("overview").innerText = page.extract;

    const imageContainer = document.getElementById("image");
    imageContainer.innerHTML = "";

    if (page.thumbnail) {
      imageContainer.innerHTML =
        `<img src="${page.thumbnail.source}" alt="${page.title}">`;
    }

    // RELATED SEARCH
    const relatedRes = await fetch(
      `https://en.wikipedia.org/w/api.php?action=query&format=json&origin=*&list=search&srsearch=${encodeURIComponent(topic)}&srlimit=6`
    );

    const relatedData = await relatedRes.json();
    const relatedDiv = document.getElementById("related");
    relatedDiv.innerHTML = "";

    relatedData.query.search.forEach(result => {
      const btn = document.createElement("button");
      btn.innerText = result.title;
      btn.onclick = () => searchTopic(result.title);
      relatedDiv.appendChild(btn);
    });

  } catch (error) {
    console.error(error);
    alert("Error loading topic.");
  }
}
