const { Markup, Telegraf, button } = require("telegraf");
const { message } = require("telegraf/filters");
const config = require("./etc/config");
const mysql = require("./libs/mysql-middle")(config);
const auth = require("./libs/auth");
const renderApvs = require("./libs/render_apvs");
const renderKrugs = require("./libs/render_krugs");
const renderCommands = require("./libs/render_commands");
const renderCommandDialog = require("./libs/render_commandDialog");
const renderConfirmed = require("./libs/render_commandConfirmed");

const bot = new Telegraf(config.botToken);

bot.command("quit", async (ctx) => {
  await ctx.telegram.leaveChat(ctx.message.chat.id);
  await ctx.leaveChat();
});

bot.start(async (ctx) => {
  let __userData = await auth(mysql, ctx);
  if (__userData.authed != true) return;

  await ctx.telegram.sendMessage(
    ctx.message.chat.id,
    `Приветствую: ` + __userData.email
  );

  renderKrugs(mysql, ctx, __userData, true);
});

bot.on("callback_query", async (ctx) => {
  let __userData = await auth(mysql, ctx);
  if (__userData.authed != true) return;
  let __data = JSON.parse(ctx.update.callback_query.data);

  switch (__data?.cmd) {
    case "list_krugs":
      console.log(__data);
      renderKrugs(mysql, ctx, __userData);
      break;

    case "select_krug":
      console.log(__data);
      renderApvs(mysql, ctx, __userData, __data);
      break;

    case "select_apv":
      console.log(__data);
      renderCommands(mysql, ctx, __userData, __data);
      break;

    case "cmd_dialog":
      console.log(__data);
      renderCommandDialog(mysql, ctx, __userData, __data);
      break;

    case "cmd_conf":
      console.log(__data);
      renderConfirmed(mysql, ctx, __userData, __data, bot);
      break;

    default:
      console.log("default");
      break;
  }

  await ctx.answerCbQuery();
});

// bot.callback_querycallback((ctx) => {
//   console.log(ctx);
// });

// bot.on(message("text"), async (ctx) => {
//   // Explicit usage

//   if (sessions[ctx.chat.id] == undefined) {
//     sessions[ctx.chat.id] = {
//       auth: false,
//       stage: "AUTH_START",
//     };
//   }

//   session = sessions[ctx.chat.id];

//   if (session.auth == false) {
//     switch (session.stage) {
//       case "AUTH_START":
//         await ctx.telegram.sendMessage(ctx.message.chat.id, `Enter email`);
//         session.stage = "WAITING_EMAIL";
//         break;

//       case "WAITING_EMAIL":
//         await ctx.telegram.sendMessage(ctx.message.chat.id, `Enter password`);

//         session.stage = "WAITING_PASSWORD";
//         break;

//       case "WAITING_PASSWORD":
//         session.stage = "INDEX";
//         session.auth = true;
//         break;

//       default:
//         break;
//     }
//   }

//   if (session.auth == true) {
//     await ctx.telegram.sendMessage(ctx.message.chat.id, `Wellcome`);
//     await ctx.reply("fff", Markup.removeKeyboard());
//   }
// });

// bot.on("callback_query", async (ctx) => {
//   // Explicit usage
//   await ctx.telegram.answerCbQuery(ctx.callbackQuery.id);

//   // Using context shortcut
//   await ctx.answerCbQuery();
// });

// bot.on("inline_query", async (ctx) => {
//   const result = [];
//   // Explicit usage
//   await ctx.telegram.answerInlineQuery(ctx.inlineQuery.id, result);

//   // Using context shortcut
//   await ctx.answerInlineQuery(result);
// });

bot.launch();
