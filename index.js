const { Client, LocalAuth } = require('whatsapp-web.js');
const axios = require('axios');

// URL de tu webhook de n8n (reemplaza con tu URL real)
const N8N_WEBHOOK_URL = 'https://n8n-render-1-mp3q.onrender.com/webhook-test/9ee79575-0822-46c3-8da9-8114462262ab';

// Cliente de WhatsApp con sesión guardada
const client = new Client({
    authStrategy: new LocalAuth({
        dataPath: './sesion'
    })
});

client.on('ready', () => {
    console.log('Bot conectado a WhatsApp y listo para enviar mensajes a n8n');
});

// Escucha mensajes entrantes
client.on('message', async message => {
    console.log(`Mensaje de ${message.from}: ${message.body}`);

    try {
        // Envía el mensaje a n8n
        const response = await axios.post(N8N_WEBHOOK_URL, {
            from: message.from,
            body: message.body
        });

        // Si n8n responde con texto, lo enviamos de vuelta
        if (response.data && response.data.reply) {
            await client.sendMessage(message.from, response.data.reply);
        }

    } catch (error) {
        console.error('Error enviando mensaje a n8n:', error.message);
    }
});

client.initialize();
  este si est abien 
