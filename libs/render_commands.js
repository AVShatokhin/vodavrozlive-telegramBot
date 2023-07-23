const { Markup, Telegraf, button } = require("telegraf");
const commands = require("./commands");

module.exports = async (mysql, ctx, userData, data) => {
  // запрос терминалов
  let __buttons = [
    [
      Markup.button.callback(
        "К выбору АПВ",
        JSON.stringify({ cmd: "select_krug", krug_id: data.krug_id })
      ),
    ],
  ];

  Object.keys(commands).forEach((cmd) => {
    __buttons.push([
      Markup.button.callback(
        commands[cmd],
        JSON.stringify({
          cmd: "cmd_dialog",
          sn: data.sn,
          code: cmd,
          krug_id: data.krug_id,
        })
      ),
    ]);
  });

  try {
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      ctx.update.callback_query.message.message_id,
      ctx.update.callback_query.message.message_id,
      "Выбери команду для АПВ: " + data.sn,
      Markup.inlineKeyboard(__buttons)
    );
  } catch (err) {
    console.log(err);
  }
};
