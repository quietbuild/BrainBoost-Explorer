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
    const summaryRes = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(topic)}`
    );
    const summaryData = await summaryRes.json();

    if (!summaryData.extract) {
      alert("Topic not found.");
      return;
    }

    document.getElementById("title").innerText = summaryData.title;
    document.getElementById("overview").innerText = summaryData.extract;

    const imageContainer = document.getElementById("image");
    imageContainer.innerHTML = "";
    if (summaryData.thumbnail) {
      imageContainer.innerHTML =
        `<img src="${summaryData.thumbnail.source}" alt="${summaryData.title}">`;
    }

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
    alert("Error loading topic.");
    console.error(error);
  }
}
