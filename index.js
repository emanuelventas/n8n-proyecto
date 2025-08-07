const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const open = require('open');
const axios = require('axios');
require('dotenv').config();

// Crear cliente de WhatsApp
const client = new Client({
    authStrategy: new LocalAuth({ dataPath: './session' }),
    puppeteer: {
        args: ['--no-sandbox'],
        headless: true
    }
});

// Mostrar QR cuando se genera
client.on('qr', qr => {
    // Mostrar en consola (pequeño)
    qrcode.generate(qr, { small: true });

    // Abrir en el navegador como imagen compacta
    const qrImageURL = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qr)}`;
    open(qrImageURL);

    console.log("📲 Escanea el código QR desde tu celular para conectar WhatsApp");
});

// Confirmación cuando está listo
client.on('ready', () => {
    console.log('✅ Bot conectado a WhatsApp correctamente');
});

// Escuchar mensajes entrantes
client.on('message', async msg => {
    console.log(`📩 Mensaje recibido de ${msg.from}: ${msg.body}`);

    // Enviar a n8n si está configurado
    if (process.env.WEBHOOK_N8N) {
        await axios.post(process.env.WEBHOOK_N8N, {
            from: msg.from,
            body: msg.body
        });
    }
});

// Iniciar cliente
client.initialize();

          
