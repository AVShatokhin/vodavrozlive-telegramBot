const { Markup, Telegraf, button } = require("telegraf");

module.exports = async (mysql, ctx, userData, start) => {
  // запрос терминалов
  let __buttons = [
    [
      Markup.button.callback(
        "Обновить список",
        JSON.stringify({ cmd: "list_krugs" })
      ),
    ],
  ];

  await mysql.asyncQuery(mysql.SQL_BOT.BOT_getKrugByEng, [userData.uid]).then(
    (result) => {
      result.forEach((krug) => {
        __buttons.push([
          Markup.button.callback(
            krug.krugName,
            JSON.stringify({ krug_id: krug.krug_id, cmd: "select_krug" })
          ),
        ]);
      });
    },
    (err) => {
      console.log(err);
    }
  );

  if (start == true) {
    await ctx.sendMessage("Выбери круг", Markup.inlineKeyboard(__buttons));
  } else {
    try {
      await ctx.telegram.editMessageText(
        ctx.chat.id,
        ctx.update.callback_query.message.message_id,
        ctx.update.callback_query.message.message_id,
        "Выбери круг",
        Markup.inlineKeyboard(__buttons)
      );
    } catch (err) {
      console.log(err);
    }
  }
};
