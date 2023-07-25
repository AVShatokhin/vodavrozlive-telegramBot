module.exports = async (mysql, ctx) => {
  let __userData = { authed: false };

  await mysql.asyncQuery(mysql.SQL_BOT.BOT_getAllUsers, []).then(
    (result) => {
      result.forEach((user) => {
        let __extended = JSON.parse(user.extended);
        if (__extended.phone == ctx.from.id) {
          __userData = user;
          __userData.authed = true;
          __userData.bot = true;
          __userData.extended = JSON.parse(__userData.extended);
          __userData.roles = JSON.parse(__userData.roles);
        }
      });
    },
    (err) => {
      console.log(err);
    }
  );

  if (__userData.authed == false) {
    await ctx.telegram.sendMessage(
      ctx.message.chat.id,
      `Сообщите Ваш ID администратору: ` + ctx.from.id
    );
  }

  return __userData;
};
