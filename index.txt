
require("dotenv").config();
const venom = require("venom-bot");
const axios = require("axios");

venom
  .create({
    session: "bot-whatsapp-n8n",
    multidevice: true,
    headless: true, // No abre navegador en Render
    disableSpins: true, // Evita errores visuales en logs
    disableWelcome: true, // Desactiva mensaje de bienvenida
    logQR: process.env.SHOW_QR_IN_TERMINAL === 'true', // Muestra QR si la variable está en true
  })
  .then((client) => start(client))
  .catch((err) => {
    console.error("❌ Error al iniciar Venom:", err);
  });

function start(client) {
  client.onMessage(async (message) => {
    if (message.body && !message.isGroupMsg) {
      console.log("📥 Mensaje recibido:", message.body);

      try {
        await axios.post(process.env.N8N_WEBHOOK_URL, {
          de: message.from,
          mensaje: message.body,
        });
        console.log("✅ Enviado a n8n");

        await client.sendText(message.from, "✅ Recibido. ¡Gracias!");
      } catch (error) {
        console.error("❌ Error al enviar a n8n:", error.message);
      }
    }
  });
}
