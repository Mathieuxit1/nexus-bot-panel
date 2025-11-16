const express = require("express");
const axios = require("axios");
const app = express();

app.use(express.json());

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const BOT_TOKEN = process.env.BOT_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID;

app.get("/callback", async (req, res) => {
    const code = req.query.code;

    const params = new URLSearchParams();
    params.append("client_id", CLIENT_ID);
    params.append("client_secret", CLIENT_SECRET);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append("redirect_uri", REDIRECT_URI);
    params.append("scope", "identify");

    try {
        const tokenRes = await axios.post("https://discord.com/api/oauth2/token", params, {
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
        });

        const accessToken = tokenRes.data.access_token;

        const userRes = await axios.get("https://discord.com/api/users/@me", {
            headers: { Authorization: `Bearer ${accessToken}` }
        });

        const user = userRes.data;

        res.redirect(`https://site-peach-omega.vercel.app/?username=${encodeURIComponent(user.username)}&discriminator=${user.discriminator}&id=${user.id}&avatar=${user.avatar}`);
    } catch (err) {
        console.error("Erreur OAuth2 Discord :", err);
        res.send("Erreur lors de la connexion à Discord.");
    }
});

app.post("/send-message", async (req, res) => {
    const { content } = req.body;
    if (!content) return res.status(400).send("Message vide");

    try {
        await axios.post(`https://discord.com/api/v10/channels/${CHANNEL_ID}/messages`, {
            content: content
        }, {
            headers: {
                Authorization: `Bot ${BOT_TOKEN}`,
                "Content-Type": "application/json"
            }
        });

        res.send("✅ Message envoyé !");
    } catch (err) {
        console.error("Erreur Discord :", err.response?.data || err.message);
        res.status(500).send("Erreur lors de l’envoi du message.");
    }
});

app.listen(3000, () => {
    console.log("✅ Serveur lancé sur http://localhost:3000");
});