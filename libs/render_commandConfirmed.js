const { Markup, Telegraf, button } = require("telegraf");
const commands = require("./commands");

module.exports = async (mysql, ctx, userData, data) => {
  // запрос терминалов
  let __buttons = [
    [
      Markup.button.callback(
        "Вернуться к выбору АПВ",
        JSON.stringify({
          cmd: "select_krug",
          krug_id: data.krug_id,
        })
      ),
    ],
  ];

  try {
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      ctx.update.callback_query.message.message_id,
      ctx.update.callback_query.message.message_id,
      'Команда "' +
        commands[data.code] +
        '" на аппарате "' +
        data.sn +
        '" запущена на выполнение',
      Markup.inlineKeyboard(__buttons)
    );
  } catch (err) {
    console.log(err);
  }
};
