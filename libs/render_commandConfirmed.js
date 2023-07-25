const { Markup, Telegraf, button } = require("telegraf");
const commands = require("./commands");

module.exports = async (mysql, ctx, userData, data, bot) => {
  let cmdProfile = { userData, cmd: data.code };

  //console.log(cmdProfile);

  await mysql.asyncQuery(mysql.SQL_BOT.BOT_getTGLink, [data.sn]).then(
    async (result) => {
      if (result[0]?.tgLink) {
        try {
          let ans = await bot.telegram.sendMessage(
            `${result[0].tgLink}`,
            `${data.sn} : Пользователем ${
              userData.email
            } через Telegram-bot поставлена в очередь на выполнение команда: \"${
              commands[data.code]
            }\"!`
          );
        } catch (e) {
          console.log("TELEGRAM_ERROR" + e?.response?.description);
        }
      } else {
        console.log("TGLINK_NOTFOUND", "Не найдена ссылка на ТГ канал");
      }
    },
    (err) => {
      console.log(err);
    }
  );

  await mysql
    .asyncQuery(mysql.SQL_BOT.BOT_setCmdByEng, [
      JSON.stringify(cmdProfile),
      data.sn,
    ])
    .then(
      (result) => {},
      (err) => {
        console.log(err);
      }
    );

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
