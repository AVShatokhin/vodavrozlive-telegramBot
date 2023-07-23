const { Markup, Telegraf, button } = require("telegraf");
const commands = require("./commands");

module.exports = async (mysql, ctx, userData, data) => {
  // запрос терминалов
  let __buttons = [
    [
      Markup.button.callback(
        "Да",
        JSON.stringify({
          cmd: "cmd_conf",
          code: data.code,
          sn: data.sn,
          krug_id: data.krug_id,
        })
      ),
      Markup.button.callback(
        "Нет",
        JSON.stringify({
          cmd: "select_apv",
          sn: data.sn,
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
      'Подтвердите выполнение комманды "' +
        commands[data.code] +
        '" на аппарате "' +
        data.sn +
        '"',
      Markup.inlineKeyboard(__buttons)
    );
  } catch (err) {
    console.log(err);
  }
};
