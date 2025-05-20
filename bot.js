require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { enregistrerUtilisateur } = require('./db');

const bot = new TelegramBot(process.env.TELEGRAM_TOKEN, { polling: true });

const sessions = {};

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  sessions[chatId] = { step: 'nom' };
  bot.sendMessage(chatId, 'Bienvenue ! Quel est votre nom ?');
});

bot.on('message', async (msg) => {
  const chatId = msg.chat.id;

  if (!sessions[chatId]) return;

  const session = sessions[chatId];

  switch (session.step) {
    case 'nom':
      session.nom = msg.text;
      session.step = 'prenom';
      bot.sendMessage(chatId, 'Merci. Quel est votre prénom ?');
      break;

    case 'prenom':
      session.prenom = msg.text;
      session.step = 'email';
      bot.sendMessage(chatId, 'Parfait. Quel est votre adresse email ?');
      break;

    case 'email':
      session.email = msg.text;

      try {
        await enregistrerUtilisateur(chatId.toString(), session.nom, session.prenom, session.email);
        bot.sendMessage(chatId, `✅ Merci ${session.prenom}, vous êtes enregistré avec succès !`);
      } catch (err) {
        bot.sendMessage(chatId, `❌ Une erreur s'est produite : ${err.message}`);
      }

      delete sessions[chatId];
      break;
  }
});
