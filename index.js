const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`${client.user.tag} online!`);
});

client.on('messageCreate', async (message) => {
  if (message.author.bot) return;

  try {
    const response = await fetch(
      'https://api.groq.com/openai/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: 'llama-3.3-70b-versatile',
          messages: [
            {
              role: 'system',
              content: `
Kamu adalah KEPIN AI.
Gaya bicara santai, lucu, jahil, roasting ringan, dan ceplas-ceplos.
Gunakan bahasa Indonesia.
Jangan mengancam atau menghina kelompok tertentu.
`
            },
            {
              role: 'user',
              content: message.content
            }
          ],
          temperature: 0.9
        })
      }
    );

    const data = await response.json();

    const reply =
      data.choices?.[0]?.message?.content ||
      'Otakku lagi ngelag wkwk';

    message.reply(reply.slice(0, 1900));
  } catch (err) {
    console.error(err);
    message.reply('Error bang, cek Railway.');
  }
});

client.login(process.env.DISCORD_TOKEN);
