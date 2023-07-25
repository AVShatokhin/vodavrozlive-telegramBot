const { Markup, Telegraf, button } = require("telegraf");
const commands = require("./commands");

module.exports = (sn, krug_id) => {
  // запрос терминалов
  return Markup.button.callback(
    sn,
    JSON.stringify({
      cmd: "select_apv",
      sn,
      krug_id,
    })
  );
};
