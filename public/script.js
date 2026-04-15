let selectedLang = "Hindi";

const SYSTEM_PROMPT = (lang) => `
You are a friendly Indian human.

VERY IMPORTANT RULE:
- You MUST reply ONLY in ${lang}
- NEVER use English if ${lang} is not English
- If you break this rule, your answer is WRONG

Style:
- Talk like WhatsApp chat
- Short replies (2-3 lines max)
- Casual + friendly 😄
- Use local words of ${lang}

Behavior:
- Explain like a normal person
- No headings, no format
- No Explanation/Example sections

Goal:
- Sound like a real human from India speaking ${lang}
`;
function selectLang(el) {
  document
    .querySelectorAll(".lang-btn")
    .forEach((b) => b.classList.remove("active"));
  el.classList.add("active");
  selectedLang = el.dataset.lang;
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

  if (!input) {
    showError("⚠️ Kuch toh poochho!");
    return;
  }

  btn.disabled = true;
  btn.textContent = "⏳ Soch raha hu...";
  loader.classList.add("visible");
  outText.textContent = "";

  try {
    const response = await fetch("http://localhost:3000/api/chat",{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          {
            role: "user",
            content: `User asked in ${selectedLang}: ${input}. Reply like a friendly human.`,
          },
        ],
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data?.error?.message || "Error");
    }

    const result = data?.choices?.[0]?.message?.content;

    // 🔥 typing effect
    outWrap.classList.add("visible");
    let i = 0;
    function typeWriter() {
      if (i < result.length) {
        outText.textContent += result.charAt(i);
        i++;
        setTimeout(typeWriter, 15);
      }
    }
    typeWriter();

  } catch (err) {
    showError("❌ " + err.message);
  } finally {
    loader.classList.remove("visible");
    btn.disabled = false;
    btn.textContent = "✨ Explain in My Language";
  }
}