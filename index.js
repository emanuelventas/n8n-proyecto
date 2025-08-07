const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const open = require('open');
const axios = require('axios');
require('dotenv').config();
const client = new Client({
    authStrategy: new LocalAuth({ dataPath: './session' }),
    puppeteer: {
        args: ['--no-sandbox'],
        headless: true
    }
});
client.on('qr', qr => {
    // Mostrar en consola (pequeño)
    qrcode.generate(qr, { small: true });

    
    const qrImageURL = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qr)}`;
    open(qrImageURL);

    console.log("📲 Escanea el código QR desde tu celular para conectar WhatsApp");
});

client.on('ready', () => {
    console.log('✅ Bot conectado a WhatsApp correctamente');
});
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
client.initialize();




