const { Markup, Telegraf, button } = require("telegraf");
const apvButton = require("./apvButton");

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
        let __line = [];
        let __lineCounter = 0;
        result.forEach((apv) => {
          __lineCounter++;
          __line.push(apvButton(apv.sn, data.krug_id));
          if (__lineCounter == 6) {
            __buttons.push(Array.from(__line));
            __line = [];
            __lineCounter = 0;
          }
        });
        if (__lineCounter != 0) __buttons.push(Array.from(__line));
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
