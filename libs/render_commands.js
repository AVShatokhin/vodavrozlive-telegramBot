const { Markup, Telegraf, button } = require("telegraf");
const commands = require("./commands");
const commandButton = require("./commandButton");

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

  __buttons.push([commandButton("info", data.sn, data.krug_id)]);
  __buttons.push([commandButton("app:reset", data.sn, data.krug_id)]);
  __buttons.push([
    commandButton("app:on", data.sn, data.krug_id),
    commandButton("app:off", data.sn, data.krug_id),
  ]);
  __buttons.push([
    commandButton("tara:on", data.sn, data.krug_id),
    commandButton("tara:off", data.sn, data.krug_id),
  ]);
  __buttons.push([commandButton("tara:pop", data.sn, data.krug_id)]);
  __buttons.push([
    commandButton("temp:on", data.sn, data.krug_id),
    commandButton("temp:off", data.sn, data.krug_id),
  ]);
  __buttons.push([
    commandButton("kup:on", data.sn, data.krug_id),
    commandButton("kup:off", data.sn, data.krug_id),
  ]);
  __buttons.push([
    commandButton("mon:on", data.sn, data.krug_id),
    commandButton("mon:off", data.sn, data.krug_id),
  ]);
  __buttons.push([
    commandButton("rd:on", data.sn, data.krug_id),
    commandButton("rd:off", data.sn, data.krug_id),
  ]);

  __buttons.push([commandButton("alarm:off", data.sn, data.krug_id)]);

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
