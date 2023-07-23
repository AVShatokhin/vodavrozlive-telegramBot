const { Markup, Telegraf, button } = require("telegraf");

module.exports = async (mysql, ctx, userData, data) => {
  // запрос терминалов
  let __buttons = [
    [Markup.button.callback("Круги", JSON.stringify({ cmd: "list_krugs" }))],
    [
      Markup.button.callback(
        "Обновить список",
        JSON.stringify({ cmd: "select_krug", krug_id: data.krug_id })
      ),
    ],
  ];

  await mysql
    .asyncQuery(mysql.SQL_BOT.BOT_getApvByEng, [userData.uid, data.krug_id])
    .then(
      (result) => {
        result.forEach((apv) => {
          __buttons.push([
            Markup.button.callback(
              apv.krugName + " : " + apv.sn,
              JSON.stringify({
                sn: apv.sn,
                cmd: "select_apv",
                krug_id: data.krug_id,
              })
            ),
          ]);
        });
      },
      (err) => {
        console.log(err);
      }
    );

  try {
    await ctx.telegram.editMessageText(
      ctx.chat.id,
      ctx.update.callback_query.message.message_id,
      ctx.update.callback_query.message.message_id,
      "Выбери аппарат",
      Markup.inlineKeyboard(__buttons)
    );
  } catch (err) {
    console.log(err);
  }
};
