const params = new URLSearchParams(window.location.search);
const username = params.get("username");
const discriminator = params.get("discriminator");
const avatar = params.get("avatar");
const id = params.get("id");

if (username && discriminator && avatar && id) {
  document.getElementById("welcome-message").textContent = `Bienvenue ${username}#${discriminator}`;
  document.getElementById("user-avatar").src = `https://cdn.discordapp.com/avatars/${id}/${avatar}.png`;
  document.getElementById("user-info").classList.remove("hidden");
  document.getElementById("admin-tools").classList.remove("hidden");
  document.getElementById("login-btn").style.display = "none";
  document.getElementById("loader").classList.add("hidden");
}

document.getElementById("login-btn").addEventListener("click", () => {
  const loader = document.getElementById("loader");
  loader.classList.remove("hidden");

  setTimeout(() => {
    loader.classList.add("hidden");

    const clientId = "1382943232966529064";
    const redirectUri = "https://nexus-bot-panel-ashen.vercel.app/callback";
    const scope = "identify";
    const responseType = "code";

    const discordUrl = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${scope}`;
    window.location.href = discordUrl;
  }, 1000);
});

document.getElementById("announce-btn").addEventListener("click", async () => {
  const message = prompt("Quel message veux-tu envoyer ?");
  if (!message) return;

  try {
    const res = await fetch("https://nexus-bot-panel.onrender.com/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: message })
    });

    const text = await res.text();
    alert(text);
  } catch (err) {
    alert("❌ Erreur lors de l’envoi du message.");
    console.error(err);
  }
});