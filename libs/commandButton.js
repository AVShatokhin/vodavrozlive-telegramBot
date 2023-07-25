const { Markup, Telegraf, button } = require("telegraf");
const commands = require("./commands");

module.exports = (cmd, sn, krug_id) => {
  // запрос терминалов
  return Markup.button.callback(
    commands[cmd],
    JSON.stringify({
      cmd: "cmd_dialog",
      sn,
      code: cmd,
      krug_id,
    })
  );
};
