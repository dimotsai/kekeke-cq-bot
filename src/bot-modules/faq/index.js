module.exports = bot => {
  bot.hear(/(@?.+)((應該要?|要|該|可以|需要)(練|升)|(好|可以?|有)用)嗎/i, res => {
    if (res.match[1].charAt(0) !== '@') {
      res.reply(`不確定要不要練？可以問我哦(glass)，更詳細資訊請輸入 @${bot.getNickName()} help`);
    }
  });

  bot.hear(/因該/, res => {
    res.reply('http://i.imgur.com/FjPyP6c.png');
  });

  bot.hear(/名子/, res => {
    res.reply('http://imgur.com/Og9cic9.png');
  });
};
