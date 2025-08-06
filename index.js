const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
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
    qrcode.generate(qr, { small: true });
    console.log('📲 Escanea el código QR para conectar tu WhatsApp');
});

client.on('ready', () => {
    console.log('✅ Bot conectado a WhatsApp');
});

client.on('message', async msg => {
    console.log(`📩 Mensaje recibido de ${msg.from}: ${msg.body}`);

    await axios.post(process.env.WEBHOOK_N8N, {
        from: msg.from,
        body: msg.body
    });
});

client.initialize();


