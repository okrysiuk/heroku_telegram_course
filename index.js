const TelegramBot = require('node-telegram-bot-api');
const token = '650153847:AAGbuBrbZYhtcsz1egHzp1AfhfAZJZeZxr8';
const bot = new TelegramBot(token, {polling: true});
const request = require('request');

bot.onText(/\/kurs/, (msg, match) => {
  const chatId = msg.chat.id;
  const resp = match[1];
  bot.sendMessage(chatId, 'Оберіть валюту, яка Вас цікавить:', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text:'€ EUR',
            callback_data: 'EUR'
          },
          {
            text:'$ USD',
            callback_data: 'USD'
          },
          {
            text:'₽ RUR',
            callback_data: 'RUR'
          },
          {
            text:'₿ BTC',
            callback_data: 'BTC'
          }
        ]
      ]
    }
  });
});
bot.on('callback_query', query => {
  const id = query.message.chat.id;
  request('https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5', function(error, response, body){
    const data = JSON.parse(body);
    const result =data.filter(item => item.ccy === query.data)[0];
    let md = `
    *${result.ccy} => ${result.base_ccy}*
    Купівля: _${result.buy}_
    Продаж: _${result.sale}_
    `;
    bot.sendMessage(id, md, {parse_mode: 'Markdown'});
  });
});

/*bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Received your message');
});*/
