const express = require("express");
const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const pino = require("pino");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 3000;

async function startBot() {
  const { state, saveCreds } = await useMultiFileAuthState("./auth_info");

  const sock = makeWASocket({
    logger: pino({ level: "silent" }),
    printQRInTerminal: true,
    auth: state,
  });

  sock.ev.on("creds.update", saveCreds);

  sock.ev.on("messages.upsert", async (m) => {
    const msg = m.messages[0];
    if (!msg.message) return;

    const from = msg.key.remoteJid;
    const body = msg.message.conversation || msg.message.extendedTextMessage?.text || "";

    console.log("📩 Mensaje recibido:", from, body);

    // Enviar a n8n si existe URL configurada
    if (process.env.N8N_WEBHOOK_URL) {
      try {
        await axios.post(process.env.N8N_WEBHOOK_URL, { from, body });
        console.log("✅ Enviado a n8n");
      } catch (e) {
        console.error("❌ Error enviando a n8n:", e.message);
      }
    }
  });
}

startBot();

// Render necesita que Express escuche (para que no se apague)
app.get("/", (req, res) => res.send("✅ Bot de WhatsApp corriendo en Render"));
app.listen(PORT, () => console.log("🚀 Servidor en puerto", PORT));
