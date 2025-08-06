// src/index.js
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

// Evento: Mostrar QR
client.on('qr', qr => {
    // Mostrar QR pequeño en consola
    qrcode.generate(qr, { small: true });

    // También mostrar el QR en el navegador
    const qrImageURL = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qr)}`;
    open(qrImageURL);

    console.log('📲 Escanea el código QR en el navegador o consola para conectar tu WhatsApp');
});

// Evento: Conexión lista
client.on('ready', () => {
    console.log('✅ Bot conectado a WhatsApp');
});

// Evento: Mensaje recibido
client.on('message', async msg => {
    console.log(`📩 Mensaje recibido de ${msg.from}: ${msg.body}`);

    // Enviar a n8n vía Webhook
    await axios.post(process.env.WEBHOOK_N8N, {
        from: msg.from,
        body: msg.body
    });
});

// Iniciar cliente
client.initialize();




