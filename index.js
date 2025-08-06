const { Client, LocalAuth } = require('whatsapp-web.js');
    const qrcode = require('qrcode-terminal');
    const open = require('open');

    qrcode.generate(qr, { small: true });

    const qrImageURL = `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qr)}`;
    open(qrImageURL);

    console.log('📲 Escanea el código QR en el navegador o la consola para conectar tu WhatsApp');
});

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



