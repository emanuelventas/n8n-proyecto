const { Client, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');
require('dotenv').config();

// Crear cliente usando sesión guardada
const client = new Client({
    authStrategy: new LocalAuth({ dataPath: './session' }),
    puppeteer: {
        args: ['--no-sandbox'],
        headless: true
    }
});

// Confirmación cuando está listo
client.on('ready', () => {
    console.log('✅ Bot conectado desde Render con sesión guardada.');
});

// Escuchar mensajes y reenviar a n8n
client.on('message', async msg => {
    console.log(`📩 Mensaje recibido de ${msg.from}: ${msg.body}`);

    if (process.env.WEBHOOK_N8N) {
        try {
            await axios.post(process.env.WEBHOOK_N8N, {
                from: msg.from,
                body: msg.body
            });
            console.log('📤 Enviado a n8n correctamente.');
        } catch (err) {
            console.error('❌ Error al enviar a n8n:', err.message);
        }
    }
});

client.initialize();
