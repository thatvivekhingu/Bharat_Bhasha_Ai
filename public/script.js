

let selectedLang = "Hindi";

const SYSTEM_PROMPT = `You are BharatBhasha AI, a helpful assistant that explains topics in simple language for Indian users.

Rules:
1. Respond ONLY in the language the user specifies (Hindi, Gujarati, Tamil, etc.)
2. Use simple vocabulary common people understand
3. Structure your answer exactly like this:

📖 Explanation:
[Simple 3-4 sentence explanation in chosen language]

💡 Real-life Example:
[A relatable Indian example]

🔖 Key Word:
[Main term] = [Simple meaning]

4. For medical/legal topics always add: ⚠️ Kisi expert se zaroor milein
5. Never respond to harmful, violent, or illegal content`;

function selectLang(el) {
  document
    .querySelectorAll(".lang-btn")
    .forEach((b) => b.classList.remove("active"));
  el.classList.add("active");
  selectedLang = el.dataset.lang;
}

function fillExample(text) {
  document.getElementById("userInput").value = text;
}

function showError(msg) {
  const b = document.getElementById("errorBox");
  b.textContent = msg;
  b.classList.add("visible");
}

async function generate() {
  const input = document.getElementById("userInput").value.trim();
  const btn = document.getElementById("genBtn");
  const loader = document.getElementById("loader");
  const outWrap = document.getElementById("outputWrap");
  const outText = document.getElementById("outputText");
  const errBox = document.getElementById("errorBox");

  errBox.classList.remove("visible");
  outWrap.classList.remove("visible");
  outText.textContent = "";

  if (!input) {
    showError("⚠️ Kuch toh poochho! Question box khali hai.");
    return;
  }

  btn.disabled = true;
  btn.textContent = "⏳ Generating...";
  loader.classList.add("visible");

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 600,
        temperature: 0.7,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `Explain this topic in ${selectedLang}: "${input}"`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) throw new Error("Invalid API key ❌");
      if (response.status === 429)
        throw new Error("Rate limit ⏳ — thodi der baad try karo.");
      throw new Error(data?.error?.message || `Error ${response.status}`);
    }

    const result = data?.choices?.[0]?.message?.content;
    if (!result) throw new Error("Koi response nahi aaya.");

    outText.textContent = result;
    outWrap.classList.add("visible");
  } catch (err) {
    showError(
      "❌ " +
        (err.name === "TypeError"
          ? "Network error — internet check karo."
          : err.message)
    );
  } finally {
    loader.classList.remove("visible");
    btn.disabled = false;
    btn.textContent = "✨ Explain in My Language";
  }
}